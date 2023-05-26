import { ContactFormError, contactFormScheme } from "@/utils/contactForm";
import { getEnv } from "@/utils/env";
import { useTranslation } from "@/utils/i18n";

// TODO: P3 - Would be nice to also add an entry to some service like Airtable or Google Sheets
// So we can have a backup of the data and also be able to do some analytics
export async function post({ request }: { request: Request }) {
  try {
    const { MAILGUN_DOMAIN, MAILGUN_API_KEY, CONTACT_EMAIL } = getEnv();
    try {
      const requestData = await request.json();
      const parsedRequest = contactFormScheme.safeParse(requestData);
      if (parsedRequest.success) {
        const { data } = parsedRequest;
        const t = useTranslation(data.lang);
        const body = new URLSearchParams({
          to: CONTACT_EMAIL,
          subject: `${data.name} wants you for "${t("forms", `reason.${data.reason}`)}"`,
          from: `${data.name} <${data.email}>`,
          text: `${data.message}
----------------
Submitted from "${request.url}" at ${new Date().toLocaleString("es-ES")}.
----------------
          `,
        });
        const auth = Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64");
        console.log(`Sending ${data.name}'s email`);
        const url = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
        const mailResponse = await fetch(url, {
          method: "POST",
          headers: { Authorization: `Basic ${auth}` },
          body,
        });

        if (mailResponse.ok) {
          console.log("Email sent", await mailResponse.json());
          return new Response(JSON.stringify({ success: true }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        }

        console.log("Email not sent", mailResponse.statusText);
        throw new Error("Something went wrong");
      } else {
        throw new ContactFormError(parsedRequest.error);
      }
    } catch (e) {
      if (e instanceof ContactFormError) {
        return new Response(JSON.stringify(e), {
          status: e.errors.nationality ? 406 : 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      console.log(e);
      return new Response(JSON.stringify({ error: e }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    // This is only if the env variables are not set
    console.log(e);
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
