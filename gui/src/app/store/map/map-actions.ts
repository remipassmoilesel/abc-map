import {Action} from '@ngrx/store';
import {DrawingTool} from "../../lib/DrawingTool";

// Actions are events

export namespace MapModule {

  export enum ActionTypes {
    DRAWING_TOOL_CHANGED = '[map] Drawing tool changed',
  }

  export class DrawingToolChanged implements Action {
    readonly type = ActionTypes.DRAWING_TOOL_CHANGED;

    constructor(public tool: DrawingTool) {}
  }

  export type ActionsUnion = DrawingToolChanged;

}
