import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import { Form, useTransition } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { Prisma } from '@prisma/client';
import { prisma } from '~/utils/prisma.server';
import RecordForm, { links as recordFormStyles } from '~/components/RecordForm';

import formStyles from '~/styles/form.css';

export const links = () => ([
  { rel: 'stylesheet', href: formStyles },
  ...recordFormStyles(),
]);

export const action = async ({ request, params }: ActionArgs) => {
  invariant(params.recordTypeId, 'recordTypeId is required');
  const recordTypeId = parseInt(params.recordTypeId);

  const formData = await request.formData();
  const { userId, schemaId, startsAt, endsAt, ...data } = Object.fromEntries(formData.entries());

  const record = await prisma.record.create({
    data: {
      startsAt: startsAt as string,
      endsAt: endsAt ? endsAt as string : null,
      data: data as Prisma.InputJsonValue,
      typeId: recordTypeId,
      schemaId: parseInt(schemaId as string),
      userId: parseInt(userId as string),
    }
  });

  return redirect(`/manage/${record.id}`);
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

  return typedjson({ recordType });
};

export default function NewEntry() {
  const { recordType } = useTypedLoaderData<typeof loader>();
  const schema = recordType?.schemas[0];
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';

  invariant(schema, 'schema is required');

  return (
    <>
      <h2>New {recordType?.name || 'entry'}</h2>
      <Form method="post">
        <fieldset disabled={isSubmitting}>
          <RecordForm schema={schema} />
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</button>
        </fieldset>
      </Form>
    </>
  );
}