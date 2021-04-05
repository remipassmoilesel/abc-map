import { Tip } from './Tip';
import { DataProcessing } from './data-processing';

export * from './data-processing';
export * from './Tip';

export const AllTips: Tip[] = [...DataProcessing];
