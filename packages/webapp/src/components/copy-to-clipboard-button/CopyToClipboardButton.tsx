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

import React, { useCallback, useEffect, useState } from 'react';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import { useServices } from '../../core/useServices';
import { Logger } from '@abc-map/shared';
import { WithTooltip } from '../with-tooltip/WithTooltip';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const logger = Logger.get('CopyToClipboardButton.tsx');

interface Props {
  value: string;
  className?: string;
}

export function CopyToClipboardButton(props: Props) {
  const { toasts } = useServices();
  const { t } = useTranslation('CopyToClipboardButton');
  const { value, className } = props;
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (!navigator?.clipboard?.writeText) {
      setDisabled(true);
    }
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(value)
      .then(() => toasts.info(t('Copied')))
      .catch((err) => {
        toasts.genericError();
        logger.error('Cannot copy to clipboard: ', err);
      });
  }, [t, toasts, value]);

  const title = disabled ? t('Cannot_copy_to_clipboard') : t('Copy_to_clipboard');

  return (
    <WithTooltip title={title}>
      {/* Here we wrap with a div in order to show tooltip even if button is disabled */}
      <div className={clsx(className)}>
        <button disabled={disabled} onClick={handleCopy} className={'btn btn-outline-primary'}>
          <FaIcon icon={IconDefs.faClipboard} />
        </button>
      </div>
    </WithTooltip>
  );
}
