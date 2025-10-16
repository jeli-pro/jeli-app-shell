import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddDataItemCtaProps {
  viewMode: 'list' | 'cards' | 'grid' | 'table'
  colSpan?: number
}

export function AddDataItemCta({ viewMode, colSpan }: AddDataItemCtaProps) {
  const isTable = viewMode === 'table'
  const isList = viewMode === 'list'
  const isCard = viewMode === 'cards' || viewMode === 'grid'

  const content = (
    <div
      className={cn(
        "flex items-center justify-center text-center w-full h-full p-6 gap-6",
        isCard && "flex-col min-h-[300px]",
        isList && "flex-row",
        isTable && "flex-row py-8",
      )}
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-primary/10 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center text-primary">
          <Plus className="w-8 h-8" />
        </div>
      </div>
      <div className={cn("flex-1", isCard && "text-center", isList && "text-left", isTable && "text-left")}>
        <h3 className="font-semibold text-lg mb-1 text-primary">
          Showcase Your Own Data
        </h3>
        <p className="text-muted-foreground text-sm">
          Click here to add a new item and see how it looks across all views in the demo.
        </p>
      </div>
    </div>
  )

  if (isTable) {
    return (
      <tr className="group transition-colors duration-200 hover:bg-accent/20 cursor-pointer">
        <td colSpan={colSpan}>
          {content}
        </td>
      </tr>
    )
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border-2 border-dashed border-border bg-transparent transition-all duration-300 cursor-pointer",
        "hover:bg-accent/50 hover:border-primary/30",
        isList && "rounded-2xl"
      )}
    >
      {content}
    </div>
  )
}