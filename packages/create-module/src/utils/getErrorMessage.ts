export function getErrorMessage(err: unknown | undefined | any): string {
  const message = !!err && typeof err === 'object' && 'message' in err && err.message;
  return message || '<no-error-message>';
}
