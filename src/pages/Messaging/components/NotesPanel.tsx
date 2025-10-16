import React from 'react';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
import type { Contact } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface NotesPanelProps {
  contact: Contact;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({ contact }) => {
    return (
        <div className="space-y-4">
            {contact.notes.map(note => (
                <div key={note.id} className="text-sm bg-accent/50 p-3 rounded-lg"><p className="mb-1.5">{note.content}</p><p className="text-xs text-muted-foreground">{format(new Date(note.createdAt), "MMM d, yyyy")}</p></div>
            ))}
            <div className="relative">
                <Textarea placeholder="Add a new note..." className="min-h-[60px]" />
                <Button size="icon" className="absolute right-2 bottom-2 h-7 w-7"><Send className="w-3.5 h-3.5" /></Button>
            </div>
        </div>
    )
}