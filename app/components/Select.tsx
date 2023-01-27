import React from 'react';
import { default as ReactSelect, Props, StylesConfig } from 'react-select';
import { default as CreatableReactSelect, CreatableProps } from 'react-select/creatable';

function getSelectStyles(multi: boolean): StylesConfig {
  const multiplicator = multi ? 2 : 1;
  return {
    control: (provided, { isDisabled, isFocused }) => ({
      ...provided,
      backgroundColor: `var(--bs-select${isDisabled ? '-disabled' : ''}-bg)`,
      borderColor: `var(--bs-select${isDisabled ? '-disabled' : (isFocused ? '-focus' : '')}-border-color)`,
      borderWidth: 'var(--bs-select-border-width)',
      lineHeight: 'var(--bs-select-line-height)',
      fontSize: 'var(--bs-select-font-size)',
      fontWeight: 'var(--bs-select-font-weight)',
      minHeight: 'calc((var(--bs-select-line-height) \
                  * var(--bs-select-font-size)) \
                  + (var(--bs-select-padding-y) * 2) \
                  + (var(--bs-select-border-width) * 2))',
      boxShadow: isFocused ? '0 0 0 0.25rem rgba(var(--bs-primary-rgb), 25%)' : '',
      ':hover': {
        borderColor: 'var(--bs-select-focus-border-color)',
      },
    }),
    singleValue: ({ marginLeft, marginRight, ...provided }, { isDisabled }) => ({
      ...provided,
      color: `var(--bs-select${isDisabled ? '-disabled' : ''}-color)`,
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      padding: `calc(var(--bs-select-padding-y) / ${multiplicator}) \
                calc(var(--bs-select-padding-x) / ${multiplicator})`,
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
    }),
    input: ({ margin, paddingTop, paddingBottom, ...provided }, state) => ({
      ...provided,
      color: 'var(--bs-body-color)',
    }),
    option: (provided, state) => ({
      ...provided,
    }),
    menu: ({ marginTop, ...provided }, { isDisabled }) => ({
      ...provided,
      backgroundColor: `var(--bs-select${isDisabled ? '-disabled' : ''}-bg)`,
    }),
    clearIndicator: ({ padding, ...provided }, state) => ({
      ...provided,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: 'var(--bs-select-indicator-padding)'
    }),
    multiValue: (provided, state) => ({
      ...provided,
      borderRadius: 'calc(var(--bs-select-border-radius) / 2)',
      backgroundColor: 'rgba(var(--bs-secondary-bg-rgb), 0.75)',
      margin: 'calc(var(--bs-select-padding-y) / 2) calc(var(--bs-select-padding-x) / 2)',
    }),
    multiValueLabel: ({ padding, paddingLeft, fontSize, ...provided }, state) => ({
      ...provided,
      color: 'var(--bs-text)',
      padding: '0 var(--bs-select-padding-y)',
      whiteSpace: 'normal'
    })
  };
}

function getSelectTheme(theme) {
  return {
    ...theme,
    borderRadius: 'var(--bs-select-border-radius)',
    colors: {
      ...theme.colors,
      primary: 'var(--bs-primary)',
      primary25: 'rgba(var(--bs-primary-rgb), 25%)',
      primary50: 'rgba(var(--bs-primary-rgb), 50%)',
      primary75: 'rgba(var(--bs-primary-rgb), 75%)',
      danger: 'var(--bs-danger)',
    }
  };
}


export const Select: React.FC<Props> = (props) => (
  <ReactSelect
    styles={getSelectStyles(Boolean(props.isMulti))}
    theme={getSelectTheme}
    {...props}
  />
);

export const CreatableSelect: React.FC<CreatableProps> = (props) => (
  <CreatableReactSelect
    isMulti
    styles={getSelectStyles(true)}
    theme={getSelectTheme}
    {...props}
  />
);