import { useLayoutEffect } from 'react';
import { Field, ErrorMessage } from 'formik';

const SelectInput = ({
  header,
  classes,
  optionsArray,
  valueArray,
  ...props
}) => {
  const {
    form: { setFieldValue },
    meta: { initialValue },
    field,
  } = props;

  const getOptionsArray = () => {
    if (!optionsArray) return null;

    return optionsArray.map((label, index) => {
      const value = valueArray ? valueArray[index] : label;
      const key = `option-${value}-${index}`;

      return (
        <option key={key} value={value}>
          {label}
        </option>
      );
    });
  };

  useLayoutEffect(() => {
    if (optionsArray && initialValue === undefined) {
      setFieldValue(field.name, valueArray ? valueArray[0] : optionsArray[0]);
    }
  }, [optionsArray, initialValue, setFieldValue, field.name, valueArray]);

  return (
    <div className={classes.inputContainer}>
      {header && <span className={classes.inputHeader}>{header}</span>}
      <select {...field} className={classes.selectInput}>
        {getOptionsArray()}
      </select>
    </div>
  );
};

const SelectInputWrapper = ({
  header,
  classes,
  optionsArray,
  valueArray,
  ...rest
}) => (
  <Field {...rest}>
    {(fieldProps) => (
      <>
        <SelectInput
          {...fieldProps}
          header={header}
          classes={classes}
          optionsArray={optionsArray}
          valueArray={valueArray}
        />
        <ErrorMessage
          name={fieldProps.field.name}
          component="span"
          className={classes.warning}
        />
      </>
    )}
  </Field>
);

export default SelectInputWrapper;
