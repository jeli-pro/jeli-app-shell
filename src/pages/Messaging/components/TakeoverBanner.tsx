import React from 'react';
import { Bot, UserCheck, Loader2 } from 'lucide-react';
import type { Assignee } from '../types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TakeoverBannerProps {
  activeHandler: Assignee;
  isRequesting: boolean;
  onTakeOver: () => void;
  onRequestTakeover: () => void;
}

export const TakeoverBanner: React.FC<TakeoverBannerProps> = ({
  activeHandler,
  isRequesting,
  onTakeOver,
  onRequestTakeover,
}) => {
  const isAi = activeHandler.type === 'ai';

  return (
    <div className="p-3 border-b bg-muted/30 text-sm text-foreground/80 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {isAi ? (
          <Bot className="w-5 h-5 text-blue-500 flex-shrink-0" />
        ) : (
          <UserCheck className="w-5 h-5 text-amber-500 flex-shrink-0" />
        )}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={activeHandler.avatar} />
            <AvatarFallback>{activeHandler.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground/90">{activeHandler.name}</span>
          <span>{isAi ? 'is handling this task.' : 'is viewing this task.'}</span>
        </div>
      </div>
      
      {isAi ? (
        <Button size="sm" onClick={onTakeOver}>
          Take Over
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={onRequestTakeover} disabled={isRequesting}>
          {isRequesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Requesting...
            </>
          ) : (
            'Request Takeover'
          )}
        </Button>
      )}
    </div>
  );
};