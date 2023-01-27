import React, { useReducer } from 'react';
import set from 'lodash/set';
import sample from 'lodash/sample';
import { SerializeFrom } from '@remix-run/node';
import { nanoid } from 'nanoid';
import chroma from 'chroma-js';
import invariant from 'tiny-invariant';

import { Select, CreatableSelect } from '~/components/Select';
import type { Field, RangeAttributes } from '~/utils/fields';
import { FieldTypes } from '~/utils/fields';
import FormField from '~/components/FormField';
import type { RecordSchema } from '@prisma/client';

import styles from '~/styles/compiled/RecordTypeForm.css';
import { useAuthedUser } from '~/hooks/useAuthedUser';

export const links = () => [
  { rel: 'stylesheet', href: styles },
];

interface FieldState extends Omit<Field, 'type'> {
  id: string;
  type?: FieldTypes;
}

interface RecordTypeFormProps {
  name?: string;
  color?: string;
  schema?: RecordSchema;
}

const mapStringOption = (value: string) => ({ value: value, label: value });
const FieldTypeOptions = Object.values(FieldTypes).map(mapStringOption);

enum ActionTypes {
  ADD_FIELD,
  REMOVE_FIELD,
  SET_FIELD_TYPE,
  SET_FIELD_VALUE,
}

interface AddFieldAction {
  type: ActionTypes.ADD_FIELD;
}
interface RemoveFieldAction {
  type: ActionTypes.REMOVE_FIELD;
  payload: {
    index: number;
  };
}
interface SetFieldTypeAction {
  type: ActionTypes.SET_FIELD_TYPE;
  payload: {
    index: number;
    type: FieldTypes;
  };
}
interface SetFieldValueAction {
  type: ActionTypes.SET_FIELD_VALUE;
  payload: {
    index: number;
    key: string;
    value: string | number;
  };
}
type ReducerAction = AddFieldAction | RemoveFieldAction | SetFieldTypeAction | SetFieldValueAction;

const fieldsReducer = (state: FieldState[], action: ReducerAction): FieldState[] => {
  switch (action.type) {
    case ActionTypes.ADD_FIELD:
      return [
        ...state,
        {
          id: nanoid(),
          name: '',
        },
      ];
    case ActionTypes.REMOVE_FIELD: {
      const newState = [...state];
      newState.splice(action.payload.index, 1);
      return newState;
    }
    case ActionTypes.SET_FIELD_TYPE: {
      const newState = [...state];
      set(newState, `[${action.payload.index}].type`, action.payload.type);
      set(newState, `[${action.payload.index}].attributes`, {});
      return newState;
    }
    case ActionTypes.SET_FIELD_VALUE: {
      const newState = [...state];
      set(newState, `[${action.payload.index}].${action.payload.key}`, action.payload.value);
      return newState;
    }
    default:
      return state;
  }
};

