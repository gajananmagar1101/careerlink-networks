import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';

function TestConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-val">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-btn">
        Toggle
      </button>
    </div>
  );
}

describe('Theme System', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('initializes and manages light/dark mode', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    const themeVal = screen.getByTestId('theme-val');
    const toggleBtn = screen.getByTestId('toggle-btn');

    expect(themeVal.textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle to dark
    fireEvent.click(toggleBtn);
    expect(themeVal.textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('careerlink_theme')).toBe('dark');

    // Toggle back to light
    fireEvent.click(toggleBtn);
    expect(themeVal.textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('careerlink_theme')).toBe('light');
  });

  it('renders ThemeToggle component and switches themes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle showLabel />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button', { name: /Switch to Dark Mode/i });
    expect(toggleButton).toBeInTheDocument();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByRole('button', { name: /Switch to Light Mode/i })).toBeInTheDocument();
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
  });
});
