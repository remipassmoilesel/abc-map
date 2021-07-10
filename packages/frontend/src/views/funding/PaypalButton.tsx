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
