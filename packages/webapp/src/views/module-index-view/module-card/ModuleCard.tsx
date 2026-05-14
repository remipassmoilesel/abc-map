/**
 * Copyright © 2026 Rémi Pace.
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

import Cls from './ModuleCard.module.scss';
import clsx from 'clsx';
import type { MouseEvent } from 'react';
import { useCallback } from 'react';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { UiActions } from '../../../store/ui/actions';
import type { AbcModule } from '../../../modules/AbcModule.ts';

interface Props {
  module: AbcModule;
  onOpen: (mod: AbcModule) => void;
  className?: string;
}

export function ModuleCard(props: Props) {
  const { module, onOpen, className } = props;

  const dispatch = useAppDispatch();
  const name = module.getReadableName();
  const shortDescription = module.getShortDescription();

  const favorites = useAppSelector((st) => st.ui.favoriteModules);
  const isFavorite = favorites.includes(module.getId());

  const handleOpenModule = useCallback(() => onOpen(module), [onOpen, module]);

  const handleToggleFavorite = useCallback(
    (ev: MouseEvent) => {
      ev.stopPropagation();
      dispatch(UiActions.markFavorite(module.getId(), !isFavorite));
    },
    [dispatch, module, isFavorite],
  );

  return (
    <div className={clsx(Cls.card, className)} onClick={handleOpenModule}>
      <button onClick={handleOpenModule} className={clsx(Cls.name, 'btn btn-link mb-4')} data-cy={'open-module'}>
        {name}
      </button>
      <div onClick={handleOpenModule} className={Cls.shortDescription} dangerouslySetInnerHTML={{ __html: shortDescription }} />

      <div className={'flex-grow-1'} />
      <div className={'d-flex justify-content-end'}>
        <button onClick={handleToggleFavorite} className={clsx('btn btn-outline-primary', 'mr-2')}>
          <FaIcon icon={isFavorite ? IconDefs.faStarSolid : IconDefs.faStarRegular} />
        </button>
      </div>
    </div>
  );
}
