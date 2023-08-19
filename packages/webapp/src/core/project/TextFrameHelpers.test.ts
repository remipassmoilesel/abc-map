/**
 * Copyright © 2023 Rémi Pace.
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

import { AbcFile, AbcLayout, AbcSharedView } from '@abc-map/shared';
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
    let sharedViews: AbcSharedView[];

    beforeEach(() => {
      layouts = deepFreeze([
        {
          ...TestHelper.sampleLayout(),
          id: 'test-layout-1',
          textFrames: sampleFramesWithBlobUrls(),
        },
        {
          ...TestHelper.sampleLayout(),
          id: 'test-layout-2',
          textFrames: [sampleFramesWithBlobUrls()[0]],
        },
      ]);

      sharedViews = deepFreeze([
        {
          ...TestHelper.sampleSharedView(),
          id: 'test-shared-view-1',
          textFrames: sampleFramesWithBlobUrls(),
        },
        {
          ...TestHelper.sampleSharedView(),
          id: 'test-shared-view-2',
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

      expect(output).toMatchSnapshot();
    });

    it('extractImagesFromSharedViews()', async () => {
      // Act
      const [images, output] = await TextFrameHelpers.extractImagesFromSharedViews(sharedViews);

      // Assert
      expect(images).toEqual([
        { content: { type: 'blob', url: 'http://blob:image-1:17dfc0d8-82af-4602-b84e-9d139c80a406' }, path: '/images/image-###-FAKE-NANOID-1-###' },
        { content: { type: 'blob', url: 'http://blob:image-2:a31099f5-2a60-47cf-a2e0-9dea8e932e93' }, path: '/images/image-###-FAKE-NANOID-2-###' },
        { content: { type: 'blob', url: 'http://blob:image-1:17dfc0d8-82af-4602-b84e-9d139c80a406' }, path: '/images/image-###-FAKE-NANOID-3-###' },
        { content: { type: 'blob', url: 'http://blob:image-2:a31099f5-2a60-47cf-a2e0-9dea8e932e93' }, path: '/images/image-###-FAKE-NANOID-4-###' },
      ]);

      expect(output).toMatchSnapshot();
    });
  });

  describe('Load images', function () {
    const createObjectUrlStub = URL.createObjectURL as SinonStub;
    let layouts: AbcLayout[];
    let sharedViews: AbcSharedView[];
    let files: AbcFile<Blob>[];

    beforeEach(() => {
      layouts = deepFreeze([
        {
          ...TestHelper.sampleLayout(),
          id: 'test-layout-1',
          textFrames: sampleFramesWithPaths(),
        },
        {
          ...TestHelper.sampleLayout(),
          id: 'test-layout-2',
          textFrames: [sampleFramesWithPaths()[0]],
        },
      ]);

      sharedViews = deepFreeze([
        {
          ...TestHelper.sampleSharedView(),
          id: 'test-shared-view-1',
          textFrames: sampleFramesWithPaths(),
        },
        {
          ...TestHelper.sampleSharedView(),
          id: 'test-shared-view-2',
          textFrames: [sampleFramesWithPaths()[0]],
        },
      ]);

      createObjectUrlStub.callsFake((blob) => 'http://blob:' + blob.name);

      files = [
        { path: '/images/image-IMAGE_1', content: { name: 'IMAGE_1' } as unknown as Blob },
        { path: '/images/image-IMAGE_2', content: { name: 'IMAGE_2' } as unknown as Blob },
      ];
    });

    afterEach(() => {
      createObjectUrlStub.reset();
    });

    it('loadImagesOfLayouts()', async () => {
      // Act
      const output = TextFrameHelpers.loadImagesOfLayouts(layouts, files);

      // Assert
      expect(output).toMatchSnapshot();
    });

    it('loadImagesOfSharedViews()', async () => {
      // Act
      const output = TextFrameHelpers.loadImagesOfSharedViews(sharedViews, files);

      // Assert
      expect(output).toMatchSnapshot();
    });
  });
});
