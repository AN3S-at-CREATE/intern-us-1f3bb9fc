import aiCalm from '@/assets/ai-character/calm.png';
import aiConfused from '@/assets/ai-character/confused.png';
import aiDefault from '@/assets/ai-character/default.png';
import aiExcited from '@/assets/ai-character/excited.png';
import aiGreeting from '@/assets/ai-character/greeting.png';
import aiIdea from '@/assets/ai-character/idea.png';
import aiTalking from '@/assets/ai-character/talking.png';
import aiThinking from '@/assets/ai-character/thinking.png';
import { cn } from '@/lib/utils';

export type AIEmotion = 
  | 'calm' 
  | 'confused' 
  | 'default' 
  | 'excited' 
  | 'greeting' 
  | 'idea' 
  | 'talking' 
  | 'thinking';

const emotionImages: Record<AIEmotion, string> = {
  calm: aiCalm,
  confused: aiConfused,
  default: aiDefault,
  excited: aiExcited,
  greeting: aiGreeting,
  idea: aiIdea,
  talking: aiTalking,
  thinking: aiThinking,
};

interface AIAvatarProps {
  emotion?: AIEmotion;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

export function AIAvatar({ 
  emotion = 'default', 
  size = 'md', 
  className,
  animated = true 
}: AIAvatarProps) {
  return (
    <div 
      className={cn(
        "relative rounded-full overflow-hidden flex-shrink-0",
        "ring-2 ring-primary/30 shadow-lg shadow-primary/20",
        animated && "transition-transform duration-300 hover:scale-105",
        sizeClasses[size],
        className
      )}
    >
      <img 
        src={emotionImages[emotion]} 
        alt="AI Assistant" 
        className="h-full w-full object-cover"
      />
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
    </div>
  );
}

// Helper to determine emotion based on context
export function getAIEmotion(context: {
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  hasResult?: boolean;
  isGreeting?: boolean;
  isIdea?: boolean;
}): AIEmotion {
  if (context.isLoading) return 'thinking';
  if (context.isError) return 'confused';
  if (context.isSuccess || context.hasResult) return 'excited';
  if (context.isGreeting) return 'greeting';
  if (context.isIdea) return 'idea';
  return 'default';
}
