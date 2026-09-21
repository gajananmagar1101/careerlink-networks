import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface LogoProps {
  className?: string;
  variant?: 'auto' | 'dark' | 'light' | 'icon';
  height?: number | string;
  alt?: string;
}

/**
 * HireLink official brand logo component.
 * - `auto`: Automatically selects dark/light variant based on current ThemeContext (default).
 * - `dark`: Standard logo (dark text + green) for white/light backgrounds.
 * - `light`: White-text version (white text + green) for dark backgrounds.
 * - `icon`: Icon mark only.
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'auto',
  height = 34,
  alt = 'HireLink'
}) => {
  let effectiveVariant = variant;
  try {
    // Attempt to read current theme
    const themeContext = useTheme();
    if (variant === 'auto') {
      effectiveVariant = themeContext.theme === 'dark' ? 'light' : 'dark';
    }
  } catch {
    // Fallback if rendered outside ThemeProvider (e.g. isolated tests)
    if (variant === 'auto') {
      effectiveVariant = 'dark';
    }
  }

  let src = '/logo.png';
  if (effectiveVariant === 'light') {
    src = '/logo-white.png';
  } else if (effectiveVariant === 'icon') {
    src = '/logo-icon.png';
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      className={`w-auto object-contain select-none transition-opacity duration-200 ${className}`}
      loading="eager"
    />
  );
};

export default Logo;
