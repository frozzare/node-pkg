export const omit = (keys, obj) =>
  (Array.isArray(keys) ? keys : [keys]).reduce((a, e) => {
    const { [e]: omit, ...rest } = a;
    return rest;
  }, obj);
