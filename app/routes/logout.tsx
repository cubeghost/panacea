import type { LoaderArgs } from '@netlify/remix-runtime';

import { auth } from '~/services/auth.server';

export const loader = async ({ request }: LoaderArgs) => {
  return await auth.logout(request, { redirectTo: '/login' });
};