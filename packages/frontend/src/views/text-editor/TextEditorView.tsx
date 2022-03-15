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

import Cls from './TextEditorView.module.scss';
import { withTranslation } from 'react-i18next';
import TextEditor, { TextEditorReference } from '../../components/text-editor/TextEditor';
import { useCallback, useRef, useState } from 'react';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('TextEditorView.tsx');

// FIXME: remove experimental controls
function TextEditorView() {
  const textEditorRef = useRef<TextEditorReference>(null);
  const [editorReadonly, setEditorReadonly] = useState(false);

  const handleSerialize = useCallback(() => {
    logger.warn('Editor content: ', textEditorRef.current?.serialize());
    alert('See console');
  }, []);

  const handlePreview = useCallback(() => setEditorReadonly(!editorReadonly), [editorReadonly]);

  return (
    <div className={Cls.view}>
      <div className={'d-flex'}>
        <button onClick={handleSerialize} className={'btn btn-outline-secondary mr-2'}>
          Serialize
        </button>
        <button onClick={handlePreview} className={'btn btn-outline-secondary'}>
          Preview / Edit
        </button>
      </div>

      <TextEditor ref={textEditorRef} readOnly={editorReadonly} className={Cls.editor} />
    </div>
  );
}

export default withTranslation()(TextEditorView);
