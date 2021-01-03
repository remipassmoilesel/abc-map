import * as toc from './toc.md';
import * as developer from './developer';
import * as user from './user';

export interface Documentation {
  toc: string;
  modules: string[];
}

const content: Documentation = {
  toc,
  modules: [...user.content, ...developer.content],
};

export { content };
