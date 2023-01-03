import React from 'react';
import cn from 'classnames';

interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
  label: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  children,
  className,
  label,
}) => {

  return (
    <div className={cn('formField', className)}>
      <label>
        <span className="formField__label">{label}</span>
        {children}
      </label>
    </div>
  );
};

export default FormField;