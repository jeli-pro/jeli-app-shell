import { ArrowDown } from 'lucide-react';

interface ScrollToBottomButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export function ScrollToBottomButton({ isVisible, onClick }: ScrollToBottomButtonProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="absolute bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all animate-fade-in z-[51]"
      style={{ animation: 'bounce 2s infinite' }}
      title="Scroll to bottom"
    >
      <ArrowDown className="w-6 h-6" />
    </button>
  );
}