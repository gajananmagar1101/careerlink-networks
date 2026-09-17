import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { PublicJobsPage } from '../pages/public/PublicJobsPage';
import { CandidateJobsPage } from '../pages/candidate/CandidateJobsPage';
import { apiClient } from '../api/apiClient';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

function renderPage(ui: React.ReactElement, route: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          <ToastProvider>{ui}</ToastProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Public job search', () => {
  it('shows a sign-in prompt instead of an error when the gateway returns 401', async () => {
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce({ status: 401, message: 'Unauthorized' });
    renderPage(<PublicJobsPage />, '/jobs');
    expect(await screen.findByText(/sign in to browse live job openings/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });
});

describe('Candidate job search', () => {
  it('sends the category filter to the job search request', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { data: { content: [], totalElements: 0, totalPages: 1 } } });
    renderPage(<CandidateJobsPage />, '/candidate/jobs?category=Engineering');
    await waitFor(
      () => expect(get).toHaveBeenCalledWith('/api/jobs/search', expect.objectContaining({ params: expect.objectContaining({ category: 'Engineering' }) })),
      { timeout: 2000 }
    );
  });
});
