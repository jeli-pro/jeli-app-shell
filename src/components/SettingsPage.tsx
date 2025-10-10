import { SettingsContent } from './SettingsContent';
import { useAutoAnimateTopBar } from '@/hooks/useAutoAnimateTopBar';
import { PageHeader } from './PageHeader';

export function SettingsPage() {
  const { onScroll } = useAutoAnimateTopBar();

  return (
    <div
      className="h-full overflow-y-auto p-6 lg:px-12 space-y-8"
      onScroll={onScroll}
    >
      {/* Header */}
      <PageHeader
        title="Settings"
        description="Customize your experience. Changes are saved automatically."
      />
      <SettingsContent />
    </div>
  )
}