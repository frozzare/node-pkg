export const omit = (
  keys: string[],
  obj: Record<string, any>
): Record<string, any> => {
  if (!keys.length) return obj;
  const { [keys.pop() as string]: omitted, ...rest } = obj;
  return omit(keys, rest);
};
