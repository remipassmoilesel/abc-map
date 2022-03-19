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

import { AbcFile, AbcLayout } from '@abc-map/shared';
import { TextFrameHelpers } from './TextFrameHelpers';
import { SinonStub } from 'sinon';
import { mockNanoid, restoreNanoid } from '../utils/test/mock-nanoid';
import { sampleFramesWithBlobUrls, sampleFramesWithPaths } from './TextFrameHelpers.test.data';
import { deepFreeze } from '../utils/deepFreeze';
import { TestHelper } from '../utils/test/TestHelper';

describe('TextFrameHelpers', () => {
  describe('Extract images', () => {
    const fetchStub = fetch as SinonStub;
    let layouts: AbcLayout[];

    beforeEach(() => {
      layouts = deepFreeze([
        {
          ...TestHelper.sampleLayout(),
          textFrames: sampleFramesWithBlobUrls(),
        },
        {
          ...TestHelper.sampleLayout(),
          textFrames: [sampleFramesWithBlobUrls()[0]],
        },
      ]);
      mockNanoid();

      fetchStub.callsFake((url) => {
        return Promise.resolve({ blob: () => ({ type: 'blob', url }) });
      });
    });

    afterEach(() => {
      restoreNanoid();
    });

    it('extractImagesFromLayouts()', async () => {
      // Act
      const [images, output] = await TextFrameHelpers.extractImagesFromLayouts(layouts);

      // Assert
      expect(images).toEqual([
        { content: { type: 'blob', url: 'http://blob:image-1:17dfc0d8-82af-4602-b84e-9d139c80a406' }, path: '/images/image-###-FAKE-NANOID-1-###' },
        { content: { type: 'blob', url: 'http://blob:image-2:a31099f5-2a60-47cf-a2e0-9dea8e932e93' }, path: '/images/image-###-FAKE-NANOID-2-###' },
        { content: { type: 'blob', url: 'http://blob:image-1:17dfc0d8-82af-4602-b84e-9d139c80a406' }, path: '/images/image-###-FAKE-NANOID-3-###' },
        { content: { type: 'blob', url: 'http://blob:image-2:a31099f5-2a60-47cf-a2e0-9dea8e932e93' }, path: '/images/image-###-FAKE-NANOID-4-###' },
      ]);

      expect(output).toEqual([
        {
          ...layouts[0],
          textFrames: [
            {
              id: 'test-frame-1',
              position: { x: 100, y: 200 },
              size: { width: 300, height: 400 },
              content: [
                { text: 'Hello' },
                { type: 'image', url: '/images/image-###-FAKE-NANOID-1-###', size: 1, children: [{ text: '' }] },
                {
                  type: 'table',
                  children: [
                    {
                      type: 'table-row',
                      children: [
                        {
                          type: 'table-cell',
                          children: [
                            { type: 'paragraph', children: [{ type: 'image', url: '/images/image-###-FAKE-NANOID-2-###', size: 2, children: [{ text: '' }] }] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            { id: 'test-frame-2', position: { x: 500, y: 600 }, size: { width: 700, height: 800 }, content: [{ text: 'Hello 2' }, { text: 'Hello 3' }] },
          ],
        },
        {
          ...layouts[1],
          textFrames: [
            {
              id: 'test-frame-1',
              position: { x: 100, y: 200 },
              size: { width: 300, height: 400 },
              content: [
                { text: 'Hello' },
                { type: 'image', url: '/images/image-###-FAKE-NANOID-3-###', size: 1, children: [{ text: '' }] },
                {
                  type: 'table',
                  children: [
                    {
                      type: 'table-row',
                      children: [
                        {
                          type: 'table-cell',
                          children: [
                            { type: 'paragraph', children: [{ type: 'image', url: '/images/image-###-FAKE-NANOID-4-###', size: 2, children: [{ text: '' }] }] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe('Load images', function () {
    const createObjectUrlStub = URL.createObjectURL as SinonStub;
    let layouts: AbcLayout[];
    let files: AbcFile<Blob>[];

    beforeEach(() => {
      layouts = deepFreeze([
        {
          ...TestHelper.sampleLayout(),
          textFrames: sampleFramesWithPaths(),
        },
        {
          ...TestHelper.sampleLayout(),
          textFrames: [sampleFramesWithPaths()[0]],
        },
      ]);

      createObjectUrlStub.callsFake((blob) => 'http://blob:' + blob.name);

      files = [
        { path: '/images/image-23dXh_mJxZqnQFxlzVuaK', content: { name: '23dXh_mJxZqnQFxlzVuaK' } as unknown as Blob },
        { path: '/images/image-84PQJv8Ll_yGal7zUPiJ8', content: { name: '84PQJv8Ll_yGal7zUPiJ8' } as unknown as Blob },
      ];
    });

    afterEach(() => {
      createObjectUrlStub.reset();
    });

    it('loadImagesOfLayouts()', async () => {
      // Act
      const output = TextFrameHelpers.loadImagesOfLayouts(layouts, files);

      // Assert
      expect(output).toEqual([
        {
          ...layouts[0],
          textFrames: [
            {
              id: 'test-frame-1',
              position: { x: 100, y: 200 },
              size: { width: 300, height: 400 },
              content: [
                { text: 'Hello' },
                { type: 'image', url: 'http://blob:23dXh_mJxZqnQFxlzVuaK', size: 1, children: [{ text: '' }] },
                {
                  type: 'table',
                  children: [
                    {
                      type: 'table-row',
                      children: [
                        {
                          type: 'table-cell',
                          children: [
                            { type: 'paragraph', children: [{ type: 'image', url: 'http://blob:84PQJv8Ll_yGal7zUPiJ8', size: 2, children: [{ text: '' }] }] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            { id: 'test-frame-2', position: { x: 500, y: 600 }, size: { width: 700, height: 800 }, content: [{ text: 'Hello 2' }, { text: 'Hello 3' }] },
          ],
        },
        {
          ...layouts[1],
          textFrames: [
            {
              id: 'test-frame-1',
              position: { x: 100, y: 200 },
              size: { width: 300, height: 400 },
              content: [
                { text: 'Hello' },
                { type: 'image', url: 'http://blob:23dXh_mJxZqnQFxlzVuaK', size: 1, children: [{ text: '' }] },
                {
                  type: 'table',
                  children: [
                    {
                      type: 'table-row',
                      children: [
                        {
                          type: 'table-cell',
                          children: [
                            { type: 'paragraph', children: [{ type: 'image', url: 'http://blob:84PQJv8Ll_yGal7zUPiJ8', size: 2, children: [{ text: '' }] }] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]);
    });
  });
});
