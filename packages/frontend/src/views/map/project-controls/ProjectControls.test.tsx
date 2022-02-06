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
import { abcRender } from '../../../core/utils/test/abcRender';
import ProjectControls, { logger } from './ProjectControls';
import { newTestServices, TestServices } from '../../../core/utils/test/TestServices';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalStatus } from '../../../core/ui/typings';
import { TestHelper } from '../../../core/utils/test/TestHelper';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { FileIO } from '../../../core/utils/FileIO';

logger.disable();

jest.mock('../../../core/utils/FileIO');

describe('ProjectControls', () => {
  let services: TestServices;
  beforeEach(() => {
    services = newTestServices();
    services.geo.getMainMap.returns(MapFactory.createNaked());
  });

  describe('new project', () => {
    it('should create on confirmation', async () => {
      // Prepare
      services.project.newProject.resolves();
      services.modals.modificationsLostConfirmation.resolves(ModalStatus.Confirmed);
      abcRender(<ProjectControls />, { services });

      // Act
      userEvent.click(screen.getByTestId('new-project'));

      // Assert
      await waitFor(() => {
        expect(services.project.newProject.callCount).toEqual(1);
        expect(services.toasts.info.callCount).toEqual(1);
      });
    });

    it('should not create', async () => {
      // Prepare
      services.project.newProject.resolves();
      services.modals.modificationsLostConfirmation.resolves(ModalStatus.Canceled);
      abcRender(<ProjectControls />, { services });

      // Act
      userEvent.click(screen.getByTestId('new-project'));

      // Assert
      await TestHelper.wait(10); // We must wait a little, otherwise test cannot fail
      await waitFor(() => {
        expect(services.project.newProject.callCount).toEqual(0);
      });
    });
  });

  describe('export project', () => {
    it('should export then show sollicitation modal', async () => {
      // Prepare
      abcRender(<ProjectControls />, { services });

      const [compressed] = await TestHelper.sampleCompressedProject();
      services.project.exportCurrentProject.resolves(compressed);

      // Act
      userEvent.click(screen.getByTestId('export-project'));

      // Assert
      await waitFor(() => {
        expect(FileIO.outputBlob).toHaveBeenCalled();
        expect(services.modals.solicitation.callCount).toEqual(1);
      });
    });

    it('should not show sollicitation modal', async () => {
      // Prepare
      abcRender(<ProjectControls />, { services });
      services.project.exportCurrentProject.rejects(new Error('Test error'));

      // Act
      userEvent.click(screen.getByTestId('export-project'));

      // Assert
      await TestHelper.wait(10); // We must wait for internal promise completion, otherwise test cannot fail
      await waitFor(() => {
        expect(services.modals.solicitation.callCount).toEqual(0);
      });
    });
  });
});
