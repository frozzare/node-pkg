export const omit = (
  keys: string[],
  obj: Record<string, any>
): Record<string, any> => {
  if (!keys.length) return obj;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [keys.pop() as string]: omitted, ...rest } = obj;
  return omit(keys, rest);
};
