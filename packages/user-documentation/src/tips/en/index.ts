import { I18nTips } from '../Tip';
import { DataProcessing } from './data-processing';
import { Tools } from './tools';
import { DocumentationLang } from '../../DocumentationLang';

export const EnTips: I18nTips = {
  lang: DocumentationLang.English,
  tips: [...DataProcessing, ...Tools],
};
