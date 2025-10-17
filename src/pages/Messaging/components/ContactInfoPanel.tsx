import React from 'react';
import { Mail, Phone } from 'lucide-react';
import type { Contact } from '../types';
import { useMessagingStore } from '../store/messaging.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    const getContactsByCompany = useMessagingStore(state => state.getContactsByCompany);
    const colleagues = getContactsByCompany(contact.company, contact.id);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-3">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="text-2xl">{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-bold">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                    <p className="text-sm text-muted-foreground font-medium">{contact.company}</p>
                </div>
            </div>
            
            <div className="border-b" />

            {/* Contact Details */}
            <div className="space-y-3">
                <h4 className="font-semibold text-sm">Contact Details</h4>
                <DetailRow icon={<Mail />}>{contact.email}</DetailRow>
                <DetailRow icon={<Phone />}>{contact.phone}</DetailRow>
            </div>

            {/* Colleagues */}
            {colleagues.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Colleagues from {contact.company}</h4>
                    {colleagues.map(colleague => (
                        <div key={colleague.id} className="flex items-center gap-3">
                             <Avatar className="h-8 w-8"><AvatarImage src={colleague.avatar} /><AvatarFallback>{colleague.name.charAt(0)}</AvatarFallback></Avatar>
                             <div>
                                <p className="text-sm font-medium">{colleague.name}</p>
                                <p className="text-xs text-muted-foreground">{colleague.role}</p>
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}