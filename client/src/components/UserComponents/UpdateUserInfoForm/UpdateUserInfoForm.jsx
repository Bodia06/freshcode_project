import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserError } from '../../../store/slices/userSlice';
import ImageUpload from '../../InputComponents/ImageUpload/ImageUpload';
import FormInput from '../../InputComponents/FormInput/FormInput';
import Schems from '../../../utils/validators/validationSchems';
import Error from '../../Error/Error';
import styles from './UpdateUserInfoForm.module.sass';

const UpdateUserInfoForm = ({ onSubmit }) => {
  const dispatch = useDispatch();

  const { data, error, isFetching } = useSelector((state) => state.userStore);

  const initialValues = {
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    displayName: data?.displayName || '',
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={Schems.UpdateUserSchema}
      enableReinitialize
    >
      <Form className={styles.updateContainer}>
        {error && (
          <Error
            data={error.data}
            status={error.status}
            clearError={() => dispatch(clearUserError())}
          />
        )}

        <div className={styles.inputsWrapper}>
          <div className={styles.container}>
            <span className={styles.label}>First Name</span>
            <FormInput
              name="firstName"
              type="text"
              classes={{
                container: styles.inputContainer,
                input: styles.input,
                warning: styles.error,
                notValid: styles.notValid,
              }}
            />
          </div>

          <div className={styles.container}>
            <span className={styles.label}>Last Name</span>
            <FormInput
              name="lastName"
              type="text"
              classes={{
                container: styles.inputContainer,
                input: styles.input,
                warning: styles.error,
                notValid: styles.notValid,
              }}
            />
          </div>

          <div className={styles.container}>
            <span className={styles.label}>Display Name</span>
            <FormInput
              name="displayName"
              type="text"
              classes={{
                container: styles.inputContainer,
                input: styles.input,
                warning: styles.error,
                notValid: styles.notValid,
              }}
            />
          </div>
        </div>

        <div className={styles.imageSection}>
          <span className={styles.label}>Profile Picture</span>
          <ImageUpload
            name="file"
            classes={{
              uploadContainer: styles.imageUploadContainer,
              inputContainer: styles.uploadInputContainer,
              imgStyle: styles.imgStyle,
            }}
          />
        </div>

        <button
          className={styles.submitBtn}
          type="submit"
          disabled={isFetching}
        >
          {isFetching ? 'Updating...' : 'Save Changes'}
        </button>
      </Form>
    </Formik>
  );
};

export default UpdateUserInfoForm;
