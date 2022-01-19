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

import React, { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import { useServices } from '../../core/useServices';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';
import { WithTooltip } from '../with-tooltip/WithTooltip';

const logger = Logger.get('CopyButton.tsx');

const t = prefixedTranslation('CopyButton:');

interface Props {
  inputRef: MutableRefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  className?: string;
}

export function CopyButton(props: Props) {
  const { toasts } = useServices();
  const inputRef = props.inputRef;
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (!navigator?.clipboard?.writeText) {
      setDisabled(true);
    }
  }, []);

  const handleCopyLink = useCallback(() => {
    const input = inputRef.current;
    if (!input) {
      logger.error('Input reference not ready');
      toasts.genericError();
      return;
    }

    input.select();
    input.setSelectionRange(0, 99999);

    navigator.clipboard
      .writeText(input.value)
      .then(() => toasts.info(t('Copied')))
      .catch((err) => {
        toasts.genericError();
        logger.error('Cannot copy to clipboard: ', err);
      });
  }, [inputRef, toasts]);

  const title = disabled ? t('Cannot_copy_to_clipboard') : t('Copy_to_clipboard');

  const className = props.className || '';

  return (
    <WithTooltip title={title}>
      {/* Here we wrap with a div in order to show tooltip even if button is disabled */}
      <div className={className}>
        <button disabled={disabled} onClick={handleCopyLink} className={'btn btn-outline-primary'}>
          <FaIcon icon={IconDefs.faClipboard} />
        </button>
      </div>
    </WithTooltip>
  );
}
