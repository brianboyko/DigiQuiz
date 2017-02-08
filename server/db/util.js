export const addByMethods = (fn, bys) => {
  bys.forEach((by) => {
    fn["by_" + by] = fn(by);
  });
};
