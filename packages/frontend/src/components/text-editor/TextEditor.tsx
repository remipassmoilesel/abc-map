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

import Cls from './TextEditor.module.scss';
import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { renderElement, renderLeaf } from './render';
import ControlBar from './control-bar/ControlBar';
import { keyboardShortcuts } from './keyboardShortcuts';
import { withHistory } from 'slate-history';
import { withTables } from './elements/table/withTables';
import { withVideos } from './elements/video/withVideos';
import clsx from 'clsx';
import { withImages } from './elements/image/withImages';
import { EditorContext, EditorProvider } from './useEditor';
import { withLists } from './elements/list/withLists';
import { withLinks } from './elements/link/withLinks';
import { TextFrameChild } from '@abc-map/shared';
import { withTranslation } from 'react-i18next';
import { withMapSymbol } from './elements/map-symbol/withMapSymbol';

export interface Props {
  value: TextFrameChild[];
  onChange: (content: TextFrameChild[]) => void;
  readOnly?: boolean;
  className?: string;
  controlBar?: boolean;
  ratio?: number;
  background?: string;
  'data-cy'?: string;
}

/**
 * Rich text editor, used in frames for static exports and shared map.
 *
 * This is component is not a pure controlled component.
 *
 * All styles and sizes that scales (e.g for exports) must be in 'em' unit, in order to scale.
 *
 * @param props
 * @constructor
 */
// TODO: Setup nested tables
// TODO: Add history wiring with HistoryService
function TextEditor(props: Props) {
  const { value, onChange, readOnly, className, controlBar: _controlBar, ratio: _ratio, background, 'data-cy': dataCy } = props;
  const ratio = _ratio ?? 1;
  const controlBar = _controlBar ?? true;

  // Create editor
  const [editor] = useState(() => {
    /* prettier-ignore */
    return [
      withReact,
      withHistory,
      withTables,
      withVideos,
      withImages,
      withLists,
      withLinks,
      withMapSymbol,
    ].reduce((editor, f) => f(editor), createEditor());
  });

  // We use a derived state as explained in slate documentation
  // We must use a setState() and set children property of editor to update it correctly in all cases
  const [derivedValue, setDerivedValue] = useState<Descendant[]>(() => value ?? [{ type: 'paragraph', children: [{ text: '' }] }]);
  useEffect(() => {
    editor.children = value;
    setDerivedValue(value);
  }, [editor, value]);

  // When user clicks on editor, we focus so he can start typing
  const handleClick = useCallback(() => {
    if (!readOnly) {
      ReactEditor.focus(editor);
    }
  }, [editor, readOnly]);

  // Context returned by useEditor() hook
  const context: EditorContext = useMemo(() => ({ readOnly: readOnly ?? false, editor, ratio }), [editor, readOnly, ratio]);

  // We set font size according to ratio
  // All children use 'em' units and will adapt styles according to this value
  const style: CSSProperties = useMemo(() => ({ fontSize: `${ratio}em`, background }), [background, ratio]);

  return (
    <div onClick={handleClick} style={style} className={clsx(Cls.textEditor, className)}>
      <EditorProvider value={context}>
        {/* Control bar, visible only if readonly not disabled */}
        {!readOnly && controlBar && <ControlBar className={Cls.controlBar} />}

        {/* Editor, scrollable */}
        <div className={clsx(Cls.editorContainer, readOnly && Cls.readOnly)}>
          <Slate editor={editor} value={derivedValue} onChange={onChange}>
            <Editable
              spellCheck
              autoFocus
              readOnly={readOnly}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={keyboardShortcuts(editor)}
              data-cy={dataCy}
            />
          </Slate>
        </div>
      </EditorProvider>
    </div>
  );
}

export default withTranslation()(TextEditor);
