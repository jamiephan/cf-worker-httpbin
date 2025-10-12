import { faker } from "@faker-js/faker";

export default (text: string): string => {
  if (!text) return "";
  const fakerRegex = /{{faker\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)}}/g;
  return text.replace(fakerRegex, (_, category, method) => {
    const fakerCategory = (faker as unknown as Record<string, unknown>)[
      category
    ];
    if (
      typeof fakerCategory === "object" &&
      fakerCategory !== null &&
      method in fakerCategory
    ) {
      const fakerMethod = (fakerCategory as Record<string, unknown>)[method];
      if (typeof fakerMethod === "function") {
        return fakerMethod();
      }
    }
    return `{{faker.${category}.${method}}}`;
  });
};
