import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'success' | 'error' | 'warning';
type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

const variantColors = {
  default: 'border-border text-foreground hover:bg-muted/10 dark:hover:bg-muted/20',
  success: 'border-green-600 text-green-600 hover:bg-green-600/10 dark:hover:bg-green-400/20',
  error: 'border-destructive text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20',
  warning: 'border-amber-600 text-amber-600 hover:bg-amber-600/10 dark:hover:bg-amber-400/20',
}

export function ToasterDemo() {
  const toast = useToast();

  const showToast = (variant: Variant, position: Position = 'bottom-right') => {
    toast.show({
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Notification`,
      message: `This is a ${variant} toast notification.`,
      variant,
      position,
      duration: 3000,
      onDismiss: () =>
        console.log(`${variant} toast at ${position} dismissed`),
    });
  };

  const simulateApiCall = async () => {
    toast.show({
      title: 'Scheduling...',
      message: 'Please wait while we schedule your meeting.',
      variant: 'default',
      position: 'bottom-right',
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.show({
        title: 'Meeting Scheduled',
        message: 'Your meeting is scheduled for July 4, 2025, at 3:42 PM IST.',
        variant: 'success',
        position: 'bottom-right',
        highlightTitle: true,
        actions: {
          label: 'Undo',
          onClick: () => console.log('Undoing meeting schedule'),
          variant: 'outline',
        },
      });
    } catch (error) {
      toast.show({
        title: 'Error Scheduling Meeting',
        message: 'Failed to schedule the meeting. Please try again.',
        variant: 'error',
        position: 'bottom-right',
      });
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 lg:px-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Toaster</h1>
          <p className="text-muted-foreground">
            A customizable toast component for notifications.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-2">Toast Variants</h2>
            <div className="flex flex-wrap gap-4">
              {(['default', 'success', 'error', 'warning'] as Variant[]).map((variantKey) => (
                <Button
                  key={variantKey}
                  variant="outline"
                  onClick={() => showToast(variantKey as Variant)}
                  className={cn(variantColors[variantKey])}
                >
                  {variantKey.charAt(0).toUpperCase() + variantKey.slice(1)} Toast
                </Button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Toast Positions</h2>
            <div className="flex flex-wrap gap-4">
              {[
                'top-left',
                'top-center',
                'top-right',
                'bottom-left',
                'bottom-center',
                'bottom-right',
              ].map((positionKey) => (
                <Button
                  key={positionKey}
                  variant="outline"
                  onClick={() =>
                    showToast('default', positionKey as Position)
                  }
                  className="border-border text-foreground hover:bg-muted/10 dark:hover:bg-muted/20"
                >
                  {positionKey
                    .replace('-', ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </Button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Real‑World Example</h2>
            <Button
              variant="outline"
              onClick={simulateApiCall}
              className="border-border text-foreground hover:bg-muted/10 dark:hover:bg-muted/20"
            >
              Schedule Meeting
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}