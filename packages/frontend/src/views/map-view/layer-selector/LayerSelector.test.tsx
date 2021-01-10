import React from 'react';
import { render, screen } from '@testing-library/react';
import LayerSelector from './LayerSelector';

jest.mock('../../../core/Services', () => {
  return { services: () => ({}) };
});

describe('LayerSelector', () => {
  it('renders without layers', () => {
    render(<LayerSelector layers={[]} />);
    const linkElement = screen.getByText(/Aucune couche/i);
    expect(linkElement).toBeInTheDocument();
  });
});
