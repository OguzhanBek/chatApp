export const generateUUID = () => {
  const params = "123456789abcdefghijklmnoprstuvyzxwq";
  let id = "";

  for (let i = 0; i < 9; i++) {
    const randomIndex = params.charAt(
      Math.floor(Math.random() * params.length)
    );
    id += randomIndex;
  }

  return id;
};
