import { Map } from 'ol';

export interface AbcWindow extends Window {
  abc: {
    mainMap?: Map;
  };
}
