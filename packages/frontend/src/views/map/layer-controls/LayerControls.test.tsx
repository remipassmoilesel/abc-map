import React from 'react';
import { render, screen } from '@testing-library/react';
import { LayerControls } from './LayerControls';

describe('LayerControls', () => {
  it('renders without layers', () => {
    render(<LayerControls layers={[]} services={{} as any} />);
    const linkElement = screen.getByText(/Aucune couche/i);
    expect(linkElement).toBeInTheDocument();
  });
});
