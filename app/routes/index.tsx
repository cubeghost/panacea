import type { LoaderArgs } from '@remix-run/node';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import { Link } from '@remix-run/react';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';

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

  const today = new Date();
  const dateFilter = {
    lte: endOfMonth(today),
    gte: startOfMonth(today),
  };

  const thisMonthRecords = await prisma.record.findMany({
    where: {
      userId: tinyUser.id,
      OR: [
        {
          startsAt: dateFilter,
        },
        {
          endsAt: dateFilter,
        }
      ]
    }
  });

  return typedjson({ recordTypes, records: thisMonthRecords });
};

export default function Index() {
  const { recordTypes, records } = useTypedLoaderData<typeof loader>();
  const user = useAuthedUser();

  return (
    <div style={{ maxWidth: '320px' }}>
      hi {user.email} <Link to="/settings">settings</Link>
      <br />
      <Link to="/manage">Manage</Link>
      <br />
      <div>
        <Calendar records={records} />
      </div>
      <br />
      <div>
        {recordTypes?.map((recordType) => {
          const backgroundColor = recordType.color || '#fff';
          return (
            <Link to={`/entry/new/${recordType.id}`} key={recordType.id}>
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
