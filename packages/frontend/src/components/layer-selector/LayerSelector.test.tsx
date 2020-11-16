import React from 'react';
import { render, screen } from '@testing-library/react';
import LayerSelector from './LayerSelector';
import { Project } from '@abc-map/shared-entities';

test('renders title', () => {
  const project: Project = {
    layers: [
      {
        name: 'Layer 1',
      },
      {
        name: 'Layer 2',
      },
    ],
  } as any;
  render(<LayerSelector project={project} />);
  const linkElement = screen.getByText(/Layer 1/i);
  expect(linkElement).toBeInTheDocument();
});
