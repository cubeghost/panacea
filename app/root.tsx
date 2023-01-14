import { LoaderArgs } from '@remix-run/node';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import cn from 'classnames';

import { auth } from '~/services/auth.server';
import { prisma } from '~/utils/prisma.server';
import { UserContext, UserWithPreferences } from '~/hooks/useAuthedUser';

import styles from '~/styles/compiled/root.css';

export const links = () => ([
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
    return typedjson({ user: user as UserWithPreferences });
  } else {
    return typedjson({ user: null });
  }
};

export default function App() {
  const { user } = useTypedLoaderData<typeof loader>();

  return (
    <html lang="en" data-bs-theme={user?.preferences?.darkMode ? 'dark' : 'light'}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="m-4">
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
