import React, { useState, useRef } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import { RecordSchema, Record } from '@prisma/client';
import FormField from '~/components/FormField';
import type { Field } from '~/utils/fields';
import { useAuthedUser } from '~/hooks/useAuthedUser';

import datepickerStyles from 'react-datepicker/dist/react-datepicker.css';

export const links = () => ([
  { rel: 'stylesheet', href: datepickerStyles, id: 'datepicker' },
]);

interface FieldProps<Value> extends Omit<Field, 'type'> {
  value?: Value;
}

const Range: React.FC<FieldProps<number>> = ({ name, attributes, value }) => (
  <input
    type="range"
    className="form-range"
    name={name}
    min={attributes?.min}
    max={attributes?.max}
    defaultValue={value}
  />
);

const mapStringOption = (value: string) => ({ value: value, label: value });

const Options: React.FC<FieldProps<string>> = ({ name, attributes, value }) => (
  <Select
    isMulti
    options={attributes?.options.map(mapStringOption)}
    name={name}
    instanceId={name}
    defaultValue={value && mapStringOption(value as string)}
  />
);

const ShortText: React.FC<FieldProps<string>> = ({ name, value }) => (
  <input type="text" name={name} defaultValue={value} className="form-control" />
);

const LongText: React.FC<FieldProps<string>> = ({ name, value }) => (
  <textarea name={name} defaultValue={value} className="form-control" />
);

const FieldComponents = {
  'Range': Range,
  'Options': Options,
  'Short Text': ShortText,
  'Long Text': LongText,
};

interface SchemaWithFields extends Omit<RecordSchema, 'fields'> {
  fields: Field[];
}

interface RecordFormProps {
  schema: SchemaWithFields;
  record?: Record;
}

const RecordForm: React.FC<RecordFormProps> = ({ schema, record }) => {
  const user = useAuthedUser();
  const now = useRef(new Date());
  const [includeTime, setIncludeTime] = useState(true); // TODO user preference or RecordType preference
  const [startsAt, setStartsAt] = useState<Date | null>(record?.startsAt || now.current);
  const [endsAt, setEndsAt] = useState<Date | null>(record?.endsAt || null);

  return (
    <>
      {!record && (
        <>
          <input type="hidden" name="userId" value={user.id} readOnly />
          <input type="hidden" name="schemaId" value={schema.id} readOnly />
        </>
      )}
      <fieldset>
        <FormField label="Started at">
          <DatePicker
            showTimeSelect={includeTime}
            selected={startsAt}
            onChange={setStartsAt}
            dateFormat="MM/dd/yy h:mm aa"
            className="form-control"
          />
        </FormField>
        <input type="hidden" name="startsAt" value={startsAt?.toISOString()} readOnly />
        <FormField label="Ended at">
          <DatePicker
            showTimeSelect={includeTime}
            selected={endsAt}
            onChange={setEndsAt}
            dateFormat="MM/dd/yy h:mm aa"
            className="form-control"
          />
        </FormField>
        <input type="hidden" name="endsAt" value={endsAt?.toISOString()} readOnly />
      </fieldset>
      {schema.fields?.map((field: Field) => {
        const FieldComponent = FieldComponents[field.type];
        return (
          <FormField label={field.name} name={field.name} key={field.name}>
            <FieldComponent
              name={field.name}
              attributes={field.attributes}
              value={record?.data?.[field.name]}
            />
          </FormField>
        );
      })}
    </>
  );
};

export default RecordForm;