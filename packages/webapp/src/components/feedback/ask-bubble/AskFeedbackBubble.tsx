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

import Cls from './AskFeedbackBubble.module.scss';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';

const t = prefixedTranslation('AskFeedbackBubble:');

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

function AskFeedbackBubble(props: Props) {
  const { onConfirm, onCancel } = props;

  return (
    <div className={Cls.container}>
      <div className={Cls.bubble}>
        <p>{t('Hello')} 👋</p>
        <p>{t('Everything_is_fine')}</p>
        <p>{t('Give_your_opinion')}</p>
        <div className={'d-flex justify-content-end'}>
          <button onClick={onConfirm} className={Cls.btn}>
            {t('Ok')}
          </button>
          <button onClick={onCancel} className={Cls.btn}>
            {t('No_thanks')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(AskFeedbackBubble);
