import { Instagram, MessageCircle, Facebook } from 'lucide-react';
import type { Channel, ChannelIcon as ChannelIconType } from '../types';
import { cn } from '@/lib/utils';

export const channelMap: Record<Channel, ChannelIconType> = {
  whatsapp: { Icon: MessageCircle, color: 'text-green-500' },
  instagram: { Icon: Instagram, color: 'text-pink-500' },
  facebook: { Icon: Facebook, color: 'text-blue-600' },
};

export const ChannelIcon: React.FC<{ channel: Channel; className?: string }> = ({ channel, className }) => {
  const { Icon, color } = channelMap[channel];
  return <Icon className={cn('w-4 h-4', color, className)} />;
};