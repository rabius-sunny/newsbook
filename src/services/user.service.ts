import { eq, desc, asc, like, and, count } from 'drizzle-orm';
import { db } from '../db/index';
import { users, articles } from '../db/schema';
import {
  ServiceResult,
  User,
  UserPublic,
  CreateUser,
  SearchParams,
  UserFilters
} from '../types';

export class UserService {
  // Get all users with filters
  async getUsers(params: SearchParams & UserFilters): Promise<
    ServiceResult<{
      users: UserPublic[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    try {
      const {
        page = 1,
        limit = 10,
        query,
        role,
        isActive,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions = [];

      if (query) {
        conditions.push(like(users.name, `%${query}%`));
      }

      if (role) {
        conditions.push(eq(users.role, role));
      }

      if (typeof isActive === 'boolean') {
        conditions.push(eq(users.isActive, isActive));
      }

      // Apply sorting
      const orderColumn =
        sortBy === 'name'
          ? users.name
          : sortBy === 'email'
          ? users.email
          : sortBy === 'role'
          ? users.role
          : users.createdAt;

      const orderDirection =
        sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn);

      // Get users with pagination
      let baseQuery = db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          nameBn: users.nameBn,
          bio: users.bio,
          bioBn: users.bioBn,
          avatar: users.avatar,
          role: users.role,
          isActive: users.isActive,
          lastLoginAt: users.lastLoginAt,
          createdAt: users.createdAt
        })
        .from(users);

      if (conditions.length > 0) {
        baseQuery = (baseQuery as any).where(and(...conditions));
      }

      const usersData = await baseQuery
        .orderBy(orderDirection)
        .limit(limit)
        .offset(offset);

      // Get total count
      let countQuery = db.select({ count: count() }).from(users);

      if (conditions.length > 0) {
        countQuery = (countQuery as any).where(and(...conditions));
      }

      const [{ count: totalCount }] = await countQuery;

      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users: usersData,
          total: totalCount,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error getting users:', error);
      return {
        success: false,
        message: 'Failed to retrieve users',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get single user by ID
  async getUserById(id: string): Promise<ServiceResult<UserPublic>> {
    try {
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          nameBn: users.nameBn,
          bio: users.bio,
          bioBn: users.bioBn,
          avatar: users.avatar,
          role: users.role,
          createdAt: users.createdAt
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          errors: ['User with this ID does not exist']
        };
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return {
        success: false,
        message: 'Failed to retrieve user',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<ServiceResult<User>> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          errors: ['User with this email does not exist']
        };
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return {
        success: false,
        message: 'Failed to retrieve user',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Create new user
  async createUser(data: CreateUser): Promise<ServiceResult<UserPublic>> {
    try {
      const [newUser] = await db.insert(users).values(data).returning({
        id: users.id,
        email: users.email,
        name: users.name,
        nameBn: users.nameBn,
        bio: users.bio,
        bioBn: users.bioBn,
        avatar: users.avatar,
        role: users.role,
        createdAt: users.createdAt
      });

      return {
        success: true,
        message: 'User created successfully',
        data: newUser
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        message: 'Failed to create user',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Update user
  async updateUser(
    id: string,
    data: Partial<CreateUser>
  ): Promise<ServiceResult<UserPublic>> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
          nameBn: users.nameBn,
          bio: users.bio,
          bioBn: users.bioBn,
          avatar: users.avatar,
          role: users.role,
          createdAt: users.createdAt
        });

      if (!updatedUser) {
        return {
          success: false,
          message: 'User not found',
          errors: ['User with this ID does not exist']
        };
      }

      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        message: 'Failed to update user',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<ServiceResult<void>> {
    try {
      // Check if user has articles
      const [articleCount] = await db
        .select({ count: count() })
        .from(articles)
        .where(eq(articles.authorId, id));

      if (articleCount.count > 0) {
        return {
          success: false,
          message: 'Cannot delete user',
          errors: ['User has articles associated with them']
        };
      }

      const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();

      if (!deletedUser) {
        return {
          success: false,
          message: 'User not found',
          errors: ['User with this ID does not exist']
        };
      }

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: 'Failed to delete user',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get user profile with statistics
  async getUserProfile(id: string): Promise<
    ServiceResult<
      UserPublic & {
        stats: {
          totalArticles: number;
          publishedArticles: number;
          totalViews: number;
          totalComments: number;
        };
      }
    >
  > {
    try {
      const userResult = await this.getUserById(id);
      if (!userResult.success || !userResult.data) {
        return userResult as any;
      }

      // Get user statistics
      const [stats] = await db
        .select({
          totalArticles: count(articles.id),
          publishedArticles: count(articles.id)
          // totalViews: sum(articles.viewCount),
          // totalComments: sum(articles.commentCount),
        })
        .from(articles)
        .where(eq(articles.authorId, id));

      const userWithStats = {
        ...userResult.data,
        stats: {
          totalArticles: stats.totalArticles || 0,
          publishedArticles: stats.publishedArticles || 0,
          totalViews: 0, // Will be calculated separately if needed
          totalComments: 0 // Will be calculated separately if needed
        }
      };

      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: userWithStats
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return {
        success: false,
        message: 'Failed to retrieve user profile',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Update last login
  async updateLastLogin(id: string): Promise<ServiceResult<void>> {
    try {
      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, id));

      return {
        success: true,
        message: 'Last login updated'
      };
    } catch (error) {
      console.error('Error updating last login:', error);
      return {
        success: false,
        message: 'Failed to update last login',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get users by role
  async getUsersByRole(role: string): Promise<ServiceResult<UserPublic[]>> {
    try {
      const usersData = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          nameBn: users.nameBn,
          bio: users.bio,
          bioBn: users.bioBn,
          avatar: users.avatar,
          role: users.role,
          createdAt: users.createdAt
        })
        .from(users)
        .where(and(eq(users.role, role), eq(users.isActive, true)))
        .orderBy(asc(users.name));

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: usersData
      };
    } catch (error) {
      console.error('Error getting users by role:', error);
      return {
        success: false,
        message: 'Failed to retrieve users',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}
