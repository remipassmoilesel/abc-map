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

import React, { useCallback, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { AllTips } from '@abc-map/user-documentation';
import { getDocumentationLang, prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import Cls from './TipBubble.module.scss';

interface Props {
  id: string;
  label?: string;
  className?: string;
  size?: string;
}

const t = prefixedTranslation('TipBubble:');

function TipBubble(props: Props) {
  const id = props.id;
  const label = props.label;
  const className = props.className || '';
  const size = props.size;

  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleHide = useCallback(() => setOpen(false), []);

  const getTip = useCallback(() => {
    const tip = AllTips.find((bundle) => bundle.lang === getDocumentationLang())?.tips.find((tip) => tip.id === id);
    return tip?.content || t('This_tip_is_not_available');
  }, [id]);

  return (
    <>
      {/* Help icon */}
      <div onClick={handleClick} className={`${Cls.bubble} ${className}`} title={label || t('Help')}>
        {label && <div className={'mr-2'}>{label}</div>}
        <FaIcon icon={IconDefs.faQuestionCircle} size={size} className={Cls.icon} />
      </div>

      {/* Modal */}
      {open && (
        <Modal show={true} onHide={handleHide} size={'sm'} centered>
          <Modal.Body className={Cls.modalContent}>
            <div dangerouslySetInnerHTML={{ __html: getTip() }} />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default withTranslation()(TipBubble);
