import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Zap } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark' | 'gradient';
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

export function BrandLogo({ 
  size = 'md', 
  variant = 'default', 
  showText = true, 
  className,
  animated = false 
}: BrandLogoProps) {
  const sizes = {
    sm: {
      container: 'w-8 h-8',
      icon: 'w-5 h-5',
      text: 'text-lg',
      subtext: 'text-xs'
    },
    md: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-xl',
      subtext: 'text-sm'
    },
    lg: {
      container: 'w-16 h-16',
      icon: 'w-8 h-8',
      text: 'text-2xl',
      subtext: 'text-base'
    },
    xl: {
      container: 'w-24 h-24',
      icon: 'w-12 h-12',
      text: 'text-4xl',
      subtext: 'text-lg'
    }
  };

  const variants = {
    default: {
      container: 'bg-gradient-to-br from-primary to-accent',
      icon: 'text-white',
      text: 'text-slate-800',
      subtext: 'text-slate-600'
    },
    white: {
      container: 'bg-white shadow-lg border-2 border-primary/20',
      icon: 'text-primary',
      text: 'text-slate-800',
      subtext: 'text-slate-600'
    },
    dark: {
      container: 'bg-slate-800',
      icon: 'text-white',
      text: 'text-white',
      subtext: 'text-slate-300'
    },
    gradient: {
      container: 'bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500',
      icon: 'text-white',
      text: 'bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent',
      subtext: 'text-slate-600'
    }
  };

  const currentSize = sizes[size];
  const currentVariant = variants[variant];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Logo Container */}
      <div className={cn(
        'relative rounded-2xl flex items-center justify-center shadow-lg overflow-hidden',
        currentSize.container,
        currentVariant.container,
        animated && 'hover:scale-110 transition-all duration-300 cursor-pointer'
      )}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        
        {/* Main Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Zap className={cn(
            currentSize.icon, 
            currentVariant.icon,
            animated && 'animate-pulse'
          )} />
          
          {/* Accent sparkle */}
          <Sparkles className={cn(
            'absolute -top-1 -right-1 w-3 h-3',
            currentVariant.icon,
            animated && 'animate-bounce'
          )} />
        </div>
        
        {/* Glow effect */}
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10" />
        )}
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            'font-black tracking-tight leading-none',
            currentSize.text,
            currentVariant.text
          )}>
            TalentFlow
          </h1>
          <span className={cn(
            'font-medium tracking-wide leading-none -mt-1',
            currentSize.subtext,
            currentVariant.subtext
          )}>
            AI-Powered Hiring
          </span>
        </div>
      )}
    </div>
  );
}

// Brand color system
export const brandColors = {
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main primary
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  accent: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main accent
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  }
};

// Typography scale
export const brandTypography = {
  fontFamily: {
    display: ['Inter', 'system-ui', 'sans-serif'],
    body: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
  }
};