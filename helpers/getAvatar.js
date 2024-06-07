export const getAvatar = (theme) => {
  const baseUrl =
    "https://res.cloudinary.com/dvjg8aoza/image/upload/v1717539986";

  switch (theme) {
    case "light":
      return `${baseUrl}/user-light_doabt6.png`;
    case "violet":
      return `${baseUrl}/user-violet_dzrfqv.png`;
    case "dark":
      return `${baseUrl}/user-dark_w1uksl.png`;
  }
};
