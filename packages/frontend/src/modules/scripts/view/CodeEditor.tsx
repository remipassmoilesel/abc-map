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

import React, { useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import Cls from './CodeEditor.module.scss';
import clsx from 'clsx';

interface Props {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export function CodeEditor(props: Props) {
  const { content, className, onChange } = props;

  const highlightWithLineNumbers = useCallback((input: string) => {
    return highlight(input, languages.javascript, 'javascript')
      .split('\n')
      .map((line, i) => `<span class='${Cls.lineNumber}'>${i + 1}</span>${line}`)
      .join('\n');
  }, []);

  return (
    <Editor
      value={content}
      onValueChange={onChange}
      highlight={highlightWithLineNumbers}
      padding={10}
      textareaClassName={Cls.textarea}
      className={clsx(Cls.editor, className)}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        outline: 0,
      }}
      // This id is used in E2E tests
      textareaId={'code-editor'}
    />
  );
}
