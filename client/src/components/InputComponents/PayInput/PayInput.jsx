import classNames from 'classnames';
import { PatternFormat } from 'react-number-format';
import { useField } from 'formik';

const PayInput = (props) => {
  const { label, changeFocus, classes, isInputMask, mask, type } = props;
  const [field, meta, helpers] = useField(props.name);
  const { touched, error } = meta;
  const { setValue } = helpers;

  const inputClasses = classNames(classes.input, {
    [classes.notValid]: touched && error,
  });

  const handleFocus = () => {
    if (changeFocus) changeFocus(field.name);
  };

  if (field.name === 'sum' || !isInputMask) {
    return (
      <div className={classes.container}>
        <input
          {...field}
          type={type}
          placeholder={label}
          className={inputClasses}
          onFocus={handleFocus}
        />
        {touched && error && <span className={classes.error}>{error}</span>}
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <PatternFormat
        {...field}
        format={mask.replace(/9/g, '#')}
        mask="_"
        allowEmptyFormatting={false}
        placeholder={label}
        className={inputClasses}
        onFocus={handleFocus}
        onValueChange={(values) => {
          setValue(values.formattedValue);
        }}
      />
      {touched && error && <span className={classes.error}>{error}</span>}
    </div>
  );
};

export default PayInput;
