export const isValidString = (filename: string) => {
  return typeof filename === 'string' && filename.length > 0;
};

// 判断s是否为非负整数
export const isPositiveInter = (s) =>
  typeof s === 'number' && s >= 0 && s % 1 === 0;
