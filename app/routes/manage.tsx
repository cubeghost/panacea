import type { LoaderArgs } from '@netlify/remix-runtime';
import { Outlet } from '@remix-run/react';

import { auth } from '~/services/auth.server';

export const loader = async ({ request }: LoaderArgs) => {
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