const RecordTypeForm: React.FC<RecordTypeFormProps> = ({ name, color, schema }) => {
  const { preferences } = useAuthedUser();
  const { rangeColors } = preferences;

  const [fields, dispatch] = useReducer(
    fieldsReducer,
    (schema?.fields || []) as unknown as FieldState[],
  );

  const addField = () => {
    dispatch({ type: ActionTypes.ADD_FIELD });
  };

  const deleteField = (event: React.MouseEvent<HTMLButtonElement>) => {
    const index = parseInt(event.target.dataset.index);
    dispatch({
      type: ActionTypes.REMOVE_FIELD,
      payload: {
        index,
      },
    });
  };

  const onSelect = (index: number) => value => {
    dispatch({
      type: ActionTypes.SET_FIELD_TYPE,
      payload: {
        index,
        type: value.value,
      },
    });
  };

  const onColorUpdate =
    (index: number, scaleEnd: 'min' | 'max') => (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: ActionTypes.SET_FIELD_VALUE,
        payload: {
          index,
          key: `attributes.${scaleEnd}Color`,
          value: event.target.value,
        },
      });
    };

  const onNumberUpdate =
    (index: number, scaleEnd: 'min' | 'max') => (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: ActionTypes.SET_FIELD_VALUE,
        payload: {
          index,
          key: `attributes.${scaleEnd}`,
          value: parseInt(event.target.value),
        },
      });
    };

  const onRandomize = (index: number) => () => {
    const palette = sample(chroma.brewer);
    invariant(palette, 'palette from chroma.brewer must be present');
    dispatch({
      type: ActionTypes.SET_FIELD_VALUE,
      payload: {
        index,
        key: 'attributes.minColor',
        value: palette[0],
      },
    });
    dispatch({
      type: ActionTypes.SET_FIELD_VALUE,
      payload: {
        index,
        key: 'attributes.maxColor',
        value: palette[palette.length - 1],
      },
    });
  };

  return (
    <>
      <FormField label="Name" name="name">
        <input type="text" defaultValue={name} />
      </FormField>
      <FormField label="Color" name="color">
        <input type="color" defaultValue={color} />
      </FormField>
      <hr />
      {fields.map((field, index) => {
        let colors;
        if (field.type === FieldTypes.Range) {
          const { min, max, minColor, maxColor } = field.attributes as RangeAttributes;
          if (minColor && maxColor) {
            colors = chroma.scale([minColor, maxColor]).colors(max - min + 1);
          }
        }
        return (
          <fieldset key={index} className="schemaField border rounded">
            <div className="schemaField__fields">
              <FormField label="Field name" name={`fields[${index}].name`}>
                <input type="text" defaultValue={field.name} />
              </FormField>
              <FormField label="Field type" name={`fields[${index}].type`}>
                <Select
                  onChange={onSelect(index)}
                  options={FieldTypeOptions}
                  defaultValue={schema && field.type && mapStringOption(field.type)}
                  instanceId={`field-type-${field.id}`}
                />
              </FormField>
              {field.type === FieldTypes.Range && (
                <div className="schemaField__rangeOptions">
                  <div className="schemaField__rangeOptions__inputs">
                    <div className="schemaField__rangeOptions__inputGroup">
                      <label>
                        <span className="label">Minimum</span>
                        <input
                          type="number"
                          name={`fields[${index}].attributes.min`}
                          defaultValue={field.attributes?.min || 1}
                          onChange={onNumberUpdate(index, 'min')}
                        />
                      </label>
                      <input
                        type={rangeColors ? 'color' : 'hidden'}
                        name={`fields[${index}].attributes.minColor`}
                        defaultValue={field.attributes?.minColor}
                        aria-label="Color for minimum end of scale"
                        onChange={onColorUpdate(index, 'min')}
                      />
                    </div>
                    <div className="schemaField__rangeOptions__inputGroup">
                      <label>
                        <span className="label">Maximum</span>
                        <input
                          type="number"
                          name={`fields[${index}].attributes.max`}
                          defaultValue={field.attributes?.max || 10}
                          onChange={onNumberUpdate(index, 'max')}
                        />
                      </label>
                      <input
                        type={rangeColors ? 'color' : 'hidden'}
                        name={`fields[${index}].attributes.maxColor`}
                        defaultValue={field.attributes?.maxColor}
                        aria-label="Color for maximum end of scale"
                        onChange={onColorUpdate(index, 'max')}
                      />
                    </div>
                  </div>
                  {rangeColors && (
                    <>
                      {colors && (
                        <div className="schemaField__rangeOptions__colorScale">
                          {colors.map(color => (
                            <div style={{ backgroundColor: color }} key={color} />
                          ))}
                        </div>
                      )}
                      <button type="button" onClick={onRandomize(index)} className="btn btn-secondary">
                        Randomize colors
                      </button>
                    </>
                  )}
                </div>
              )}
              {field.type === FieldTypes.Options && (
                <FormField label="Options" name={`fields[${index}].attributes.options`}>
                  <CreatableSelect
                    defaultValue={
                      field.attributes?.options && field.attributes?.options.map(mapStringOption)
                    }
                    instanceId={`field-options-${field.id}`}
                  />
                </FormField>
              )}
            </div>
            <div className="schemaField__controls">
              <button
                type="button"
                className="schemaField__deleteButton btn btn-outline-danger"
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
      <button type="button" onClick={addField} className="btn btn-secondary">
        Add field
      </button>
      <hr />
    </>
  );
};

export default RecordTypeForm;
