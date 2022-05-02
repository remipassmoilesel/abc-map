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

import Cls from './RemoteModule.module.scss';
import { Module } from '@abc-map/module-api';
import { useCallback } from 'react';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { WithTooltip } from '../../../components/with-tooltip/WithTooltip';
import { prefixedTranslation } from '../../../i18n/i18n';
import { useHistory } from 'react-router-dom';
import { Routes } from '../../../routes';

const t = prefixedTranslation('DataProcessingModules:RemoteModuleLoader.');

interface Props {
  module: Module;
  onUnload: (module: Module) => void;
}

function RemoteModuleItem(props: Props) {
  const { module, onUnload } = props;
  const history = useHistory();

  const handleOpen = useCallback(() => {
    history.push(Routes.dataProcessing().withParams({ moduleId: module.getId() }));
  }, [history, module]);

  const handleUnload = useCallback(() => onUnload(module), [module, onUnload]);

  return (
    <div className={Cls.module}>
      <button onClick={handleOpen} className={'btn btn-link d-flex align-items-center'}>
        <FaIcon icon={IconDefs.faPlug} className={'mr-2'} />
        {module.getReadableName()}
      </button>

      <button onClick={handleUnload} className={'btn btn-link'}>
        <WithTooltip title={t('Remove_module')}>
          <div>
            <FaIcon icon={IconDefs.faTrash} />
          </div>
        </WithTooltip>
      </button>
    </div>
  );
}

export default RemoteModuleItem;
