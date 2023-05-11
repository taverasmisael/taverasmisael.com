import { contactFormScheme } from "@/utils/contactForm";
import type { ZodError } from "zod";

export async function post({ request }: { request: Request }) {
  const body = await request.json();

  const { name, email, reason, message, lang } = contactFormScheme.parse(body);

  try {
    return new Response(
      JSON.stringify({
        name,
        email,
        reason,
        message,
        lang,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    const error = e as ZodError;
    return new Response(
      JSON.stringify({
        error: error.cause,
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
