import React from 'react';
import { render, screen } from '@testing-library/react';
import LayerSelector from './LayerSelector';
import { Map } from 'ol';

jest.mock('../../../core/Services', () => {
  return { services: () => ({}) };
});

describe('LayerSelector', () => {
  it('renders without layers', () => {
    render(<LayerSelector layers={[]} map={new Map({})} />);
    const linkElement = screen.getByText(/Aucune couche/i);
    expect(linkElement).toBeInTheDocument();
  });
});
