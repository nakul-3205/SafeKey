import { transporter } from "../utils/mail/mail.transporter";

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  await transporter.sendMail({
    from: `"SafeKey" <no-reply@safekey.app>`,
    to,
    subject,
    html,
  });
};
