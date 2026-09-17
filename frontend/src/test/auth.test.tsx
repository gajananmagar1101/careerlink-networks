import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { AppRoutes } from '../routes/AppRoutes';

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

describe('Auth Pages', () => {
  describe('LoginPage', () => {
    it('renders the login form with heading and button', () => {
      renderApp('/login');
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders sign up link', () => {
      renderApp('/login');
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
      expect(screen.getByText('Create account')).toBeInTheDocument();
    });
  });

  describe('RegisterPage', () => {
    it('renders the registration heading with role selection', () => {
      renderApp('/register');
      expect(screen.getByRole('heading', { name: /create your careerlink account/i })).toBeInTheDocument();
      expect(screen.getByText(/tell us how you plan to use careerlink/i)).toBeInTheDocument();
    });

    it('renders role selection', () => {
      renderApp('/register');
      expect(screen.getByRole('button', { name: /job seeker/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /recruiter/i })).toBeInTheDocument();
    });

    it('shows the registration form after choosing a role', () => {
      renderApp('/register');
      fireEvent.click(screen.getByRole('button', { name: /job seeker/i }));
      expect(screen.getByText('Full name')).toBeInTheDocument();
    });
  });

  describe('Protected Routes', () => {
    it('redirects unauthenticated users to /login from candidate routes', () => {
      renderApp('/candidate/dashboard');
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    });

    it('redirects unauthenticated users to /login from recruiter routes', () => {
      renderApp('/recruiter/dashboard');
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    });
  });
});
