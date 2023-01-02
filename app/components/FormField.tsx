import React from 'react';

interface FormFieldProps {
  label: React.ReactNode;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
}) => {

  return (
    <div className="formField">
      <label>
        <span className="formField__label">{label}</span>
        {children}
      </label>
    </div>
  );
};

export default FormField;