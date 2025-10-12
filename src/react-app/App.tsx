// src/App.tsx

import "./App.css";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";

const commonResponseHeaders = [
  "Accept-CH",
  "Access-Control-Allow-Origin",
  "Access-Control-Allow-Credentials",
  "Access-Control-Expose-Headers",
  "Access-Control-Max-Age",
  "Access-Control-Allow-Methods",
  "Access-Control-Allow-Headers",
  "Accept-Patch",
  "Accept-Ranges",
  "Age",
  "Allow",
  "Alt-Svc",
  "Cache-Control",
  "Connection",
  "Content-Disposition",
  "Content-Encoding",
  "Content-Language",
  "Content-Length",
  "Content-Location",
  "Content-MD5",
  "Content-Range",
  "Content-Type",
  "Date",
  "Delta-Base",
  "ETag",
  "Expires",
  "IM",
  "Last-Modified",
  "Link",
  "Location",
  "P3P",
  "Pragma",
  "Preference-Applied",
  "Proxy-Authenticate",
  "Public-Key-Pins",
  "Retry-After",
  "Server",
  "Set-Cookie",
  "Strict-Transport-Security",
  "Trailer",
  "Transfer-Encoding",
  "Tk",
  "Upgrade",
  "Vary",
  "Via",
  "Warning",
  "WWW-Authenticate",
  "X-Frame-Options",
];

function App() {
  const [modelConfig, setModelConfig] = useState({
    title: "",
    description: <></>,
    isOpen: false,
  });
  const form = useForm({
    defaultValues: {
      statusCode: 200,
      header: [] as { name: string; value: string }[],
      body: "",
    },
    onSubmit: async ({ value }) => {
      const res = await fetch("/api/bin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      const data = await res.json();
      setModelConfig({
        title: "HTTP Bin has been created",
        description: (
          <ul>
            <li>
              Bin ID: <code>{data.bin}</code>
            </li>
            <li>
              Delete Token: <code>{data.token}</code>
            </li>
            <li>
              Preview (any HTTP method):
              <code>
                <a href={`${window.location.origin}/bin/${data.bin}`}>
                  {window.location.origin}/bin/{data.bin}
                </a>
              </code>
            </li>
            <li>
              Delete:{" "}
              <code>
                curl -X DELETE {window.location.origin}/api/bin/{data.bin}
                ?token={data.token}
              </code>
            </li>
          </ul>
        ),
        isOpen: true,
      });
    },
  });

  return (
    <main className="container">
      <dialog open={modelConfig.isOpen}>
        <article>
          <h2>{modelConfig.title}</h2>
          <p>{modelConfig.description}</p>
          <footer>
            <button
              onClick={() => setModelConfig({ ...modelConfig, isOpen: false })}
            >
              Close
            </button>
          </footer>
        </article>
      </dialog>

      <div className="header">
        <h1>Simple HTTP Bin</h1>
        <p>
          Thats it. supports{" "}
          <code>
            <a href="https://fakerjs.dev/api/" target="_blank">
              {"{{faker.module.name}}"}
            </a>
          </code>
        </p>
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <h2>HTTP Status Code</h2>
          <form.Field
            name="statusCode"
            validators={{
              onChange: ({ value }) =>
                value === undefined || value === null
                  ? "You must enter a status code"
                  : undefined,
            }}
          >
            {(subField) => {
              return (
                <div>
                  <input
                    type="number"
                    value={subField.state.value}
                    onChange={(e) =>
                      subField.handleChange(e.target.valueAsNumber)
                    }
                    placeholder="200"
                    aria-invalid={
                      !subField.state.meta.isValid ? "true" : undefined
                    }
                    aria-describedby={
                      !subField.state.meta.isValid
                        ? "invalid-status-code"
                        : undefined
                    }
                  />
                  {!subField.state.meta.isValid && (
                    <small id="invalid-status-code">
                      Please provide a valid status code!
                    </small>
                  )}
                </div>
              );
            }}
          </form.Field>

          <h2>Headers</h2>
          <datalist id="common-response-headers">
            {commonResponseHeaders.map((header) => (
              <option value={header} key={header} />
            ))}
          </datalist>
          <form.Field name="header" mode="array">
            {(field) => {
              return (
                <div>
                  {field.state.value.map((_, i) => {
                    return (
                      <div className="grid" key={i}>
                        {/* Header Name */}
                        <form.Field
                          name={`header[${i}].name`}
                          validators={{
                            onChange: ({ value }) =>
                              !value.trim().length
                                ? "You must enter a header name"
                                : undefined,
                          }}
                        >
                          {(subField) => {
                            return (
                              <div>
                                <input
                                  value={subField.state.value}
                                  list="common-response-headers"
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  placeholder={`Header ${i + 1} Name`}
                                  aria-invalid={
                                    !subField.state.meta.isValid
                                      ? "true"
                                      : undefined
                                  }
                                  aria-describedby={
                                    !subField.state.meta.isValid
                                      ? "invalid-header-name"
                                      : undefined
                                  }
                                />
                                {!subField.state.meta.isValid && (
                                  <small id="invalid-header-name">
                                    Please provide a valid name!
                                  </small>
                                )}
                              </div>
                            );
                          }}
                        </form.Field>

                        {/* Header Value */}
                        <form.Field
                          name={`header[${i}].value`}
                          validators={{
                            onChange: ({ value }) =>
                              !value.trim().length
                                ? "You must enter a header value"
                                : undefined,
                          }}
                        >
                          {(subField) => {
                            return (
                              <div>
                                <input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  placeholder={`Header ${i + 1} Value`}
                                  aria-invalid={
                                    !subField.state.meta.isValid
                                      ? "true"
                                      : undefined
                                  }
                                  aria-describedby={
                                    !subField.state.meta.isValid
                                      ? "invalid-header-value"
                                      : undefined
                                  }
                                />
                                {!subField.state.meta.isValid && (
                                  <small id="invalid-header-value">
                                    Please provide a valid value!
                                  </small>
                                )}
                              </div>
                            );
                          }}
                        </form.Field>

                        {/* Remove Header */}
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => field.removeValue(i)}
                        >
                          -
                        </button>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => field.pushValue({ name: "", value: "" })}
                    type="button"
                  >
                    +
                  </button>
                </div>
              );
            }}
          </form.Field>

          <h2>Response Body</h2>
          <form.Field name="body">
            {(field) => (
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Response Body"
                aria-invalid={!field.state.meta.isValid ? "true" : undefined}
              />
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </button>
            )}
          />
        </form>
      </div>
    </main>
  );
}

export default App;
