export class Shortcuts {
  public static isDelete(ev: KeyboardEvent): boolean {
    return ev.key === 'Delete' && !ev.shiftKey && !ev.ctrlKey && !ev.altKey;
  }

  public static isUndo(ev: KeyboardEvent): boolean {
    return ev.ctrlKey && ev.key === 'z' && !ev.shiftKey;
  }

  public static isRedo(ev: KeyboardEvent): boolean {
    return ev.ctrlKey && ev.shiftKey && ev.key === 'Z';
  }
}
