import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApplicationCard } from '../components/ApplicationCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Timeline } from '../components/ui/Timeline';
import type { Application } from '../types/domain';

function renderWithRouter(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  );
}

const mockApplication: Application = {
  id: 'app-test-1',
  jobId: 'job-test-1',
  candidateId: 'candidate-test-1',
  status: 'UNDER_REVIEW',
  resumeUrl: undefined,
  coverLetter: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  job: {
    id: 'job-test-1',
    title: 'Frontend Engineer',
    companyName: 'Tech Corp',
    location: 'Remote',
    employmentType: 'FULL_TIME',
    experienceRequired: 3,
    skills: ['React'],
    category: 'Engineering',
    status: 'OPEN',
    description: 'A great role',
  }
};

describe('Application Components', () => {
  describe('ApplicationCard', () => {
    it('renders job title and status badge', () => {
      renderWithRouter(<ApplicationCard application={mockApplication} />);
      expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText('UNDER REVIEW')).toBeInTheDocument();
    });
  });

  describe('StatusBadge', () => {
    it('renders correct text for status', () => {
      render(<StatusBadge status="SHORTLISTED" />);
      expect(screen.getByText('SHORTLISTED')).toBeInTheDocument();
    });
    
    it('replaces underscores with spaces', () => {
      render(<StatusBadge status="UNDER_REVIEW" />);
      expect(screen.getByText('UNDER REVIEW')).toBeInTheDocument();
    });
  });

  describe('Timeline', () => {
    it('renders all status steps', () => {
      render(<Timeline status="SHORTLISTED" />);
      expect(screen.getByText('APPLIED')).toBeInTheDocument();
      expect(screen.getByText('UNDER REVIEW')).toBeInTheDocument();
      expect(screen.getByText('SHORTLISTED')).toBeInTheDocument();
      expect(screen.getByText('INTERVIEW')).toBeInTheDocument();
      expect(screen.getByText('HIRED')).toBeInTheDocument();
    });
  });
});
