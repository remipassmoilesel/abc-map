import * as referenceFr from './fr';
import * as referenceEn from './en';
import { DocumentationLang } from '../DocumentationLang';

export interface I18nReference {
  lang: DocumentationLang;
  toc: string;
  modules: string[];
}

export const References: I18nReference[] = [
  {
    lang: DocumentationLang.French,
    toc: referenceFr.toc,
    modules: referenceFr.content,
  },
  {
    lang: DocumentationLang.English,
    toc: referenceEn.toc,
    modules: referenceEn.content,
  },
];
