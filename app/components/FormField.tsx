import React from 'react';
import cn from 'classnames';

interface FormFieldProps {
  checkbox?: boolean;
  children: React.ReactElement;
  className?: string;
  label: React.ReactNode;
  name?: string;
}

const SIMPLE_INPUT_TAGS = ['input', 'textarea'];

const FormField: React.FC<FormFieldProps> = ({
  checkbox,
  children,
  className,
  label,
  name,
}) => {
  const classNames = cn('my-1', {
    'formField--checkbox': checkbox,
    'form-check': checkbox,
  }, className);

  const isSingleInput = React.isValidElement(children) && React.Children.count(children) === 1;
  const isSimpleInput = typeof children?.type === 'string' && SIMPLE_INPUT_TAGS.includes(children?.type);
  const input = isSingleInput ? (
    React.cloneElement(children as React.ReactElement, {
      name,
      id: checkbox ? name : undefined,
      className: cn(children?.props?.className, {
        'form-control': isSimpleInput && !checkbox,
        'form-check-input': isSimpleInput && checkbox,
      })
    })
  ) : children;

  return (
    <div className={classNames}>
      {checkbox ? (
        <>
          {input}
          <label className="form-check-label" htmlFor={name}>{label}</label>
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