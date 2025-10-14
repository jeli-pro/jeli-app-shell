import { Button } from '@/components/ui/button';
import { ExternalLink, Share } from 'lucide-react';

export function DataDetailActions() {
    return (
        <div className="flex gap-3">
          <Button className="flex-1" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Project
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
    )
}