import { ChevronsLeftRight } from 'lucide-react'

interface ContentInSidePanePlaceholderProps {
  icon: React.ElementType
  title: string
  pageName: string
  onBringBack: () => void
}

export function ContentInSidePanePlaceholder({
  icon: Icon,
  title,
  pageName,
  onBringBack,
}: ContentInSidePanePlaceholderProps) {
  const capitalizedPageName = pageName
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 h-full">
      <Icon className="w-16 h-16 text-muted-foreground/50 mb-4" />
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        You've moved {pageName} to the side pane. You can bring it back or
        continue to navigate.
      </p>
      <button
        onClick={onBringBack}
        className="mt-6 bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10"
      >
        <ChevronsLeftRight className="w-5 h-5" />
        <span>Bring {capitalizedPageName} Back</span>
      </button>
    </div>
  )
}