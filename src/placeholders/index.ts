import placeholderFaker from "./placeholder-faker";

export default (text: string): string => {
  if (!text) return "";

  text = placeholderFaker(text);

  return text;
};
