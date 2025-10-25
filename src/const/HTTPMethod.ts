export const HTTPMethod = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
  "TRACE",
  "CONNECT",
  "ANY",
];

export type HTTPMethod = (typeof HTTPMethod)[number];
