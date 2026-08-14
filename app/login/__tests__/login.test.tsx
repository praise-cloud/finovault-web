import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { initMockApi, setMockLatency } from '@/lib/api';
import LoginPage from '../page';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ replace: vi.fn(), push: vi.fn() })),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

beforeAll(async () => {
  setMockLatency(0);
  await initMockApi();
});

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('LoginPage', () => {
  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
  });

  it('logs in with demo credentials and redirects to /dashboard', async () => {
    const replace = vi.fn();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({ replace, push: replace });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'demo@finovault.app' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Vault123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'));
  });

  it('shows an error banner for invalid credentials', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'demo@finovault.app' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  });
});