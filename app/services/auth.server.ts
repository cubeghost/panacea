import { Authenticator } from 'remix-auth';
import { EmailLinkStrategy } from 'remix-auth-email-link';
import { prisma } from '~/utils/prisma.server'
import { sessionStorage } from '~/services/session.server';
import { sendMagicLinkEmail } from '~/services/email.server';

import type { User } from '@prisma/client';

// This secret is used to encrypt the token sent in the magic link and the
// session used to validate someone else is not trying to sign-in as another
// user.
const secret = process.env.MAGIC_LINK_SECRET;
if (!secret) throw new Error('Missing MAGIC_LINK_SECRET env variable.')

export const auth = new Authenticator<User>(sessionStorage);

// Here we need the sendEmail, the secret and the URL where the user is sent
// after clicking on the magic link
auth.use(
  new EmailLinkStrategy<User>(
    { sendEmail: sendMagicLinkEmail, secret, callbackURL: '/magic' },
    // In the verify callback you will only receive the email address and you
    // should return the user instance
    async ({ email }: { email: string }) => {
      return await prisma.user.findUnique({
        where: { email },
      });
    }
  )
);
