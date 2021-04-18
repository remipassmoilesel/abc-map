export function isNumeric(str: string): boolean {
  return !isNaN(str as any) && !isNaN(parseFloat(str));
}

/**
 * If passed argument "looks like" a number (001, 111, ...) it will be converted to.
 * @param str
 */
export function asNumberOrString(str: string): number | string {
  let value = str;

  // We normalize float separator
  if (value.indexOf(',')) {
    value = value.replace(',', '.');
  }

  if (isNumeric(value)) {
    return parseFloat(value);
  } else {
    return str;
  }
}
