import { renderToString } from 'react-dom/server'

import type { User } from '@prisma/client';
import type { SendEmailFunction } from 'remix-auth-email-link'

import { sendEmail } from '~/services/sendgrid.server';

export const sendMagicLinkEmail: SendEmailFunction<User> = async (options) => {
  const subject = "Here's your Magic sign-in link";
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
