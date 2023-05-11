import { map } from "rambda";
import { z, type ZodError, type ZodIssue } from "zod";
import { LANGUAGES, type Language, type UseTranslation } from "@/utils/i18n";

export const validReasons = ["hello", "question", "help", "work", "other"] as const;

export const contactFormScheme = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  reason: z.enum(validReasons),
  message: z.string().min(10).max(500),
  lang: z.enum(LANGUAGES),
});

export type ContactForm = z.infer<typeof contactFormScheme>;

export class ContactFormError extends Error {
  errors: Record<string, ZodIssue>;
  zodError: ZodError;

  constructor(errors: ZodError) {
    super("ValidationError");
    this.errors = errors.errors.reduce((prev, e) => ({ ...prev, [e.path[0]]: e }), {});
    this.zodError = errors;
  }

  getMessages<L extends Language>(t: UseTranslation<L>): Record<string, string> {
    return map(e => {
      switch (e.code) {
        case "invalid_string":
          return t("validation", "invalid_email");
        case "too_small":
          return t("validation", e.code, { minimum: e.minimum.toString() });
        case "invalid_enum_value":
          return t("validation", e.code, { received: e.received.toString() });
        case "too_big":
          return t("validation", e.code, { maximum: e.maximum.toString() });
        default:
          return t("validation", "unknown");
      }
    }, this.errors);
  }
}
