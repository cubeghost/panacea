import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { Form, Link, useTransition } from '@remix-run/react';

import { checkAuth } from '~/services/auth.server';
import { prisma } from '~/utils/prisma.server';
import { Preferences, DEFAULT_PREFERENCES } from '~/utils/preferences';
import FormField from '~/components/FormField';
import { useAuthedUser } from '~/hooks/useAuthedUser';

import formStyles from '~/styles/form.css';

export const links = () => ([
  { rel: 'stylesheet', href: formStyles },
]);

export const action = async ({ request }: ActionArgs) => {
  const data = await request.formData();

  const userId = data.get('userId') as string;
  const preferences = Object.keys(Preferences).reduce((acc, key) => {
    return {
      ...acc,
      [key]: data.get(key) ? true : false,
    };
  }, {});

  const user = await prisma.user.update({
    where: {
      id: parseInt(userId),
    },
    data: {
      preferences,
    }
  });

  return user;
};

export const loader = async ({ request }: LoaderArgs) => {
  await checkAuth(request);
  return null;
};

export default function Index() {
  const user = useAuthedUser();
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';

  return (
    <div style={{ maxWidth: '320px' }}>
      hi {user.email} <Link to="/">&larr; back</Link>
      <br />
      <Form method="post">
        <fieldset disabled={isSubmitting}>
          <input type="hidden" name="userId" value={user.id} readOnly />
          {Object.entries(Preferences).map(([key, value]) => {
            const defaultChecked = user.preferences?.[key] || DEFAULT_PREFERENCES[key] || false;
            return (
              <FormField checkbox label={value} key={key}>
                <input type="checkbox" name={key} defaultChecked={defaultChecked} />
              </FormField>
            );
          })}

          <button type="submit">{isSubmitting ? 'Saving...' : 'Save'}</button>
        </fieldset>
      </Form>
    </div>
  );
}
