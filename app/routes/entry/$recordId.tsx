import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import { Form, useTransition } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { Prisma } from '@prisma/client';
import { prisma } from '~/utils/prisma.server';
import RecordForm, { links as recordFormStyles } from '~/components/RecordForm';

export const links = () => ([
  ...recordFormStyles(),
]);

export const action = async ({ request, params }: ActionArgs) => {
  invariant(params.recordId, 'recordId is required');
  const recordId = parseInt(params.recordId);

  const formData = await request.formData();
  const { startsAt, endsAt, ...data } = Object.fromEntries(formData.entries());

  const record = await prisma.record.update({
    where: {
      id: recordId,
    },
    data: {
      startsAt: startsAt as string,
      endsAt: endsAt ? endsAt as string : null,
      data: data as Prisma.InputJsonValue,
    }
  });

  console.log(record);

  return null;
};

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.recordId, 'recordId is required');
  const recordId = parseInt(params.recordId);

  const record = await prisma.record.findUnique({
    where: {
      id: recordId,
    },
    include: {
      type: true,
      schema: true
    }
  });

  if (!record) {
    throw new Response('Record not found', {
      status: 404,
    });
  }

  return typedjson({ record });
};


export default function EditEntry() {
  const { record } = useTypedLoaderData<typeof loader>();
  const recordType = record?.type;
  const schema = record?.schema;
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';

  invariant(schema, 'schema is required');

  return (
    <>
      <h2>{recordType?.name || 'entry'}</h2>
      <Form method="post">
        <fieldset disabled={isSubmitting}>
          <RecordForm schema={schema} record={record} />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </fieldset>
      </Form>
    </>
  );
}