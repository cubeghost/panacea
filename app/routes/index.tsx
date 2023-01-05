import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { checkAuth } from '~/services/auth.server';
import { prisma } from '~/utils/prisma.server';
import { getTextColorForBackground } from '~/utils/color';
import { useAuthedUser } from '~/hooks/useAuthedUser';

import Calendar from '~/components/Calendar';
import styles from '~/styles/calendar.css';

export const links = () => ([
  { rel: 'stylesheet', href: styles },
]);

export const loader = async ({ request }: LoaderArgs) => {
  const tinyUser = await checkAuth(request);

  const recordTypes = await prisma.recordType.findMany({
    where: {
      userId: tinyUser.id,
    },
  });

  return json({ recordTypes });
};

export default function Index() {
  const { recordTypes } = useLoaderData<typeof loader>();
  const user = useAuthedUser();

  return (
    <div style={{ maxWidth: '320px' }}>
      hi {user.email} <Link to="/settings">settings</Link>
      <br />
      <Link to="/manage">Manage</Link>
      <br />
      <div>
        <Calendar />
      </div>
      <br />
      <div>
        {recordTypes?.map((recordType) => {
          const backgroundColor = recordType.color || '#fff';
          return (
            <Link to={`/new/${recordType.id}`} key={recordType.id}>
              <div style={{
                backgroundColor,
                color: getTextColorForBackground(backgroundColor),
                padding: '1rem',
                textAlign: 'center',
              }}>
                {recordType.name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
