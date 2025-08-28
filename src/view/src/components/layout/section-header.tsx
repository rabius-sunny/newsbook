interface SectionHeaderProps {
  title: string
  className?: string
}

export default function SectionHeader({ title, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center mb-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 bg-red-600 text-white px-3 py-1 rounded">{title}</h2>
      <div className="flex-1 h-px bg-gray-300 ml-4"></div>
    </div>
  )
}
