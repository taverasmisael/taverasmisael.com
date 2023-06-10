import { For, Show, createSignal, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { useTranslation, type Language } from "@/utils/i18n";
import { contactFormScheme, validReasons, ContactFormError, type ContactForm } from "@/utils/contactForm";

interface Props {
  lang: Language;
  action: string;
}

const baseFormControlClasses =
  "w-full rounded-md border bg-white p-4 shadow focus:outline-none focus:ring dark:bg-gray-900";
const pristineFormControlClasses = "ring-blue-100 border-blue-50 dark:border-slate-800 dark:ring-slate-700";
const errorFormControlClasses = "ring-red-100 border-red-50 dark:border-red-500 dark:ring-red-500";
const textareaClasses = `${baseFormControlClasses} resize-none scroll-m-6`;
const selectClasses = `${baseFormControlClasses} appearance-none`;
const errorFormMessageClasses = "text-xs text-red-500 dark:text-red-200 mt-1";

interface FormState {
  errors: Record<keyof ContactForm, string>;
  submitting: boolean;
  submitError: boolean;
}

const emptyErrors = {
  name: "",
  email: "",
  reason: "",
  message: "",
  lang: "",
  nationality: "",
} satisfies Record<keyof ContactForm, string>;

const emptyForm = {
  name: "",
  email: "",
  // We need to cast here because we know that the empty string is not a valid reason and we want te select to display the placeholder
  reason: "" as unknown as (typeof validReasons)[number],
  message: "",
};

export default function ContactForm(props: Props) {
  const t = useTranslation(props.lang);
  const [showSuccess, setShowSuccess] = createSignal(false);
  const [formState, setFormState] = createStore<FormState>({
    errors: emptyErrors,
    submitting: false,
    submitError: false,
  });
  const [formData, setFormData] = createStore<ContactForm>({ ...emptyForm, lang: props.lang });
  const showFormMessage = createMemo(() => showSuccess() || formState.submitError);
  const formMessageKey = createMemo(() => (showSuccess() ? "contact.success" : "contact.error"));

  const onChange = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const { name, value } = input;
    setFormData({ [name]: value });
    setFormState(s => ({ ...s, errors: { ...s.errors, [name as keyof ContactFormError]: "" } }));
    setShowSuccess(false);
  };

  const resetForm = (form: HTMLFormElement) => {
    form.reset();
    setFormData({ ...emptyForm, lang: props.lang });
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if ((form.elements.namedItem("nationality") as HTMLInputElement).value !== "") {
      resetForm(form);
      return;
    }
    return void onSubmitForm(form);
  };

  const onSubmitForm = async (form: HTMLFormElement) => {
    setFormState({ submitting: true, errors: emptyErrors, submitError: false });
    setShowSuccess(false);
    try {
      const parsedData = contactFormScheme.safeParse(formData);

      if (!parsedData.success) throw new ContactFormError(parsedData.error);

      await submitContactForm(parsedData.data, props.action);
      resetForm(form);
      setShowSuccess(true);
    } catch (e) {
      if (e instanceof ContactFormError) {
        setFormState({ errors: e.getMessages(t) });
        if (e.errors.nationality) {
          resetForm(form);
        } else {
          (form.elements.namedItem(e.getFirstErrorKey() as string) as HTMLInputElement).focus();
        }
      } else {
        setFormState({ submitError: true });
      }
    } finally {
      setFormState({ submitting: false });
    }
  };

  return (
    <form id="contact-form" onSubmit={handleSubmit} class="container relative mx-auto space-y-8">
      <div class="flex w-full flex-col gap-8 md:flex-row">
        <div class="flex-1">
          <div class="mb-4 flex items-center gap-3">
            <label for="name" class="block font-semibold">
              {t("forms", "name")}
            </label>
            <span id="name-error" class={errorFormMessageClasses}>
              {formState.errors.name && formState.errors.name}
            </span>
          </div>
          <input
            required
            aria-describedby="name-error"
            id="name"
            name="name"
            type="text"
            class={baseFormControlClasses}
            onChange={onChange}
            value={formData.name}
            classList={{
              [pristineFormControlClasses]: !formState.errors.name,
              [errorFormControlClasses]: !!formState.errors.name,
            }}
            placeholder="Theodore Evelyn Mosby"
          />
        </div>
        <div class="flex-1">
          <div class="mb-4 flex items-center gap-3">
            <label for="email" class="block font-semibold">
              {t("forms", "email")}
            </label>
            <span id="email-error" class={errorFormMessageClasses}>
              {formState.errors.email && formState.errors.email}
            </span>
          </div>
          <input
            required
            aria-describedby="email-error"
            id="email"
            name="email"
            type="email"
            onChange={onChange}
            value={formData.email}
            class={baseFormControlClasses}
            classList={{
              [pristineFormControlClasses]: !formState.errors.email,
              [errorFormControlClasses]: !!formState.errors.email,
            }}
            placeholder="tmosby@gnb.com"
          />
        </div>
      </div>
      <div class="block">
        <div class="mb-4 flex items-center gap-3">
          <label for="reason" class="block font-semibold">
            {t("forms", "reason")}
          </label>
          <span id="reason-error" class={errorFormMessageClasses}>
            {formState.errors.reason && formState.errors.reason}
          </span>
        </div>
        <select
          required
          aria-describedby="reason-error"
          id="reason"
          name="reason"
          onChange={onChange}
          value={formData.reason}
          class={selectClasses}
          style={{
            "background-image": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'%3E%3Cpath stroke='%239ea4b0' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 6l4 4 4-4'/%3E%3C/svg%3E")`,
            "background-repeat": "no-repeat",
            "background-position": "right 1rem center",
          }}
          classList={{
            [pristineFormControlClasses]: !formState.errors.reason,
            [errorFormControlClasses]: !!formState.errors.reason,
          }}
        >
          <option value="" disabled selected>
            {t("forms", "reason.default")}
          </option>
          <For each={validReasons}>{reason => <option value={reason}>{t("forms", `reason.${reason}`)}</option>}</For>
        </select>
      </div>
      <div class="block">
        <div class="mb-4 flex items-center gap-3">
          <label for="message" class="block font-semibold">
            {t("forms", "message")}
          </label>
          <span id="message-error" class={errorFormMessageClasses}>
            {formState.errors.message && formState.errors.message}
          </span>
        </div>
        <textarea
          required
          aria-describedby="message-error"
          id="message"
          name="message"
          onChange={onChange}
          value={formData.message}
          class={textareaClasses}
          classList={{
            [pristineFormControlClasses]: !formState.errors.message,
            [errorFormControlClasses]: !!formState.errors.message,
          }}
          rows="8"
          placeholder={t("forms", "message.placeholder")}
        ></textarea>
      </div>
      <p class="!mt-2 pl-2 text-xs">{t("forms", "disclaimer")}</p>
      <div class="flex items-center gap-4">
        <button
          disabled={formState.submitting}
          type="submit"
          class="block rounded-md bg-blue-200 px-6 py-3 font-semibold shadow transition-colors focus:bg-blue-200/80 focus:outline-none focus:ring focus:ring-blue-200 enabled:hover:bg-blue-200/80 enabled:active:bg-blue-300/50 disabled:cursor-not-allowed disabled:opacity-80 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-700 dark:focus:ring-slate-600 enabled:dark:hover:bg-slate-800/80 enabled:dark:active:bg-slate-700"
        >
          {t("forms", formState.submitting ? "submitting" : "submit")}
        </button>
        <div
          aria-live="polite"
          class="text-sm"
          classList={{
            "text-blue-950 dark:text-blue-100": showSuccess(),
            "text-red-500 dark:text-red-200": formState.submitError,
          }}
        >
          <Show when={showFormMessage()}>
            <p>{t("forms", formMessageKey())}</p>
          </Show>
        </div>
      </div>
      <input
        type="text"
        name="nationality"
        onChange={onChange}
        aria-label="SUPER IMPORTANT"
        class="hidden"
        autocomplete="false"
        tabIndex={-1}
      />
    </form>
  );
}

async function submitContactForm(data: ContactForm, action: string) {
  const response = await fetch(action, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();

  if (response.ok) return result;

  // This means the formData was invalid (400) or the honeypot was filled (406)
  if (response.status === 400 || response.status === 406) {
    throw new ContactFormError((result as ContactFormError).zodError);
  }

  // I just throw a generic error here, the backend should handle theses cases
  // And we don't want the client to know what went wrong
  throw new Error("Something went wrong");
}
