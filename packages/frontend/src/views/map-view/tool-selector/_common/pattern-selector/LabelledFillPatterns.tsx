import { FillPatterns } from '@abc-map/shared-entities';

export interface LabelledFillPattern {
  label: string;
  value: FillPatterns;
}

export class LabelledFillPatterns {
  public static readonly Flat: LabelledFillPattern = {
    label: 'Aplat',
    value: FillPatterns.Flat,
  };

  public static readonly Circles: LabelledFillPattern = {
    label: 'Cercles',
    value: FillPatterns.Circles,
  };

  public static readonly Squares: LabelledFillPattern = {
    label: 'Carrés',
    value: FillPatterns.Squares,
  };

  public static readonly HatchingVertical: LabelledFillPattern = {
    label: 'Hachures verticales',
    value: FillPatterns.HatchingVertical,
  };

  public static readonly HatchingHorizontal: LabelledFillPattern = {
    label: 'Hachures horizontales',
    value: FillPatterns.HatchingHorizontal,
  };

  public static readonly HatchingObliqueRight: LabelledFillPattern = {
    label: 'Hachures obliques \\\\',
    value: FillPatterns.HatchingObliqueRight,
  };

  public static readonly HatchingObliqueLeft: LabelledFillPattern = {
    label: 'Hachures obliques //',
    value: FillPatterns.HatchingObliqueLeft,
  };

  public static readonly All: LabelledFillPattern[] = [
    LabelledFillPatterns.Flat,
    LabelledFillPatterns.Circles,
    LabelledFillPatterns.Squares,
    LabelledFillPatterns.HatchingVertical,
    LabelledFillPatterns.HatchingHorizontal,
    LabelledFillPatterns.HatchingObliqueRight,
    LabelledFillPatterns.HatchingObliqueLeft,
  ];
}
