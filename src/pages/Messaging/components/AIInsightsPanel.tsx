import React from 'react';
import type { Task, Contact, Assignee } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Reply, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface AIInsightsPanelProps {
  task: (Task & { contact: Contact; assignee: Assignee | null });
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ task }) => {
    const { aiSummary } = task;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Sentiment:</span>
                <Badge variant={
                  aiSummary.sentiment === 'positive' ? 'default' : aiSummary.sentiment === 'negative' ? 'destructive' : 'secondary'
                } className="capitalize">
                  {aiSummary.sentiment === 'positive' && <ThumbsUp className="w-3 h-3 mr-1.5" />}
                  {aiSummary.sentiment === 'negative' && <ThumbsDown className="w-3 h-3 mr-1.5" />}
                  {aiSummary.sentiment}
                </Badge>
            </div>
            <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4 text-yellow-500" /> Key Points</h4>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground pl-2">
                  {aiSummary.summaryPoints.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Reply className="w-4 h-4 text-blue-500" /> Suggested Replies</h4>
                <div className="flex flex-col gap-2">
                  {aiSummary.suggestedReplies.map((reply, i) => (
                    <Button 
                      key={i} 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-between text-left h-auto py-2 px-3 group"
                      onClick={() => handleCopy(reply)}
                    >
                      <span className="pr-4">{reply}</span>
                      <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                    </Button>
                  ))}
                </div>
            </div>
        </div>
    )
}