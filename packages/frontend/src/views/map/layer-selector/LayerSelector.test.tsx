import React from 'react';
import { render, screen } from '@testing-library/react';
import { LayerSelector } from './LayerSelector';

describe('LayerSelector', () => {
  it('renders without layers', () => {
    render(<LayerSelector layers={[]} services={{} as any} />);
    const linkElement = screen.getByText(/Aucune couche/i);
    expect(linkElement).toBeInTheDocument();
  });
});
