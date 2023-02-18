import type { LoaderArgs } from '@netlify/remix-runtime';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import { Link } from '@remix-run/react';
import type { RecordType } from '!@prisma/client';

import { prisma } from '~/utils/prisma.server';
import { auth } from '~/services/auth.server';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await auth.isAuthenticated(request, { failureRedirect: '/login' });

  const recordTypes = await prisma.recordType.findMany({
    where: {
      userId: user.id,
    },
  });

  return typedjson({ recordTypes });
};

export default function Index() {
  const { recordTypes } = useTypedLoaderData<{ recordTypes: RecordType[] }>();

  return (
    <div>
      <Link to="/manage/new">Add new</Link>
      <br />
      {recordTypes.length} types
      <br />
      <ul>
        {recordTypes.map((recordType) => (
          <li key={recordType.id}>
            <Link to={`/manage/${recordType.id}`}>{recordType.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}