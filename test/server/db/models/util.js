export const generateFakeUsers = (num) => {
  let fakes = [];
  for (let i = 0; i < num; i++) {
    fakes.push({
      login: "L" + Math.random()
        .toString(),
      password: "P" + Math.random()
        .toString(),
      email: "E" + Math.random()
        .toString(),
      first_name: "F" + Math.random()
        .toString(),
      last_name: "N" + Math.random()
        .toString(),
    });
  }
  return fakes;
};
