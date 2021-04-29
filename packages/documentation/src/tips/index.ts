import { Tip } from './Tip';
import { DataProcessing } from './data-processing';
import { Tools } from './tools';

export * from './Tip';
export * from './data-processing';
export * from './tools';

export const AllTips: Tip[] = [...DataProcessing, ...Tools];
