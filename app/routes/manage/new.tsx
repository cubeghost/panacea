import { ActionFunction, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import queryString from 'query-string';
import set from 'lodash/set';

import { auth } from '~/services/auth.server';
import { prisma } from '~/utils/prisma.server';
import RecordTypeForm from '~/components/RecordTypeForm';
import { formatDataForRecordTypeSchema } from '~/models/recordType.server';


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

export const action: ActionFunction = async ({ request }) => {
  const user = await auth.isAuthenticated(request, { failureRedirect: '/login' });

  const data = formatDataForRecordTypeSchema(await request.text());

  const { fields, ...rest } = data;
  
  const recordType = await prisma.recordType.create({
    data: {
      ...rest,
      user: {
        connect: {
          id: user.id,
        },
      },
      schemas: {
        create: {
          fields,
        }
      }
    }
  });

  console.log(recordType)

  return redirect(`/manage/${recordType.id}`);
};

export default function New() {

  return (
    <>
      <h2>New entry type</h2>
      <Form method="post">
        <RecordTypeForm

        />
        
        <button type="submit">Save</button>

      </Form>
    </>
  );
}