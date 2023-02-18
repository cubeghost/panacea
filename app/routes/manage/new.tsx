import { ActionArgs, redirect } from '@netlify/remix-runtime';
import { Form, useTransition } from '@remix-run/react';

import { auth } from '~/services/auth.server';
import RecordTypeForm, { links as recordTypeFormLinks } from '~/components/RecordTypeForm';
import { formatDataForRecordTypeSchema, createRecordTypeWithSchema } from '~/models/recordType.server';

export const links = () => ([
  ...recordTypeFormLinks(),
]);

/*

record
{
  type: Migraine,
  startsAt: now,
  data: {
    painLevel: 7,
    symptoms: ['Neck Pain', 'Light Sensitivity'],
    medication: ['Ubrelvy'],
    notes: '',
  }
}

{
  name: "Migraine",
  schema: {
    painLevel: {
      name: 'Pain level',
      type: 'Range',
      attributes: {
        min: 1,
        max: 10,
        colors: [...]
      }
    },
    symptoms: {
      name: 'Symptoms',
      type: 'Options',
      attributes: {
        options: ['Neck Pain', ...]
      },
    },
    medication: {
      name: 'Medication',
      type: 'Options',
      attributes: {
        options: ['Ubrelvy']
      },
    },
    notes: {
      name: 'Notes',
      type: 'Long text',
    }
  }

}

*/

export const action = async ({ request }: ActionArgs) => {
  const user = await auth.isAuthenticated(request, { failureRedirect: '/login' });

  const data = formatDataForRecordTypeSchema(await request.text());

  const { fields, ...recordType } = data;

  const newRecordType = await createRecordTypeWithSchema({
    recordType,
    userId: user.id,
    fields,
  });

  return redirect(`/manage/${newRecordType.id}`);
};

export default function NewRecordType() {
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';

  return (
    <>
      <h2>New entry type</h2>
      <Form method="post">
        <fieldset disabled={isSubmitting}>
          <RecordTypeForm />

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