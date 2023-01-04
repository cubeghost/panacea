import { renderToString } from 'react-dom/server';

import type { SendEmailFunction } from 'remix-auth-email-link';

import { sendEmail } from '~/services/sendgrid.server';
import type { TinyUser } from '~/services/auth.server';

export const sendMagicLinkEmail: SendEmailFunction<TinyUser> = async (options) => {
  const subject = 'Here\'s your Magic sign-in link';
  const body = renderToString(
    <p>
      Hi there,<br />
      <br />
      <a href={options.magicLink}>Click here to login to panacea</a>
    </p>
  );

  return await sendEmail({
    to: options.emailAddress,
    subject,
    body,
  });
};
