import { json, LoaderArgs } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import cn from 'classnames';

import { auth } from '~/services/auth.server';
import { prisma } from '~/utils/prisma.server';
import { UserContext, UserWithPreferences } from '~/hooks/useAuthedUser';

import sanitize from 'sanitize.css';
import sanitizeForms from 'sanitize.css/forms.css';
import sanitizeType from 'sanitize.css/typography.css';

import styles from '~/styles/global.css';

export const links = () => ([
  { rel: 'stylesheet', href: sanitize },
  { rel: 'stylesheet', href: sanitizeForms },
  { rel: 'stylesheet', href: sanitizeType },
  { rel: 'stylesheet', href: styles },
]);

export const meta = () => ({
  charset: 'utf-8',
  title: 'panacea - health tracker',
  viewport: 'width=device-width,initial-scale=1',
});

export const loader = async ({ request }: LoaderArgs) => {
  const tinyUser = await auth.isAuthenticated(request);
  if (tinyUser) {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: tinyUser.id,
      }
    });
    return json({ user: user as UserWithPreferences });
  } else {
    return json({ user: null });
  }
};

export default function App() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className={cn({ 'dark-mode': user?.preferences?.darkMode })}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <UserContext.Provider value={user}>
          <Outlet />
        </UserContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
