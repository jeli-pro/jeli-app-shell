import React from 'react';
import { Mail, Phone, Briefcase } from 'lucide-react';
import type { Contact } from '../types';

const DetailRow: React.FC<{icon: React.ReactNode, children: React.ReactNode}> = ({ icon, children }) => (
    <div className="flex items-start gap-3 text-sm">
        <div className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0">{icon}</div>
        <div className="flex-1 text-foreground/90 break-all">{children}</div>
    </div>
);

interface ContactInfoPanelProps {
  contact: Contact;
}

export const ContactInfoPanel: React.FC<ContactInfoPanelProps> = ({ contact }) => {
    return (
        <div className="space-y-4">
            <DetailRow icon={<Mail />}>{contact.email}</DetailRow>
            <DetailRow icon={<Phone />}>{contact.phone}</DetailRow>
            <DetailRow icon={<Briefcase />}>
                {contact.role} at <strong>{contact.company}</strong>
            </DetailRow>
        </div>
    )
}