import { AbstractTool } from '../../../core/tools/AbstractTool';
import React, { useCallback } from 'react';
import { MapTool } from '@abc-map/shared';
import { prefixedTranslation } from '../../../i18n/i18n';
import Cls from './ToolButton.module.scss';

interface Props {
  tool: AbstractTool;
  active: boolean;
  onSelect: (tool: MapTool) => void;
}

const t = prefixedTranslation('core:tools.');

export function ToolButton(props: Props) {
  const { tool, active, onSelect } = props;
  const classes = active ? `${Cls.toolButton} ${Cls.active}` : Cls.toolButton;

  const handleSelect = useCallback(() => {
    onSelect(tool.getId());
  }, [onSelect, tool]);

  return (
    <button
      onClick={handleSelect}
      title={t(tool.getI18nLabel())}
      className={classes}
      data-cy={`tool-${tool.getId().toLocaleLowerCase()}`}
      data-active={active}
      dangerouslySetInnerHTML={{ __html: tool.getIcon() }}
    />
  );
}
