import { createStore } from "solid-js/store";
import { useTranslation, type Language } from "@/utils/i18n";
import { contactFormScheme, validReasons, ContactFormError, type ContactForm } from "@/utils/contactForm";
import { ZodError } from "zod";

interface Props {
  lang: Language;
  action: string;
}
const labelClassName = "relative mb-4 block font-semibold";
const baseFormControlClassName =
  "w-full rounded-md border bg-white p-4 shadow focus:outline-none focus:ring dark:bg-slate-600";
const pristineFormControlClasses = "ring-blue-100 border-blue-50 dark:border-slate-800 dark:ring-slate-700";
const errorFormControlClasses = "ring-red-100 border-red-50 dark:border-red-500 dark:ring-red-500";
const inputClassName = `${baseFormControlClassName}`;
const textareaClassName = `${baseFormControlClassName} resize-none scroll-m-6`;
const selectClassName = `${baseFormControlClassName} appearance-none`;
const errorFormMessage = "text-xs text-red-500 dark:text-red-200 mt-1";

interface FormState {
  errors: Record<keyof ContactForm, string>;
  submitting: boolean;
  submitError?: string;
}

const emptyErrors = {
  name: "",
  email: "",
  reason: "",
  message: "",
  lang: "",
} satisfies Record<keyof ContactForm, string>;

export default function ContactForm(props: Props) {
  const t = useTranslation(props.lang);
  const [formState, setFormState] = createStore<FormState>({ errors: emptyErrors, submitting: false });
  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    return void onSubmitForm(event.target as HTMLFormElement);
  };

  const onSubmitForm = async (form: HTMLFormElement) => {
    setFormState({ submitting: true, errors: emptyErrors });
    try {
      const formData = new FormData(form);
      const data = contactFormScheme.parse({
        name: formData.get("name"),
        email: formData.get("email"),
        reason: formData.get("reason"),
        message: formData.get("message"),
        lang: formData.get("lang"),
      });
      const response = await submitContactForm(data, props.action);
      console.log(response);
    } catch (e) {
      if (e instanceof ZodError) setFormState({ errors: new ContactFormError(e).getMessages(t) });
      (form.elements.namedItem((e as ZodError).errors[0].path[0].toString()) as HTMLInputElement).focus();
    } finally {
      setFormState({ submitting: false });
    }
  };

  return (
    <form id="contact-form" onSubmit={handleSubmit} class="container mx-auto space-y-8">
      <input type="hidden" name="lang" value={props.lang} />
      <div class="flex w-full flex-col gap-8 md:flex-row">
        <div class="flex-1">
          <label for="name" class={labelClassName}>
            {t("forms", "name")}
          </label>
          <input
            required
            aria-describedby="name-error"
            id="name"
            name="name"
            type="text"
            class={inputClassName}
            classList={{
              [pristineFormControlClasses]: !formState.errors.name,
              [errorFormControlClasses]: !!formState.errors.name,
            }}
            placeholder="Theodore Evelyn Mosby"
          />
          <p id="name-error" class={errorFormMessage}>
            {formState.errors.name && `${t("ui", "error")}: ${formState.errors.name}`}
          </p>
        </div>
        <div class="flex-1">
          <label for="email" class={labelClassName}>
            {t("forms", "email")}
          </label>
          <input
            required
            aria-describedby="email-error"
            id="email"
            name="email"
            type="email"
            class={inputClassName}
            classList={{
              [pristineFormControlClasses]: !formState.errors.email,
              [errorFormControlClasses]: !!formState.errors.email,
            }}
            placeholder="tmosby@gnb.com"
          />
          <p id="email-error" class={errorFormMessage}>
            {formState.errors.email && `${t("ui", "error")}: ${formState.errors.email}`}
          </p>
        </div>
      </div>
      <div class="block">
        <label for="reason" class={labelClassName}>
          {t("forms", "reason")}
        </label>
        <select
          required
          aria-describedby="reason-error"
          id="reason"
          name="reason"
          class={selectClassName}
          classList={{
            [pristineFormControlClasses]: !formState.errors.reason,
            [errorFormControlClasses]: !!formState.errors.reason,
          }}
        >
          <option value="" disabled selected>
            {t("forms", "reason.default")}
          </option>
          {validReasons.map(reason => (
            <option value={reason}>{t("forms", `reason.${reason}`)}</option>
          ))}
        </select>
        <p id="reason-error" class={errorFormMessage}>
          {formState.errors.reason && `${t("ui", "error")}: ${formState.errors.reason}`}
        </p>
      </div>
      <div class="block">
        <label for="message" class={labelClassName}>
          {t("forms", "message")}
        </label>
        <textarea
          required
          aria-describedby="message-error"
          id="message"
          name="message"
          class={textareaClassName}
          classList={{
            [pristineFormControlClasses]: !formState.errors.message,
            [errorFormControlClasses]: !!formState.errors.message,
          }}
          rows="8"
          placeholder={t("forms", "message.placeholder")}
        ></textarea>
        <p id="message-error" class={errorFormMessage}>
          {formState.errors.message && `${t("ui", "error")}: ${formState.errors.message}`}
        </p>
      </div>
      {formState.submitError && (
        <p class={errorFormMessage}>
          {t("ui", "error")}: {formState.submitError}
        </p>
      )}
      <p class="!mt-2 pl-2 text-xs">{t("forms", "disclaimer")}</p>
      <button
        disabled={formState.submitting}
        type="submit"
        class="block rounded-md bg-blue-200 px-6 py-3 font-semibold shadow transition-colors hover:bg-blue-300/50 active:bg-blue-300 dark:bg-slate-900 dark:hover:bg-slate-800/90 dark:active:bg-slate-800/70"
      >
        {t("forms", formState.submitting ? "submitting" : "submit")}
      </button>
    </form>
  );
}

async function submitContactForm(data: ContactForm, action: string) {
  await new Promise(res => setTimeout(res, 2500));
  const response = await fetch(action, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    console.log("Success!");
    return response.json();
  }

  throw new Error("Network response was not ok.");
}
