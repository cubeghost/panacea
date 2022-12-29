import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node'; 

import { auth } from '~/services/auth.server';
import { sessionStorage } from '~/services/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  await auth.isAuthenticated(request, { successRedirect: '/' });
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  // This session key `auth:magiclink` is the default one used by the EmailLinkStrategy
  // you can customize it passing a `sessionMagicLinkKey` when creating an
  // instance.
  if (session.has('auth:magiclink')) return json({ magicLinkSent: true });
  return json({ magicLinkSent: false });
};

export const action: ActionFunction = async ({ request }) => {
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
  return (
    <Form action="/login" method="post">
      <h1>Log in to your account.</h1>
      <div>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" name="email" required />
      </div>
      <button>Email a login link</button>
      {magicLinkSent && (
        <p>Link sent!</p>
      )}
    </Form>
  );
}
