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
          <button onClick={onConfirm} className={Cls.btnOk}>
            {t('Ok')}
          </button>
          <button onClick={onCancel} className={Cls.btnNo}>
            {t('No_thanks')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(AskFeedbackBubble);
