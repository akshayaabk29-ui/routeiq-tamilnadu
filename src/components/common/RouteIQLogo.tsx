import React from 'react';

interface RouteIQLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge';
  className?: string;
  imgClassName?: string;
}

export const RouteIQLogo: React.FC<RouteIQLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  imgClassName = '',
}) => {
  const sizeMap = {
    xs: { img: 'w-6 h-6', text: 'text-base', sub: 'text-[9px]' },
    sm: { img: 'w-8 h-8 sm:w-9 sm:h-9', text: 'text-lg sm:text-xl', sub: 'text-[10px]' },
    md: { img: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs' },
    lg: { img: 'w-24 h-24 sm:w-28 sm:h-28', text: 'text-3xl sm:text-4xl', sub: 'text-sm' },
    xl: { img: 'w-32 h-32 sm:w-40 sm:h-40', text: 'text-4xl sm:text-5xl', sub: 'text-base' },
  };

  const currentSize = sizeMap[size];

  if (variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src="/routeiq-logo.png"
          alt="RouteIQ"
          className={`${currentSize.img} object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105 ${imgClassName}`}
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-sm ${className}`}>
        <img
          src="/routeiq-logo.png"
          alt="RouteIQ"
          className="w-6 h-6 object-contain shrink-0"
        />
        <div className="flex items-baseline font-black tracking-tight leading-none">
          <span className="text-blue-700 dark:text-blue-400">Route</span>
          <span className="text-emerald-500 dark:text-emerald-400">IQ</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      <div className="relative shrink-0">
        <img
          src="/routeiq-logo.png"
          alt="RouteIQ"
          className={`${currentSize.img} object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105 ${imgClassName}`}
          loading="eager"
        />
      </div>
      <div className="flex flex-col text-left">
        <div className={`font-black tracking-tight leading-none ${currentSize.text}`}>
          <span className="text-blue-700 dark:text-blue-400">Route</span>
          <span className="text-emerald-500 dark:text-emerald-400">IQ</span>
        </div>
        <span className={`font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5 ${currentSize.sub}`}>
          Transit Intelligence
        </span>
      </div>
    </div>
  );
};
