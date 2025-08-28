export const routeConfigs = {
  admin: {
    excludedRoutes: ['/admin/login', '/admin/forget-password'], // Routes that bypass admin middleware
    protectedRoutes: ['/admin'], // All routes under `/admin` are protected
    tokenKey: 'adminToken', // Cookie key for admin token
    loginPath: '/admin/login', // Redirect path when unauthorized
    defaultPath: '/admin/dashboard' // Redirect path when already authenticated
  },
  superAdmin: {
    excludedRoutes: ['/super-admin/login'], // Routes that bypass admin middleware
    protectedRoutes: ['/super-admin'], // All routes under `/super-admin` are protected
    tokenKey: 'superAdminToken', // Cookie key for super admin token
    loginPath: '/super-admin/login', // Redirect path when unauthorized
    defaultPath: '/super-admin' // Redirect path when already authenticated
  },
  user: {
    excludedRoutes: ['/login', '/forget-password', '/register'], // Routes that bypass user middleware
    protectedRoutes: ['/user', '/account', '/checkout'], // All routes under `/user` are protected
    tokenKey: 'token', // Cookie key for user token
    loginPath: '/login', // Redirect path when unauthorized
    defaultPath: '/user/profile' // Redirect path when already authenticated
  },
  authRoutes: [
    '/login',
    '/admin/login',
    '/admin/forget-password',
    '/register',
    '/super-admin/login'
  ]
}
