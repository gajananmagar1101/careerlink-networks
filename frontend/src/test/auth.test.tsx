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
    it('renders the login form with heading and button', async () => {
      renderApp('/login');
      expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders sign up link', async () => {
      renderApp('/login');
      expect(await screen.findByText(/don't have an account/i)).toBeInTheDocument();
      expect(screen.getByText('Create account')).toBeInTheDocument();
    });
  });

  describe('RegisterPage', () => {
    it('renders the registration heading with role selection', async () => {
      renderApp('/register');
      expect(await screen.findByRole('heading', { name: /create your hirelink account/i })).toBeInTheDocument();
      expect(screen.getByText(/tell us how you plan to use hirelink/i)).toBeInTheDocument();
    });

    it('renders role selection', async () => {
      renderApp('/register');
      expect(await screen.findByRole('button', { name: /job seeker/i })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /^recruiter\b/i })).toBeInTheDocument();
    });

    it('shows the registration form after choosing a role', async () => {
      renderApp('/register');
      const jobSeekerBtn = await screen.findByRole('button', { name: /job seeker/i });
      fireEvent.click(jobSeekerBtn);
      expect(await screen.findByText('Full name')).toBeInTheDocument();
    });
  });

  describe('Protected Routes', () => {
    it('redirects unauthenticated users to /login from candidate routes', async () => {
      renderApp('/candidate/dashboard');
      expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    });

    it('redirects unauthenticated users to /login from recruiter routes', async () => {
      renderApp('/recruiter/dashboard');
      expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    });
  });
});
