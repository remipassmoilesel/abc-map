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

import React, { useCallback, useEffect, useState } from 'react';
import AskFeedbackBubble from './ask-bubble/AskFeedbackBubble';
import { useServices } from '../../core/useServices';
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

    const timeout1 = setTimeout(showBubble, 10 * 60 * 1000);
    const timeout2 = setTimeout(showBubble, 30 * 60 * 1000);

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
