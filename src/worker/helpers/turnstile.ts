async function validateTurnstile(
  token: string,
  remoteip: string
): Promise<{ success: boolean }> {
  const formData = new FormData();
  // @ts-expect-error env var
  formData.append("secret", process.env.TURNSTILE_SECRET);
  formData.append("response", token);
  formData.append("remoteip", remoteip);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    return result as { success: boolean };
  } catch (error) {
    console.error("Turnstile validation error:", error);
    return { success: false, "error-codes": ["internal-error"] };
  }
}

export default validateTurnstile;
