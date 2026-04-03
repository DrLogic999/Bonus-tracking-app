import React from 'react';
import { 
  Award, 
  BookOpen, 
  Users, 
  Star, 
  Heart, 
  Zap, 
  Target, 
  Trophy, 
  CheckCircle, 
  Smile, 
  Coffee, 
  Clock, 
  PenTool, 
  MessageSquare, 
  Flag, 
  Music, 
  Camera, 
  Globe, 
  Cpu, 
  Palette 
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

export function CategoryIcon({ iconName, size = 18, className }: CategoryIconProps) {
  const icons: Record<string, any> = {
    'Award': Award,
    'BookOpen': BookOpen,
    'Users': Users,
    'Star': Star,
    'Heart': Heart,
    'Zap': Zap,
    'Target': Target,
    'Trophy': Trophy,
    'CheckCircle': CheckCircle,
    'Smile': Smile,
    'Coffee': Coffee,
    'Clock': Clock,
    'PenTool': PenTool,
    'MessageSquare': MessageSquare,
    'Flag': Flag,
    'Music': Music,
    'Camera': Camera,
    'Globe': Globe,
    'Cpu': Cpu,
    'Palette': Palette,
  };

  const IconComponent = icons[iconName] || Award;
  return <IconComponent size={size} className={className} />;
}
