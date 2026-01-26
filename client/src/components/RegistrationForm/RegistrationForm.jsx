import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { checkAuth, clearAuth } from '../../store/slices/authSlice';
import FormInput from '../InputComponents/FormInput/FormInput';
import RoleInput from '../InputComponents/RoleInput/RoleInput';
import AgreeTermOfServiceInput from '../InputComponents/AgreeTermOfServiceInput/AgreeTermOfServiceInput';
import Schems from '../../utils/validators/validationSchems';
import Error from '../Error/Error';
import CONSTANTS from '../../constants';
import styles from './RegistrationForm.module.sass';

const RegistrationForm = ({ navigate }) => {
  const dispatch = useDispatch();

  const { error, isFetching } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearAuth());
    };
  }, [dispatch]);

  const handleSubmit = (values) => {
    dispatch(
      checkAuth({
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          displayName: values.displayName,
          email: values.email,
          password: values.password,
          role: values.role,
        },
        navigate,
        authMode: CONSTANTS.AUTH_MODE.REGISTER,
      })
    );
  };

  const formInputClasses = {
    container: styles.inputContainer,
    input: styles.input,
    warning: styles.fieldWarning,
    notValid: styles.notValid,
    valid: styles.valid,
  };

  return (
    <div className={styles.signUpFormContainer}>
      {error && (
        <Error
          data={error.data}
          status={error.status}
          clearError={() => dispatch(clearAuth())}
        />
      )}
      <div className={styles.headerFormContainer}>
        <h2>CREATE AN ACCOUNT</h2>
        <h4>We always keep your name and email address private.</h4>
      </div>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          displayName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: CONSTANTS.CUSTOMER,
          agreeOfTerms: false,
        }}
        onSubmit={handleSubmit}
        validationSchema={Schems.RegistrationSchem}
      >
        <Form style={{ width: '100%' }}>
          <div className={styles.row}>
            <FormInput
              name="firstName"
              classes={formInputClasses}
              type="text"
              label="First name"
            />
            <FormInput
              name="lastName"
              classes={formInputClasses}
              type="text"
              label="Last name"
            />
          </div>

          <div className={styles.row}>
            <FormInput
              name="displayName"
              classes={formInputClasses}
              type="text"
              label="Display Name"
            />
            <FormInput
              name="email"
              classes={formInputClasses}
              type="text"
              label="Email Address"
            />
          </div>

          <div className={styles.row}>
            <FormInput
              name="password"
              classes={formInputClasses}
              type="password"
              label="Password"
            />
            <FormInput
              name="confirmPassword"
              classes={formInputClasses}
              type="password"
              label="Password confirmation"
            />
          </div>

          <div className={styles.choseRoleContainer}>
            <Field
              name="role"
              type="radio"
              value={CONSTANTS.MODERATOR}
              strRole="Join As a Moderator"
              infoRole="I plan to review and approve/reject contest offers to ensure high quality and compliance."
              component={RoleInput}
              id={CONSTANTS.MODERATOR}
            />
            <Field
              name="role"
              type="radio"
              value={CONSTANTS.CUSTOMER}
              strRole="Join As a Buyer"
              infoRole="I am looking for a Name, Logo or Tagline for my business, brand or product."
              component={RoleInput}
              id={CONSTANTS.CUSTOMER}
            />
            <Field
              name="role"
              type="radio"
              value={CONSTANTS.CREATOR}
              strRole="Join As a Creative"
              infoRole="I plan to submit name ideas, Logo designs or sell names in Domain Marketplace."
              component={RoleInput}
              id={CONSTANTS.CREATOR}
            />
          </div>

          <div className={styles.termsOfService}>
            <AgreeTermOfServiceInput
              name="agreeOfTerms"
              classes={{
                container: styles.termsOfService,
                warning: styles.fieldWarning,
              }}
              id="termsOfService"
              type="checkbox"
            />
          </div>

          <button
            type="submit"
            disabled={isFetching}
            className={styles.submitContainer}
          >
            <span className={styles.inscription}>
              {isFetching ? 'Processing...' : 'Create Account'}
            </span>
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default RegistrationForm;
