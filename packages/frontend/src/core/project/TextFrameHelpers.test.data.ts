/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { AbcTextFrame } from '@abc-map/shared';

export const sampleFramesWithBlobUrls = (): AbcTextFrame[] => [
  {
    id: 'test-frame-1',
    position: { x: 100, y: 200 },
    size: { width: 300, height: 400 },
    content: [
      { text: 'Hello' },
      { type: 'image', url: 'http://blob:image-1:17dfc0d8-82af-4602-b84e-9d139c80a406', size: 1, children: [{ text: '' }] },
      {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'image', url: 'http://blob:image-2:a31099f5-2a60-47cf-a2e0-9dea8e932e93', size: 2, children: [{ text: '' }] }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    style: {
      background: '#FFFFFF',
      withBorders: true,
      withShadows: true,
    },
  },
  {
    id: 'test-frame-2',
    position: { x: 500, y: 600 },
    size: { width: 700, height: 800 },
    content: [{ text: 'Hello 2' }, { text: 'Hello 3' }],
    style: {
      background: '#FFFFFF',
      withBorders: true,
      withShadows: true,
    },
  },
];

export const sampleFramesWithPaths = (): AbcTextFrame[] => [
  {
    id: 'test-frame-1',
    position: { x: 100, y: 200 },
    size: { width: 300, height: 400 },
    content: [
      { text: 'Hello' },
      { type: 'image', url: '/images/image-IMAGE_1', size: 1, children: [{ text: '' }] },
      {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'image', url: '/images/image-IMAGE_2', size: 2, children: [{ text: '' }] }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    style: {
      background: '#FFFFFF',
      withBorders: true,
      withShadows: true,
    },
  },
  {
    id: 'test-frame-2',
    position: { x: 500, y: 600 },
    size: { width: 700, height: 800 },
    content: [{ text: 'Hello 2' }, { text: 'Hello 3' }],
    style: {
      background: '#FFFFFF',
      withBorders: true,
      withShadows: true,
    },
  },
];
