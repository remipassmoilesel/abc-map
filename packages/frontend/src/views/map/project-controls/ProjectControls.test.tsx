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
import ProjectControls from './ProjectControls';
import { newTestServices, TestServices } from '../../../core/utils/test/TestServices';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalEventType, ModalStatus, OperationStatus } from '../../../core/ui/typings';
import { CompressedProject, UserStatus } from '@abc-map/shared';
import { MainState } from '../../../core/store/reducer';
import { TestHelper } from '../../../core/utils/test/TestHelper';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { LayerFactory } from '../../../core/geo/layers/LayerFactory';
import { FileIO } from '../../../core/utils/FileIO';

jest.mock('../../../core/utils/FileIO');

describe('ProjectControls', () => {
  let services: TestServices;
  beforeEach(() => {
    services = newTestServices();
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

  describe('save project', () => {
    let state: MainState;

    beforeEach(() => {
      state = { authentication: { userStatus: UserStatus.Authenticated } } as unknown as MainState;
    });

    it('should save', async () => {
      // Prepare
      services.modals.longOperationModal.resolves(OperationStatus.Succeed);

      abcRender(<ProjectControls />, { services, state });
      userEvent.click(screen.getByTestId('save-project'));

      const save = services.modals.longOperationModal.args[0][0]; // We grab save handler
      services.geo.getMainMap.returns(MapFactory.createNaked());

      const [compressed] = await TestHelper.sampleCompressedProject();
      services.project.exportCurrentProject.resolves(compressed);

      // Act
      await save();

      // Assert
      await waitFor(() => {
        expect(services.project.exportCurrentProject.callCount).toEqual(1);
        expect(services.project.save.callCount).toEqual(1);
      });
    });

    it('should ask for credentials before save', async () => {
      // Prepare
      services.modals.longOperationModal.resolves(OperationStatus.Succeed);

      abcRender(<ProjectControls />, { services, state });
      userEvent.click(screen.getByTestId('save-project'));

      const save = services.modals.longOperationModal.args[0][0]; // We grab save handler

      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newXyzLayer('http://nowhere.net/{x}/{y}/{z}'));
      services.geo.getMainMap.returns(map);
      services.modals.setProjectPassword.resolves({ type: ModalEventType.SetPasswordClosed, status: ModalStatus.Confirmed, value: 'azerty1234' });

      const [compressed] = await TestHelper.sampleCompressedProject();
      services.project.exportCurrentProject.resolves(compressed);

      // Act
      await save();

      // Assert
      await waitFor(() => {
        expect(services.modals.setProjectPassword.callCount).toEqual(1);
        expect(services.project.exportCurrentProject.callCount).toEqual(1);
        expect(services.project.save.callCount).toEqual(1);
      });
    });

    it('should not save if credentials were cancelled', async () => {
      // Prepare
      services.modals.longOperationModal.resolves(OperationStatus.Succeed);

      abcRender(<ProjectControls />, { services, state });
      userEvent.click(screen.getByTestId('save-project'));

      const save = services.modals.longOperationModal.args[0][0]; // We grab save handler

      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newXyzLayer('http://nowhere.net/{x}/{y}/{z}'));
      services.geo.getMainMap.returns(map);
      services.modals.setProjectPassword.resolves({ type: ModalEventType.SetPasswordClosed, status: ModalStatus.Canceled, value: 'azerty1234' });

      const [compressed] = await TestHelper.sampleCompressedProject();
      services.project.exportCurrentProject.resolves(compressed);

      // Act
      await save();

      // Assert
      await TestHelper.wait(10); // We must wait for internal promise completion, otherwise test cannot fail
      await waitFor(() => {
        expect(services.modals.setProjectPassword.callCount).toEqual(1);
        expect(services.project.exportCurrentProject.callCount).toEqual(0);
        expect(services.project.save.callCount).toEqual(0);
      });
    });

    it('should not save if project is too heavy', async () => {
      // Prepare
      services.modals.longOperationModal.resolves(OperationStatus.Succeed);

      abcRender(<ProjectControls />, { services, state });
      userEvent.click(screen.getByTestId('save-project'));

      const save = services.modals.longOperationModal.args[0][0]; // We grab save handler
      services.geo.getMainMap.returns(MapFactory.createNaked());

      const compressed = { project: { size: 50_000_000 } } as unknown as CompressedProject<Blob>;
      services.project.exportCurrentProject.resolves(compressed);

      // Act
      await save();

      // Assert
      await TestHelper.wait(10); // We must wait for internal promise completion, otherwise test cannot fail
      await waitFor(() => {
        expect(services.project.exportCurrentProject.callCount).toEqual(1);
        expect(services.project.save.callCount).toEqual(0);
        expect(services.toasts.error.args).toEqual([['Sorry 😞 this project is too big to save online. You can export it to your computer.']]);
      });
    });

    it('should show sollicitation modal', async () => {
      // Prepare
      services.modals.longOperationModal.resolves(OperationStatus.Succeed);
      abcRender(<ProjectControls />, { services, state });

      // Act
      userEvent.click(screen.getByTestId('save-project'));

      // Assert
      await waitFor(() => {
        expect(services.modals.solicitation.callCount).toEqual(1);
      });
    });

    it('should not show sollicitation modal', async () => {
      // Prepare
      services.modals.longOperationModal.resolves(OperationStatus.Interrupted);
      abcRender(<ProjectControls />, { services, state });

      // Act
      userEvent.click(screen.getByTestId('save-project'));

      // Assert
      await TestHelper.wait(10); // We must wait for internal promise completion, otherwise test cannot fail
      await waitFor(() => {
        expect(services.modals.solicitation.callCount).toEqual(0);
      });
    });
  });

  describe('export project', () => {
    it('should export', async () => {
      // Prepare
      services.modals.longOperationModal.resolves(OperationStatus.Succeed);

      abcRender(<ProjectControls />, { services });
      userEvent.click(screen.getByTestId('export-project'));

      const exportProject = services.modals.longOperationModal.args[0][0]; // We grab export handler
      services.geo.getMainMap.returns(MapFactory.createNaked());

      const [compressed] = await TestHelper.sampleCompressedProject();
      services.project.exportCurrentProject.resolves(compressed);

      // Act
      await exportProject();

      // Assert
      await waitFor(() => {
        expect(services.project.exportCurrentProject.callCount).toEqual(1);
        expect(FileIO.outputBlob).toHaveBeenCalled();
      });
    });

    it('should ask for credentials before export', async () => {
      // Prepare
      services.modals.longOperationModal.resolves(OperationStatus.Succeed);

      abcRender(<ProjectControls />, { services });
      userEvent.click(screen.getByTestId('export-project'));

      const exportProject = services.modals.longOperationModal.args[0][0]; // We grab export handler

      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newXyzLayer('http://nowhere.net/{x}/{y}/{z}'));
      services.geo.getMainMap.returns(map);
      services.modals.setProjectPassword.resolves({ type: ModalEventType.SetPasswordClosed, status: ModalStatus.Confirmed, value: 'azerty1234' });

      const [compressed] = await TestHelper.sampleCompressedProject();
      services.project.exportCurrentProject.resolves(compressed);

      // Act
      await exportProject();

      // Assert
      await waitFor(() => {
        expect(services.modals.setProjectPassword.callCount).toEqual(1);
        expect(services.project.exportCurrentProject.callCount).toEqual(1);
        expect(FileIO.outputBlob).toHaveBeenCalled();
      });
    });

    it('should not export if credentials were cancelled', async () => {
      // Prepare
      services.modals.longOperationModal.resolves(OperationStatus.Succeed);

      abcRender(<ProjectControls />, { services });
      userEvent.click(screen.getByTestId('export-project'));

      const exportProject = services.modals.longOperationModal.args[0][0]; // We grab export handler

      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newXyzLayer('http://nowhere.net/{x}/{y}/{z}'));
      services.geo.getMainMap.returns(map);
      services.modals.setProjectPassword.resolves({ type: ModalEventType.SetPasswordClosed, status: ModalStatus.Canceled, value: 'azerty1234' });

      const [compressed] = await TestHelper.sampleCompressedProject();
      services.project.exportCurrentProject.resolves(compressed);

      // Act
      await exportProject();

      // Assert
      await TestHelper.wait(10); // We must wait for internal promise completion, otherwise test cannot fail
      await waitFor(() => {
        expect(services.modals.setProjectPassword.callCount).toEqual(1);
        expect(services.project.exportCurrentProject.callCount).toEqual(0);
        expect(FileIO.outputBlob).not.toHaveBeenCalled();
      });
    });

    it('should show sollicitation modal', async () => {
      // Prepare
      services.modals.longOperationModal.resolves(OperationStatus.Succeed);
      abcRender(<ProjectControls />, { services });

      // Act
      userEvent.click(screen.getByTestId('export-project'));

      // Assert
      await waitFor(() => {
        expect(services.modals.solicitation.callCount).toEqual(1);
      });
    });

    it('should not show sollicitation modal', async () => {
      // Prepare
      services.modals.longOperationModal.resolves(OperationStatus.Interrupted);
      abcRender(<ProjectControls />, { services });

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
