import { render, screen, waitFor } from '@testing-library/react';
import LandingPage from './landing-page';

jest.mock('../lib/api', () => ({
  fetchHealth: jest.fn().mockResolvedValue({ status: 'ok' }),
  fetchSkills: jest.fn().mockResolvedValue([
    { id: 9, title: 'Brand Systems', category: 'Design', description: 'Craft polished interfaces for fast-moving teams.', owner: 'Iris' },
  ]),
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  submitContact: jest.fn(),
}));

describe('LandingPage', () => {
  it('renders the premium hero and loads server-backed skills', async () => {
    render(<LandingPage />);

    expect(screen.getByText(/upgrade the marketplace/i)).toBeInTheDocument();
    expect(screen.getByText(/premium talent exchange/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Brand Systems')).toBeInTheDocument();
    });

    expect(screen.getByText(/1 live listing/i)).toBeInTheDocument();
  });
});
