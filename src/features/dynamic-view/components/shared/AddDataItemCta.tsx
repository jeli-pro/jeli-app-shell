import { PlusCircle } from 'lucide-react';
export function AddDataItemCta({ viewMode, colSpan }: { viewMode: string, colSpan?: number }) {
  if (viewMode === 'table') {
    return (
      <tr>
        <td colSpan={colSpan} className="p-4 text-center">
          <button className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mx-auto">
            <PlusCircle className="w-4 h-4" /> Add new item
          </button>
        </td>
      </tr>
    )
  }
  return (
    <div className="flex justify-center p-4">
        <button className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
        <PlusCircle className="w-4 h-4" /> Add new item
        </button>
    </div>
  );
}