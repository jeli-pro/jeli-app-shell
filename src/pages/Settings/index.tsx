import { SettingsContent } from '@/features/settings/SettingsContent';
import { useAutoAnimateTopBar } from '@/hooks/useAutoAnimateTopBar';
import { PageHeader } from '@/components/shared/PageHeader';

export function SettingsPage() {
  const { onScroll } = useAutoAnimateTopBar();

  return (
    <div
      className="h-full overflow-y-auto"
      onScroll={onScroll}
    >
      <div className="p-6 lg:px-12 space-y-8">
        {/* Header */}
        <PageHeader
          title="Settings"
          description="Customize your experience. Changes are saved automatically."
        />
        <SettingsContent />
      </div>
    </div>
  )
}