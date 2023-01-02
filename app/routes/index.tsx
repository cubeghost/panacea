import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import chroma from 'chroma-js';

import { auth } from '~/services/auth.server';
import { prisma } from '~/utils/prisma.server';
import styles from '~/styles/calendar.css';
import Calendar from '~/components/Calendar';

const WHITE = '#ffffff', BLACK = '#000000';
export const getTextColorForBackground = (backgroundColor: string) => {
  const contrasts = [
    chroma.contrast(backgroundColor, WHITE),
    chroma.contrast(backgroundColor, BLACK)
  ];
  const winnerIndex = contrasts.indexOf(Math.max(...contrasts));
  return [WHITE, BLACK][winnerIndex];
};

export const links = () => ([
  { rel: 'stylesheet', href: styles },
]);

export const loader = async ({ request }: LoaderArgs) => {
  const user = await auth.isAuthenticated(request, { failureRedirect: '/login' });

  const recordTypes = await prisma.recordType.findMany({
    where: {
      userId: user.id,
    },
  });

  return json({ user, recordTypes });
};

export default function Index() {
  const { user, recordTypes } = useLoaderData<typeof loader>();
  return (
    <div style={{ maxWidth: '320px' }}>
      hi {user.email}
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
