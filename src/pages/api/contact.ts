import { ContactFormError, contactFormScheme } from "@/utils/contactForm";
import type { ZodError } from "zod";

export async function post({ request }: { request: Request }) {
  const body = await request.json();

  const parsedRequest = contactFormScheme.safeParse(body);
  if (parsedRequest.success) {
    // TODO: send email
    return new Response(JSON.stringify(parsedRequest.data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    const errors = new ContactFormError(parsedRequest.error);
    return new Response(JSON.stringify(errors), {
      status: errors.errors.nationality ? 406 : 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
