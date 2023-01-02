import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import sanitize from 'sanitize.css';
import sanitizeForms from 'sanitize.css/forms.css';
import sanitizeType from 'sanitize.css/typography.css';

import styles from '~/styles/global.css';

export const links: LinksFunction = () => ([
  { rel: 'stylesheet', href: sanitize },
  { rel: 'stylesheet', href: sanitizeForms },
  { rel: 'stylesheet', href: sanitizeType },
  { rel: 'stylesheet', href: styles },
]);

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'panacea - health tracker',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
