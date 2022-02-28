import React, { useCallback } from 'react';
import { AbcLegend } from '@abc-map/shared';

interface Props {
  label: string;
  legend: AbcLegend;
  disabled?: boolean;
  onClick: (legend: AbcLegend) => void;
}

export function CloneLegendButton(props: Props) {
  const { onClick, legend, label, disabled } = props;

  const handleClick = useCallback(() => onClick(legend), [legend, onClick]);

  return (
    <button onClick={handleClick} disabled={disabled} className={'btn btn-link'}>
      {label} ({legend.items.length} élements, {legend.width} x {legend.height})
    </button>
  );
}
