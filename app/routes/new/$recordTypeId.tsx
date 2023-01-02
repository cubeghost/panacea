import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Form } from '@remix-run/react';
import invariant from 'tiny-invariant';
import queryString from 'query-string';

import { prisma } from '~/utils/prisma.server';
import { formatDataForRecordTypeSchema, updateRecordTypeWithSchema } from '~/models/record.server';
import RecordForm from '~/components/RecordForm';

import formStyles from '~/styles/form.css';

export const links = () => ([
  { rel: 'stylesheet', href: formStyles },
]);

export const action = async ({ request, params }: ActionArgs) => {
  invariant(params.recordTypeId, 'recordTypeId is required');
  const recordTypeId = parseInt(params.recordTypeId);

  const data = queryString.parse(await request.text());

  console.log(data)

  return null;
};

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.recordTypeId, 'recordTypeId is required');
  const recordTypeId = parseInt(params.recordTypeId);

  const recordType = await prisma.recordType.findUnique({
    where: {
      id: recordTypeId,
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

  return json({ recordType });
};

export default function NewEntry() {
  const { recordType } = useLoaderData<typeof loader>();
  const schema = recordType?.schemas[0];

  invariant(schema, 'schema is required');

  return (
    <>
      <h2>New {recordType?.name || 'entry'}</h2>
      <Form method="post">
        <RecordForm schema={schema} />
        <button type="submit">Save</button>

      </Form>
    </>
  );
}