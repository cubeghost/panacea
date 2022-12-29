import React, { useState } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import set from 'lodash/set';
import { SerializeFrom } from '@remix-run/node';

import type { Field } from '~/utils/fields';
import { FieldTypes } from '~/utils/fields';
import type { RecordSchema } from '@prisma/client';

interface FieldState extends Omit<Field, 'type'> {
  type?: FieldTypes;
}

interface RecordTypeFormProps {
  name?: string;
  schema?: SerializeFrom<RecordSchema>;
}

const mapStringOption = (value: string) => ({ value: value, label: value });
const FieldTypeOptions = Object.values(FieldTypes).map(mapStringOption);

const RecordTypeForm: React.FC<RecordTypeFormProps> = ({
  name,
  schema,
}) => {
  const [ fields, setFields ] = useState<FieldState[]>(schema?.fields || []);

  const addField = () => {
    setFields((prevState) => ([ ...prevState, {
      name: '',
    } ]));
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
      <div className="field">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" defaultValue={name} />
      </div>
      <hr />
      {fields.map((field, index) => {
        return (
          <fieldset key={index}>
            <button type="button" onClick={deleteField} data-index={index}>Delete field</button>
            <div className="field">
              <label>Field name</label>
              <input type="text" name={`fields[${index}].name`} defaultValue={field.name} />
            </div>
            <div className="field">
              <label>Field type</label>
              <Select
                name={`fields[${index}].type`}
                onChange={onSelect(index)}
                options={FieldTypeOptions}
                defaultValue={schema && field.type && mapStringOption(field.type)}
                instanceId={`field-type-${index}`}
              />
            </div>
            {field.type === FieldTypes.Range && (
              <>
                <div className="field">
                  <label>Minimum</label>
                  <input
                    type="number"
                    name={`fields[${index}].attributes.min`}
                    defaultValue={field.attributes?.min}
                  />
                </div>
                <div className="field">
                  <label>Maximum</label>
                  <input
                    type="number"
                    name={`fields[${index}].attributes.max`}
                    defaultValue={field.attributes?.max}
                  />
                </div>
              </>
            )}
            {field.type === FieldTypes.Options && (
              <div className="field">
                <label>Options</label>
                <CreatableSelect
                  isMulti
                  name={`fields[${index}].attributes.options`}
                  defaultValue={field.attributes?.options && field.attributes?.options.map(mapStringOption)}
                  instanceId={`field-options-${index}`}
                />
              </div>
            )}
          </fieldset>
        );
      })}
      <button type="button" onClick={addField}>Add field</button>
    </>
  );
};

export default RecordTypeForm;