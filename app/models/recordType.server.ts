import queryString from 'query-string';
import set from 'lodash/set';
import isEqual from 'lodash/isEqual';

import { prisma } from '~/utils/prisma.server';
import type { Prisma } from '@prisma/client';
import type { Field } from '~/utils/fields';

interface RecordTypeWithFields extends Prisma.RecordTypeCreateInput {
  fields: Field[]
}

export const formatDataForRecordTypeSchema = (qs: string): RecordTypeWithFields => {
  const parsedQueryString = queryString.parse(qs);
  const data = {} as RecordTypeWithFields;

  for (const key in parsedQueryString) {
    let value: unknown = parsedQueryString[key];

    if (key.includes('attributes.options') && typeof value === 'string') {
      value = [value];
    }
    if (/attributes\.(min|max)$/.test(key) && typeof value === 'string') {
      value = parseInt(value);
    }

    set(data, key, value);
  }

  return data;
};

export const createRecordTypeWithSchema = async ({
  recordType,
  userId,
  fields,
}: {
  recordType: Prisma.RecordTypeCreateInput;
  userId: number;
  fields: Field[];
}) => await prisma.recordType.create({
  data: {
    ...recordType,
    user: {
      connect: {
        id: userId,
      },
    },
    schemas: {
      create: {
        fields: fields as unknown as Prisma.JsonArray,
      }
    }
  }
});

export const updateRecordTypeWithSchema = async ({
  recordTypeId,
  recordType,
  fields,
}: {
  recordTypeId: number;
  recordType: Prisma.RecordTypeUpdateInput;
  fields: Field[];
}) => {
  const latestSchema = await prisma.recordSchema.findFirst({
    where: {
      typeId: recordTypeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (latestSchema && isEqual(latestSchema.fields, fields)) {
    return await prisma.recordType.update({
      where: {
        id: recordTypeId,
      },
      data: {
        ...recordType,
      }
    });
  } else {
    return await prisma.recordType.update({
      where: {
        id: recordTypeId,
      },
      data: {
        ...recordType,
        schemas: {
          create: {
            fields: fields as unknown as Prisma.JsonArray,
          }
        }
      }
    });
  }
};
