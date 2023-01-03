import React, { useState, useRef } from 'react';
import Select from 'react-select';
import format from 'date-fns/format';

import { RecordSchema } from '@prisma/client';
import FormField from '~/components/FormField';
import type { Field } from '~/utils/fields';

type FieldProps = Omit<Field, 'type'>;

const Range: React.FC<FieldProps> = ({ name, attributes }) => {
  return (
    <input type="range" name={name} min={attributes?.min} max={attributes?.max} />
  );
};

const mapStringOption = (value: string) => ({ value: value, label: value });

const Options: React.FC<FieldProps> = ({ name, attributes }) => {
  return (
    <Select isMulti options={attributes?.options.map(mapStringOption)} name={name} instanceId={name} />
  );
};

const ShortText: React.FC<FieldProps> = ({ name }) => {
  return (
    <input type="text" name={name} />
  );
};

const LongText: React.FC<FieldProps> = ({ name }) => {
  return (
    <textarea name={name} />
  );
};

const FieldComponents = {
  'Range': Range,
  'Options': Options,
  'Short Text': ShortText,
  'Long Text': LongText,
};

interface SchemaWithFields extends Omit<RecordSchema, 'fields'> {
  fields: Field[];
}

interface NewRecordFormProps {
  schema: SchemaWithFields;
}

const RecordForm: React.FC<NewRecordFormProps> = ({ schema }) => {
  const today = useRef(format(Date.now(), 'yyyy-MM-dd'));
  const [includeTime, setIncludeTime] = useState(true); // TODO user preference or RecordType preference

  return (
    <>
      <fieldset>
        <FormField label="Started at">
          <input type="date" defaultValue={today.current} name="startsAt" />
        </FormField>
        <FormField label="Ended at">
          <input type="date" name="endsAt" />
        </FormField>
      </fieldset>
      {schema.fields?.map((field: Field) => {
        const FieldComponent = FieldComponents[field.type];
        return (
          <FormField label={field.name} key={field.name}>
            <FieldComponent name={field.name} attributes={field.attributes} />
          </FormField>
        );
      })}
    </>
  );
};

export default RecordForm;