const formTemplate = [
  {
    name: "Regular - JSON - Success",
    status: 200,
    headers: [
      {
        name: "Content-Type",
        value: "application/json",
      },
    ],
    body: `{ msg: "Hello, {{faker.person.firstName}}. This is a successful JSON response. " }`,
  },
  {
    name: "Regular - JSON - Success (CORS)",
    status: 200,
    headers: [
      {
        name: "Content-Type",
        value: "application/json",
      },
      {
        name: "Access-Control-Allow-Origin",
        value: "*",
      },
    ],
    body: `{ msg: "Hello, {{faker.person.firstName}}. This is a successful CORS JSON response. " }`,
  },
  {
    name: "Regular - JSON - Failure",
    status: 400,
    headers: [
      {
        name: "Content-Type",
        value: "application/json",
      },
    ],
    body: `{ msg: "Hello, {{faker.person.firstName}}. This is a failed JSON response. " }`,
  },
  {
    name: "Regular - HTML - Success",
    status: 200,
    headers: [
      {
        name: "Content-Type",
        value: "text/html",
      },
    ],
    body: `<html><body><h1>Hello, {{faker.person.firstName}}. This is a successful HTML response.</h1></body></html>`,
  },
  {
    name: "Regular - HTML - Success (CORS)",
    status: 200,
    headers: [
      {
        name: "Content-Type",
        value: "text/html",
      },
      {
        name: "Access-Control-Allow-Origin",
        value: "*",
      },
    ],
    body: `<html><body><h1>Hello, {{faker.person.firstName}}. This is a successful CORS HTML response.</h1></body></html>`,
  },
  {
    name: "Regular - HTML - Failure",
    status: 400,
    headers: [
      {
        name: "Content-Type",
        value: "text/html",
      },
    ],
    body: `<html><body><h1>Hello, {{faker.person.firstName}}. This is a failed HTML response.</h1></body></html>`,
  },
  {
    name: "Regular - Plain Text - Success",
    status: 200,
    headers: [
      {
        name: "Content-Type",
        value: "text/plain",
      },
    ],
    body: `Hello, {{faker.person.firstName}}. This is a successful plain text response.`,
  },
  {
    name: "Regular - Plain Text - Success (CORS)",
    status: 200,
    headers: [
      {
        name: "Content-Type",
        value: "text/plain",
      },
      {
        name: "Access-Control-Allow-Origin",
        value: "*",
      },
    ],
    body: `Hello, {{faker.person.firstName}}. This is a successful CORS plain text response.`,
  },
  {
    name: "Regular - Plain Text - Failure",
    status: 400,
    headers: [
      {
        name: "Content-Type",
        value: "text/plain",
      },
    ],
    body: `Hello, {{faker.person.firstName}}. This is a failed plain text response.`,
  },
  {
    name: "Regular - XML - Success",
    status: 200,
    headers: [
      {
        name: "Content-Type",
        value: "application/xml",
      },
    ],
    body: `<response><msg>Hello, {{faker.person.firstName}}. This is a successful XML response.</msg></response>`,
  },
  {
    name: "Regular - XML - Success (CORS)",
    status: 200,
    headers: [
      {
        name: "Content-Type",
        value: "application/xml",
      },
      {
        name: "Access-Control-Allow-Origin",
        value: "*",
      },
    ],
    body: `<response><msg>Hello, {{faker.person.firstName}}. This is a successful CORS XML response.</msg></response>`,
  },
  {
    name: "Regular - XML - Failure",
    status: 400,
    headers: [
      {
        name: "Content-Type",
        value: "application/xml",
      },
    ],
    body: `<response><msg>Hello, {{faker.person.firstName}}. This is a failed XML response.</msg></response>`,
  },

  // --- Start weird stuff ---
  {
    name: "Quirks - WWW-Authenticate - basic",
    status: 401,
    headers: [
      {
        name: "Content-Type",
        value: "application/json",
      },
      {
        name: "WWW-Authenticate",
        value: 'Basic realm="Access to the site", charset="UTF-8"',
      },
    ],
    body: `{ msg: "Hello, {{faker.person.firstName}}. This response includes a WWW-Authenticate header." }`,
  },
  {
    name: "Quirks - WWW-Authenticate - NTLM (Windows)",
    status: 401,
    headers: [
      {
        name: "Content-Type",
        value: "application/json",
      },
      {
        name: "WWW-Authenticate",
        value: "NTLM",
      },
    ],
    body: `{ msg: "Hello, {{faker.person.firstName}}. This response includes a WWW-Authenticate NTLM header." }`,
  },
  {
    name: "Quirks - WWW-Authenticate - Digest",
    status: 401,
    headers: [
      {
        name: "Content-Type",
        value: "application/json",
      },
      {
        name: "WWW-Authenticate",
        value:
          'Digest realm="Access to the site", qop="auth", nonce="abcdef1234567890", opaque="0987654321fedcba"',
      },
    ],
    body: `{ msg: "Hello, {{faker.person.firstName}}. This response includes a WWW-Authenticate Digest header." }`,
  },
  {
    name: "Quirks - Empty Body - 204 No Content",
    status: 204,
    headers: [
      {
        name: "Content-Type",
        value: "application/json",
      },
    ],
    body: ``,
  },
  {
    name: "Quirks - 302 Redirect",
    status: 302,
    headers: [
      {
        name: "Location",
        value: "https://example.com/",
      },
    ],
    body: `You are being redirected to https://example.com/`,
  },
  {
    name: "Quirks - Cookie Header",
    status: 200,
    headers: [
      {
        name: "Content-Type",
        value: "application/json",
      },
      {
        name: "Set-Cookie",
        value:
          "sessionId=abc123; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=30",
      },
    ],
    body: `{ msg: "Hello, {{faker.person.firstName}}. This response includes a Set-Cookie header." }`,
  },
];

type FormTemplateEntry = {
  name: string;
  status: number;
  headers: Array<{
    name: string;
    value: string;
  }>;
  body: string;
};

export default formTemplate as FormTemplateEntry[];
