export const isValidString = (filename: string) => {
  return typeof filename === 'string' && filename.length > 0;
};
