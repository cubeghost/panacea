import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import type { RecordType } from '@prisma/client';

import { prisma } from '~/utils/prisma.server';
import { auth } from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await auth.isAuthenticated(request, { failureRedirect: '/login' });

  const recordTypes = await prisma.recordType.findMany({
    where: {
      userId: user.id,
    },
    include: {
      schemas: {
        take: 1,
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  return json({ recordTypes });
};

export default function Index() {
  const { recordTypes } = useLoaderData<{ recordTypes: RecordType[] }>();

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