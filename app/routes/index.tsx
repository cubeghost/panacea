import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { User } from '@prisma/client';

import { auth } from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await auth.isAuthenticated(request, { failureRedirect: '/login' })
  return json({ user });
}

export default function Index() {
  const { user } = useLoaderData<{ user: User }>();
  return (
    <div>
      hi {user.email}
    </div>
  );
}
