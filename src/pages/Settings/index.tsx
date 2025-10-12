import { SettingsContent } from '@/features/settings/SettingsContent';
import { useAutoAnimateTopBar } from '@/hooks/useAutoAnimateTopBar';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageLayout } from '@/components/shared/PageLayout';

export function SettingsPage() {
  const { onScroll } = useAutoAnimateTopBar();

  return (
    <PageLayout onScroll={onScroll}>
      {/* Header */}
      <PageHeader
        title="Settings"
        description="Customize your experience. Changes are saved automatically."
      />
      <SettingsContent />
    </PageLayout>
  )
}