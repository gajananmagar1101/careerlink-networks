import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { EmptyState, ErrorState } from '../components/ui/Feedback';
import { ProgressBar } from '../components/ui/ProgressBar';

describe('UI Components', () => {
  describe('Button', () => {
    it('renders with correct variant', () => {
      render(<Button variant="danger">Delete</Button>);
      const button = screen.getByRole('button', { name: 'Delete' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-red-600');
    });
  });

  describe('Modal', () => {
    it('shows and hides based on open prop', () => {
      const { rerender } = render(
        <Modal open={true} title="Test Modal" onClose={() => {}}>
          <p>Modal Content</p>
        </Modal>
      );
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal Content')).toBeInTheDocument();

      rerender(
        <Modal open={false} title="Test Modal" onClose={() => {}}>
          <p>Modal Content</p>
        </Modal>
      );
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });
  });

  describe('EmptyState', () => {
    it('renders title, description, and action', () => {
      render(
        <EmptyState 
          title="No items found" 
          description="Try a different search" 
          action={<Button>Create</Button>} 
        />
      );
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Try a different search')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    });
  });

  describe('ErrorState', () => {
    it('renders message and retry button', () => {
      const handleRetry = vi.fn();
      render(<ErrorState message="Network error" onRetry={handleRetry} />);
      
      expect(screen.getByText('Network error')).toBeInTheDocument();
      
      const retryBtn = screen.getByRole('button', { name: /retry/i });
      expect(retryBtn).toBeInTheDocument();
      
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalled();
    });
  });

  describe('ProgressBar', () => {
    it('renders with correct width', () => {
      render(<ProgressBar value={75} />);
      const progressBarContainer = screen.getByLabelText('Progress 75%');
      expect(progressBarContainer).toBeInTheDocument();
      const bar = progressBarContainer.firstElementChild as HTMLElement;
      expect(bar).toHaveStyle({ width: '75%' });
    });
  });

  describe('ConfirmDialog', () => {
    it('renders title and action buttons', () => {
      render(
        <ConfirmDialog 
          open={true} 
          title="Delete Item" 
          description="Are you sure?" 
          onCancel={() => {}} 
          onConfirm={() => {}} 
        />
      );
      
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });
  });
});
