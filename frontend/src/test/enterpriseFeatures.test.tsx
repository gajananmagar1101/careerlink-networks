import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../components/ui/StatusBadge';

describe('Enterprise Platform Features', () => {
  describe('StatusBadge Extended Lifecycle', () => {
    it('renders INTERVIEW SCHEDULED correctly', () => {
      render(<StatusBadge status="INTERVIEW_SCHEDULED" />);
      expect(screen.getByText('INTERVIEW SCHEDULED')).toBeInTheDocument();
    });

    it('renders INTERVIEW COMPLETED correctly', () => {
      render(<StatusBadge status="INTERVIEW_COMPLETED" />);
      expect(screen.getByText('INTERVIEW COMPLETED')).toBeInTheDocument();
    });

    it('renders OFFERED correctly', () => {
      render(<StatusBadge status="OFFERED" />);
      expect(screen.getByText('OFFERED')).toBeInTheDocument();
    });
  });
});
