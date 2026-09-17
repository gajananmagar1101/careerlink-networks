import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { AppRoutes } from './AppRoutes';

function renderApp(route: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('AppRoutes', () => {
  it('renders the landing page', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { name: /find work that moves your career forward/i })).toBeInTheDocument();
  });

  it('redirects protected candidate routes to login', () => {
    renderApp('/candidate/dashboard');
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  });
});
