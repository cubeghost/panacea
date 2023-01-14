import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import { useTransition, Form } from '@remix-run/react';
import { nanoid } from 'nanoid';
import invariant from 'tiny-invariant';

import { prisma } from '~/utils/prisma.server';
import RecordTypeForm, { links as recordTypeFormLinks } from '~/components/RecordTypeForm';
import { formatDataForRecordTypeSchema, updateRecordTypeWithSchema } from '~/models/recordType.server';

export const links = () => ([
  ...recordTypeFormLinks(),
]);

export const action = async ({ request, params }: ActionArgs) => {
  invariant(params.recordTypeId, 'recordTypeId is required');
  const recordTypeId = parseInt(params.recordTypeId);

  const data = formatDataForRecordTypeSchema(await request.text());
  const { fields, ...recordType } = data;

  await updateRecordTypeWithSchema({
    recordTypeId,
    recordType,
    fields,
  });

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

  if (!recordType) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  recordType.schemas[0].fields?.forEach((field) => {
    field.id = nanoid();
  });

  return typedjson({ recordType });
};

export default function UpdateRecordType() {
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';
  const { recordType } = useTypedLoaderData<typeof loader>();

  return (
    <>
      <h2>Edit entry type</h2>
      <Form method="post">
        <fieldset disabled={isSubmitting}>
          <RecordTypeForm
            name={recordType.name}
            color={recordType.color || undefined}
            schema={recordType.schemas[0]}
          />

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