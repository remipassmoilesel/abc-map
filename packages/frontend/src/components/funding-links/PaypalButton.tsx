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

import React from 'react';
import Cls from './PaypalButton.module.scss';

class PaypalButton extends React.Component<{}, {}> {
  public render() {
    return (
      <form action="https://www.paypal.com/donate" method="post" target="_top">
        <input type="hidden" name="hosted_button_id" value="WH89JA8JJPRCQ" />
        <input
          type="image"
          name="submit"
          src="https://www.paypalobjects.com/fr_FR/FR/i/btn/btn_donateCC_LG.gif"
          title="PayPal"
          alt="Faites un don Paypal"
          className={Cls.input}
        />
        <img src="https://www.paypal.com/fr_FR/i/scr/pixel.gif" width="1" height="1" className={Cls.image} alt="" />
      </form>
    );
  }
}

export default PaypalButton;
