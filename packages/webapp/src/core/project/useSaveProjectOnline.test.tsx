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
import { newTestServices, TestServices } from '../utils/test/TestServices';
import { ProjectStatus } from './ProjectStatus';
import { useSaveProjectOnline } from './useSaveProjectOnline';
import { abcRender } from '../utils/test/abcRender';
import { useEffect } from 'react';

describe('saveProjectOnline', () => {
  let services: TestServices;

  beforeEach(() => {
    services = newTestServices();
    services.modals.longOperationModal.resolves();
  });

  it('should display info on succeed', async () => {
    services.project.saveCurrent.resolves(ProjectStatus.Ok);

    const status = await saveProjectOnline();

    expect(services.toasts.info.args).toEqual([['Saving ...'], ['Project saved !']]);
    expect(status).toEqual(ProjectStatus.Ok);
  });

  it('should display nothing if canceled', async () => {
    services.project.saveCurrent.resolves(ProjectStatus.Canceled);

    const status = await saveProjectOnline();

    expect(services.toasts.info.args).toEqual([['Saving ...']]);
    expect(services.toasts.error.callCount).toEqual(0);
    expect(status).toEqual(ProjectStatus.Canceled);
  });

  it('should display error if quota exceeded', async () => {
    services.project.saveCurrent.resolves(ProjectStatus.OnlineQuotaExceeded);

    const status = await saveProjectOnline();

    expect(services.toasts.tooMuchProjectError.callCount).toEqual(1);
    expect(status).toEqual(ProjectStatus.OnlineQuotaExceeded);
  });

  it('should display error is save fail', async () => {
    services.project.saveCurrent.rejects(new Error('Test error'));

    const err = await saveProjectOnline().catch((err) => err);

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toEqual('Test error');
    expect(services.toasts.genericError.callCount).toEqual(1);
  });

  function saveProjectOnline(): Promise<ProjectStatus> {
    return new Promise<ProjectStatus>((resolve, reject) => {
      const onStatus = (status: ProjectStatus) => {
        resolve(status);
      };

      const onError = (error: unknown) => {
        reject(error);
      };

      abcRender(<TestComponent onStatus={onStatus} onError={onError} />, { services });
    });
  }

  function TestComponent(props: { onStatus: (status: ProjectStatus) => void; onError: (err: unknown) => void }) {
    const { onStatus, onError } = props;
    const saveProjectOnline = useSaveProjectOnline();

    useEffect(() => {
      saveProjectOnline()
        .then((status) => onStatus(status))
        .catch((err) => onError(err));
    }, [onError, onStatus, saveProjectOnline]);
    return <div />;
  }
});
