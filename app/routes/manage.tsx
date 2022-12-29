import type { LoaderFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { auth } from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  return await auth.isAuthenticated(request, { failureRedirect: '/login' });
};

export default function Manage() {
  return (
    <div>
      <h1>Manage entry types</h1>
      <Outlet />
    </div>
  );
}
