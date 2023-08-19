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

import React from 'react';
import Cls from './PaypalButton.module.scss';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import PaypalGif from './paypal.gif';

interface Props {
  className: string;
}

export function PaypalButton(props: Props) {
  const { className } = props;
  const { t } = useTranslation('FundingLinks');

  return (
    <form action="https://www.paypal.com/donate" method="post" target="_top">
      <input type="hidden" name="hosted_button_id" value="WH89JA8JJPRCQ" />
      <input type="image" name="submit" src={PaypalGif} title={t('Donate_with_paypal')} alt={t('Donate_with_paypal')} className={clsx(Cls.input, className)} />
      {/* Do not add a alt tag here, image loads often incorrectly */}
      <img src="https://www.paypal.com/fr_FR/i/scr/pixel.gif" crossOrigin="anonymous" width="1" height="1" className={Cls.image} alt={''} />
    </form>
  );
}
