import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'icon';
  height?: number | string;
  alt?: string;
}

/**
 * CareerLink official brand logo component.
 * - `dark`: Standard logo (dark text + green) for white/light backgrounds (default).
 * - `light`: White-text version (white text + green) for dark backgrounds.
 * - `icon`: Icon mark only.
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  height = 34,
  alt = 'CareerLink'
}) => {
  let src = '/logo.png';
  if (variant === 'light') {
    src = '/logo-white.png';
  } else if (variant === 'icon') {
    src = '/logo-icon.png';
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      className={`w-auto object-contain select-none ${className}`}
      loading="eager"
    />
  );
};

export default Logo;
