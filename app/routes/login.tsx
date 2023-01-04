import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { Form, useLoaderData, useTransition } from '@remix-run/react';
import { json } from '@remix-run/node'; 

import { auth } from '~/services/auth.server';
import { sessionStorage } from '~/services/session.server';
import FormField from '~/components/FormField';

// shout out https://reactjsexample.com/email-link-strategy-with-remix-auth/

export const loader = async ({ request }: LoaderArgs) => {
  await auth.isAuthenticated(request, { successRedirect: '/' });
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  // This session key `auth:magiclink` is the default one used by the EmailLinkStrategy
  // you can customize it passing a `sessionMagicLinkKey` when creating an
  // instance.
  if (session.has('auth:magiclink')) return json({ magicLinkSent: true });
  return json({ magicLinkSent: false });
};

export const action = async ({ request }: ActionArgs) => {
  // The success redirect is required in this action, this is where the user is
  // going to be redirected after the magic link is sent, note that here the
  // user is not yet authenticated, so you can't send it to a private page.
  await auth.authenticate('email-link', request, {
    successRedirect: '/login',
    // If this is not set, any error will be throw and the ErrorBoundary will be
    // rendered.
    failureRedirect: '/login',
  });
};

export default function Login() {
  const { magicLinkSent } = useLoaderData<{ magicLinkSent: boolean }>();
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';

  return (
    <>
      <h1>Log in to your account.</h1>
      <Form action="/login" method="post">
        <fieldset>
          <FormField label="Email address">
            <input id="email" type="email" name="email" required />
          </FormField>
          <button type="submit">
            {isSubmitting ? 'Sending...' : 'Email a login link'}
          </button>
        </fieldset>
        {magicLinkSent && (
          <p>Link sent!</p>
        )}
      </Form>
    </>
  );
}
