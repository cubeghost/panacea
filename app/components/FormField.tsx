import React from 'react';
import cn from 'classnames';

interface FormFieldProps {
  checkbox?: boolean;
  children: React.ReactNode;
  className?: string;
  label: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  checkbox,
  children,
  className,
  label,
}) => {
  const classNames = cn('formField', {
    'formField--checkbox': checkbox,
  }, className);
  return (
    <div className={classNames}>
      <label>
        <span className="formField__label">{label}</span>
        {children}
      </label>
    </div>
  );
};

export default FormField;