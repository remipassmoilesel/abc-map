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

import Cls from './ArtefactCard.module.scss';
import React, { useCallback } from 'react';
import { AbcArtefact, getTextByLang, Logger } from '@abc-map/shared';
import { getLang } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import clsx from 'clsx';
import { getArtefactIcon } from '../../../core/data/getArtefactIcon';
import { FaIcon } from '../../../components/icon/FaIcon';
import { stripHtml } from '../../../core/utils/strings';

const logger = Logger.get('ArtefactCard.tsx');

interface Props {
  selected: boolean;
  artefact: AbcArtefact;
  onSelected: (artefact: AbcArtefact) => void;
}

function ArtefactCard(props: Props) {
  const { artefact, selected, onSelected } = props;
  const name = getTextByLang(artefact.name, getLang());
  const description = getTextByLang(artefact.description, getLang());
  const icon = getArtefactIcon(artefact);

  const handleSelected = useCallback(() => onSelected(artefact), [artefact, onSelected]);

  return (
    <div className={clsx('card card-body', Cls.artefact, selected && Cls.selected)} onClick={handleSelected}>
      <h1 className={'d-flex align-items-center'} data-cy={'artefact-name'}>
        <FaIcon icon={icon} size={'1.4rem'} className={'mr-2'} />
        {name}
      </h1>
      {description && <div className={Cls.description}>{stripHtml(description)}</div>}
    </div>
  );
}

export default withTranslation()(ArtefactCard);
