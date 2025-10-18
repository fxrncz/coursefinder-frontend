import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerifyEmailDialog from '../VerifyEmailDialog';

// Mock the toast hook
jest.mock('../ui/toast', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock the API
global.fetch = jest.fn();

describe('VerifyEmailDialog', () => {
  const mockProps = {
    isOpen: true,
    onOpenChange: jest.fn(),
    email: 'test@example.com',
    onVerified: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders verification form without cancel button', () => {
    render(<VerifyEmailDialog {...mockProps} />);
    
    expect(screen.getByText('Enter verification code')).toBeInTheDocument();
    expect(screen.getByText('VERIFY')).toBeInTheDocument();
    expect(screen.getByText('Resend code')).toBeInTheDocument();
    
    // Cancel button should not be present
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('shows countdown when resend is clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    });

    render(<VerifyEmailDialog {...mockProps} />);
    
    const resendButton = screen.getByText('Resend code');
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(screen.getByText('Resend code available in:')).toBeInTheDocument();
      expect(screen.getByText('30s')).toBeInTheDocument();
    });
  });

  it('updates countdown timer', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    });

    render(<VerifyEmailDialog {...mockProps} />);
    
    const resendButton = screen.getByText('Resend code');
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(screen.getByText('30s')).toBeInTheDocument();
    });

    // Fast-forward time by 5 seconds
    jest.advanceTimersByTime(5000);
    
    await waitFor(() => {
      expect(screen.getByText('25s')).toBeInTheDocument();
    });
  });

  it('shows resend button again after countdown completes', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    });

    render(<VerifyEmailDialog {...mockProps} />);
    
    const resendButton = screen.getByText('Resend code');
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(screen.getByText('Resend code available in:')).toBeInTheDocument();
    });

    // Fast-forward time by 30 seconds
    jest.advanceTimersByTime(30000);
    
    await waitFor(() => {
      expect(screen.getByText('Resend code')).toBeInTheDocument();
      expect(screen.queryByText('Resend code available in:')).not.toBeInTheDocument();
    });
  });
});
