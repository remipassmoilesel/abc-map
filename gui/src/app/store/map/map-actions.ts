import {Action} from '@ngrx/store';
import {DrawingTool} from '../../lib/map/DrawingTool';

// Actions are events

export namespace MapModule {

  export enum ActionTypes {
    DRAWING_TOOL_CHANGED = '[map] Drawing tool changed',
    ACTIVE_FOREGROUND_COLOR_CHANGED = '[map] Active foreground color changed',
    ACTIVE_BACKGROUND_COLOR_CHANGED = '[map] Active background color changed',
  }

  export class DrawingToolChanged implements Action {
    readonly type = ActionTypes.DRAWING_TOOL_CHANGED;

    constructor(public tool: DrawingTool) {}
  }

  export class ActiveForegroundColorChanged implements Action {
    readonly type = ActionTypes.ACTIVE_FOREGROUND_COLOR_CHANGED;

    constructor(public color: string) {}
  }

  export class ActiveBackgroundColorChanged implements Action {
    readonly type = ActionTypes.ACTIVE_BACKGROUND_COLOR_CHANGED;

    constructor(public color: string) {}
  }

  export type ActionsUnion = DrawingToolChanged
    | ActiveBackgroundColorChanged
    | ActiveForegroundColorChanged ;

}
