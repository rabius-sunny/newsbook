import { Clock } from "lucide-react"

interface SidebarNewsProps {
  news: Array<{
    id: number
    title: string
    time: string
    category: string
  }>
}

export default function SidebarNews({ news }: SidebarNewsProps) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">সর্বশেষ সংবাদ</h3>
      <div className="space-y-4">
        {news.map((item) => (
          <article key={item.id} className="group cursor-pointer">
            <h4 className="font-medium text-gray-900 text-sm mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
              {item.title}
            </h4>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="text-red-600 font-medium">{item.category}</span>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{item.time}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
