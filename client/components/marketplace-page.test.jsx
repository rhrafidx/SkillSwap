import { render, screen, waitFor } from '@testing-library/react';
import MarketplacePage from './marketplace-page';

jest.mock('../lib/api', () => ({
  fetchSkills: jest.fn().mockResolvedValue({ skills: [{ id: 11, title: 'Rapid prototyping', category: 'Design', description: 'Prototype your next app.', owner: 'Lina' }] }),
}));

describe('MarketplacePage', () => {
  it('renders the live marketplace data from the server', async () => {
    render(<MarketplacePage />);

    await waitFor(() => {
      expect(screen.getByText('Rapid prototyping')).toBeInTheDocument();
    });

    expect(screen.getByText(/Marketplace refreshed/i)).toBeInTheDocument();
  });
});
