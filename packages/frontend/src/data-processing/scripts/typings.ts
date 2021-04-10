import { ScriptMap } from './api/ScriptMap';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export type LogFunction = (data: object | undefined) => void;

export interface ScriptArguments {
  map: ScriptMap;
  log: LogFunction;
}

export interface ErrorPosition {
  line: number;
  column: number;
}

export const FirefoxErrorRegexp = new RegExp(/AsyncFunction:([0-9]+):([0-9]+)/);
export const ChromiumErrorRegexp = new RegExp(/<anonymous>:([0-9]+):([0-9]+)/);

export class ScriptError extends Error {
  constructor(message: string, public output: string[] = []) {
    super(message);
  }
}

export const Example = `\
// A simplified API of map is available as 'map' variable
for(const layer of map.listLayers()){
  log(layer.name)
}
`;
