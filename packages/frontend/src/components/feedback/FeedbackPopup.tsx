import React, { useCallback, useEffect, useState } from 'react';
import AskFeedbackBubble from './ask-bubble/AskFeedbackBubble';
import { useServices } from '../../core/hooks';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('FeedbackPopup.tsx');

function FeedbackPopup() {
  const { modals } = useServices();
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const showBubble = () => {
      if (!dismissed) {
        setShowBubble(true);
      }
    };

    const timeout1 = setTimeout(showBubble, 2 * 60 * 1000);
    const timeout2 = setTimeout(showBubble, 15 * 60 * 1000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [dismissed]);

  const handleBubbleCancel = useCallback(() => {
    setShowBubble(false);
    setDismissed(true);
  }, []);

  const handleBubbleConfirm = useCallback(() => {
    setShowBubble(false);
    modals.textFeedback().catch((err) => logger.error('Feedback modal error: ', err));
  }, [modals]);

  if (showBubble) {
    return <AskFeedbackBubble onCancel={handleBubbleCancel} onConfirm={handleBubbleConfirm} />;
  } else {
    return <></>;
  }
}

export default FeedbackPopup;
