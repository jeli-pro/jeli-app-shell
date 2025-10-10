import { SettingsContent } from './SettingsContent';
import { useAutoAnimateTopBar } from '@/hooks/useAutoAnimateTopBar';

export function SettingsPage() {
  const { onScroll } = useAutoAnimateTopBar();

  return (
    <div
      className="h-full overflow-y-auto p-6 lg:px-12 space-y-8"
      onScroll={onScroll}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Customize your experience. Changes are saved automatically.
          </p>
        </div>
      </div>

      <SettingsContent />
    </div>
  )
}