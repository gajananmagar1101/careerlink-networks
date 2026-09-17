import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../context/ToastContext';
import { JobCard } from '../components/JobCard';
import type { Job } from '../types/domain';

function renderComponent(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ToastProvider>{ui}</ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

const mockJob: Job = {
  id: 'test-job-1',
  title: 'Frontend Engineer',
  companyName: 'Tech Corp',
  location: 'Remote',
  employmentType: 'FULL_TIME',
  experienceRequired: 3,
  salaryMin: 1000000,
  salaryMax: 1800000,
  skills: ['React', 'TypeScript'],
  category: 'Engineering',
  status: 'OPEN',
  applicationDeadline: '2026-12-31',
  description: 'Build user-facing features for a modern hiring platform.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe('Job Components', () => {
  describe('JobCard', () => {
    it('renders job title, company, location, skills', () => {
      renderComponent(<JobCard job={mockJob} to="/candidate/jobs/test-job-1" />);
      expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText('Remote')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('renders salary range', () => {
      renderComponent(<JobCard job={mockJob} to="/candidate/jobs/test-job-1" />);
      expect(screen.getByText(/₹10L/)).toBeInTheDocument();
    });

    it('renders View Job button', () => {
      renderComponent(<JobCard job={mockJob} to="/candidate/jobs/test-job-1" />);
      expect(screen.getByText('View Job')).toBeInTheDocument();
    });
  });
});
