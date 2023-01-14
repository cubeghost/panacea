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
    'form-check': checkbox,
  }, className);

  const isSingleInput = React.Children.count(children) === 1 && children?.type === 'input';
  const input = isSingleInput ? (
    React.cloneElement(children, {
      className: cn({
        'form-control': !checkbox,
        'form-check-input': checkbox,
      })
    })
  ) : children;

  return (
    <div className={classNames}>
      {checkbox ? (
        <>
          {input}
          <label className="form-check-label">{label}</label>
        </>
      ) : (
        <label>
          <span className="formField__label form-label">{label}</span>
          {input}
        </label >
      )}

    </div>
  );
};

export default FormField;