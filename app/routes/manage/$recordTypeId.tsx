import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Form } from '@remix-run/react';

import { prisma } from '~/utils/prisma.server';
import RecordTypeForm from '~/components/RecordTypeForm';
import type { Prisma, RecordSchema } from '@prisma/client';
import { formatDataForRecordTypeSchema, updateRecordTypeWithSchema } from '~/models/recordType.server';
import invariant from 'tiny-invariant';

export const action: ActionFunction = async ({ request, params }) => {
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

export const loader: LoaderFunction = async ({ params }) => {
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

export default function Update() {
  const { recordType } = useLoaderData<{ recordType: Prisma.RecordTypeGetPayload<{include: {schemas: true}}> }>();
  console.log(recordType)

  return (
    <>
      <h2>New entry type</h2>
      <Form method="post">
        <RecordTypeForm
          name={recordType.name}
          schema={recordType.schemas[0]}
        />

        <button type="submit">Save</button>

      </Form>
    </>
  );
}