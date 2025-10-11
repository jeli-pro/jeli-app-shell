import * as React from 'react'

interface SettingsSectionProps {
  icon: React.ReactElement
  title: string
  children: React.ReactNode
}

export function SettingsSection({ icon, title, children }: SettingsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        {React.cloneElement(icon, { className: 'w-4 h-4' })}
        {title}
      </h3>
      {children}
    </div>
  )
}