// src/App.tsx

import { Turnstile } from "@marsidev/react-turnstile";
import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { commonHeadersConfig, formTemplateConfig } from "../config";

import { HTTPMethod } from "../const/HTTPMethod";
import "./App.css";

function App() {
  const ref = useRef(null);

  const [modelConfig, setModelConfig] = useState({
    title: "",
    description: <></>,
    isOpen: false,
  });
  const form = useForm({
    defaultValues: {
      statusCode: formTemplateConfig[0].status,
      method: formTemplateConfig[0].method as HTTPMethod,
      header: formTemplateConfig[0].headers,
      body: formTemplateConfig[0].body,
    },
    onSubmit: async ({ value }) => {
      // Get the Turnstile token
      // @ts-expect-error turnstile ref
      await ref.current?.reset();
      // @ts-expect-error turnstile ref
      const turnstileToken = await ref.current?.getResponsePromise();

      const res = await fetch("/api/bin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...value, turnstileToken }),
      });
      if (!res.ok) {
        const error = await res.json();
        setModelConfig({
          title: "Error",
          description: (
            <>Failed to create bin: {error.error || "Unknown error"}</>
          ),
          isOpen: true,
        });
        return;
      }
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
              <button
                className="secondary"
                onClick={async () => {
                  const res = await fetch(
                    `/api/bin/${data.bin}?token=${data.token}`,
                    {
                      method: "DELETE",
                    }
                  );
                  const result = await res.json();
                  if (result.success) {
                    setModelConfig({
                      title: "HTTP Bin has been deleted",
                      description: (
                        <>
                          The bin <code>{data.bin}</code> has been deleted
                          successfully.
                        </>
                      ),
                      isOpen: true,
                    });
                  } else {
                    alert("Failed to delete bin");
                  }
                }}
              >
                Delete now
              </button>
            </li>
          </ul>
        ),
        isOpen: true,
      });
    },
  });

  return (
    <main className="container" style={{ marginTop: 32 }}>
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
          A simple HTTP Bin. Thats it. supports{" "}
          <code>
            <a href="https://fakerjs.dev/api/" target="_blank">
              {"{{faker.module.name}}"}
            </a>
          </code>
          .
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
          <h2>HTTP Method</h2>
          <form.Field
            name="method"
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
                  <select
                    value={subField.state.value}
                    onChange={(e) =>
                      subField.handleChange(e.target.value as HTTPMethod)
                    }
                  >
                    {HTTPMethod.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }}
          </form.Field>
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
            {commonHeadersConfig.map((header) => (
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

          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <Turnstile ref={ref} siteKey="0x4AAAAAAB6L4sQbViN1FAE2" />
          </div>

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

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <details>
          <summary>&#x1f4c3; Toggle Templates</summary>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const index = parseInt(
                (e.currentTarget.elements[0] as HTMLSelectElement).value,
                10
              );
              const template = formTemplateConfig[index];
              console.log(template);
              form.setFieldValue("statusCode", template.status);
              form.setFieldValue("header", template.headers);
              form.setFieldValue("body", template.body);
            }}
          >
            <select>
              {formTemplateConfig.map((template, index) => (
                <option value={index} key={index}>
                  {template.name}
                </option>
              ))}
            </select>
            <button type="submit" className="secondary">
              Apply Template
            </button>
          </form>
        </details>
      </div>
    </main>
  );
}

export default App;
