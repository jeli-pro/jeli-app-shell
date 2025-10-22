import { useParams, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getViewById, type ViewId } from '@/views/viewRegistry';
import { useSelectedItem } from '@/pages/DataDemo/store/dataDemo.store';

interface ViewRendererProps {
  viewId: ViewId | string | null;
  className?: string;
}

export function ViewRenderer({ viewId, className }: ViewRendererProps) {
  const view = getViewById(viewId);
  const { conversationId, itemId: pathItemId } = useParams();
  const [searchParams] = useSearchParams();
  const sidePaneItemId = searchParams.get('itemId');

  // Specific logic for views that need props
  const selectedItem = useSelectedItem(pathItemId || sidePaneItemId || undefined);

  if (!view) {
    return (
      <div className="p-6 text-muted-foreground">
        View not found: {viewId}
      </div>
    );
  }

  const { component: Component, hasOwnScrolling } = view;

  let componentProps: any = {};
  if (viewId === 'dataItemDetail') {
    if (!selectedItem) {
      return (
        <div className="p-6 text-muted-foreground">
          Item not found.
        </div>
      );
    }
    componentProps = { item: selectedItem };
  } else if (viewId === 'messaging') {
    componentProps = { conversationId };
  }

  const content = <Component {...componentProps} />;

  if (hasOwnScrolling) {
    return content;
  }

  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      {content}
    </div>
  );
}