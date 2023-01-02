import React, { useState } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import set from 'lodash/set';
import { SerializeFrom } from '@remix-run/node';
import { nanoid } from 'nanoid';

import type { Field } from '~/utils/fields';
import { FieldTypes } from '~/utils/fields';
import FormField from '~/components/FormField';
import type { RecordSchema } from '@prisma/client';

import formStyles from '~/styles/form.css';
import styles from '~/styles/RecordTypeForm.css';

export const links = () => ([
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: formStyles },
]);

interface FieldState extends Omit<Field, 'type'> {
  type?: FieldTypes;
}

interface RecordTypeFormProps {
  name?: string;
  color?: string;
  schema?: SerializeFrom<RecordSchema>;
}

const mapStringOption = (value: string) => ({ value: value, label: value });
const FieldTypeOptions = Object.values(FieldTypes).map(mapStringOption);

const RecordTypeForm: React.FC<RecordTypeFormProps> = ({
  name,
  color,
  schema,
}) => {
  const [fields, setFields] = useState<FieldState[]>(schema?.fields || []);

  const addField = () => {
    setFields((prevState) => ([...prevState, {
      id: nanoid(),
      name: '',
    }]));
  };

  const deleteField = (event: React.MouseEvent<HTMLButtonElement>) => {
    const index = parseInt(event.target.dataset.index);
    setFields((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  const onSelect = (index: number) => (value) => {
    setFields((prevState) => {
      const newState = [...prevState];
      set(newState, `[${index}].type`, value.value);
      return newState;
    });
  };

  return (
    <>
      <FormField label="Name">
        <input type="text" name="name" defaultValue={name} />
      </FormField>
      <FormField label="Color">
        <input type="color" name="color" defaultValue={color} />
      </FormField>
      <hr />
      {fields.map((field, index) => {
        return (
          <fieldset key={index} className="schemaField">
            <div className="schemaField__fields">
              <FormField label="Field name">
                <input type="text" name={`fields[${index}].name`} defaultValue={field.name} />
              </FormField>
              <FormField label="Field type">
                <Select
                  name={`fields[${index}].type`}
                  onChange={onSelect(index)}
                  options={FieldTypeOptions}
                  defaultValue={schema && field.type && mapStringOption(field.type)}
                  instanceId={`field-type-${index}`}
                />
              </FormField>
              {field.type === FieldTypes.Range && (
                <>
                  <FormField label="Minimum">
                    <input
                      type="number"
                      name={`fields[${index}].attributes.min`}
                      defaultValue={field.attributes?.min}
                    />
                  </FormField>
                  <FormField label="Maximum">
                    <input
                      type="number"
                      name={`fields[${index}].attributes.max`}
                      defaultValue={field.attributes?.max}
                    />
                  </FormField>
                </>
              )}
              {field.type === FieldTypes.Options && (
                <FormField label="Options">
                  <CreatableSelect
                    isMulti
                    name={`fields[${index}].attributes.options`}
                    defaultValue={field.attributes?.options && field.attributes?.options.map(mapStringOption)}
                    instanceId={`field-options-${index}`}
                  />
                </FormField>
              )}
            </div>
            <div className="schemaField__controls">
              <button
                type="button"
                className="schemaField__deleteButton"
                onClick={deleteField}
                data-index={index}
                aria-label="Delete field"
              >
                x
              </button>
            </div>
          </fieldset>
        );
      })}
      <button type="button" onClick={addField}>Add field</button>
    </>
  );
};

export default RecordTypeForm;