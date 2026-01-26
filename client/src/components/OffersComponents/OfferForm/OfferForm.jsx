import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import {
  addOffer,
  clearAddOfferError,
} from '../../../store/slices/contestByIdSlice';
import Error from '../../Error/Error';
import ImageUpload from '../../InputComponents/ImageUpload/ImageUpload';
import FormInput from '../../InputComponents/FormInput/FormInput';
import Schems from '../../../utils/validators/validationSchems';
import CONTANTS from '../../../constants';
import styles from './OfferForm.module.sass';

const OfferForm = ({ contestType, contestId, customerId, valid }) => {
  const dispatch = useDispatch();

  const { addOfferError } = useSelector((state) => state.contestByIdStore);

  const handleSubmit = (values, { resetForm }) => {
    dispatch(clearAddOfferError());

    const formData = new FormData();
    formData.append('contestId', contestId);
    formData.append('contestType', contestType);
    formData.append('customerId', customerId);
    formData.append('offerData', values.offerData);

    dispatch(addOffer(formData));

    resetForm();
  };

  const validationSchema =
    contestType === CONTANTS.LOGO_CONTEST
      ? Schems.LogoOfferSchema
      : Schems.TextOfferSchema;

  return (
    <div className={styles.offerContainer}>
      {addOfferError && (
        <Error
          data={addOfferError.data}
          status={addOfferError.status}
          clearError={() => dispatch(clearAddOfferError())}
        />
      )}

      <Formik
        initialValues={{ offerData: '' }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {() => (
          <Form className={styles.form}>
            {contestType === CONTANTS.LOGO_CONTEST ? (
              <ImageUpload
                name="offerData"
                classes={{
                  uploadContainer: styles.imageUploadContainer,
                  inputContainer: styles.uploadInputContainer,
                  imgStyle: styles.imgStyle,
                }}
              />
            ) : (
              <FormInput
                name="offerData"
                classes={{
                  container: styles.inputContainer,
                  input: styles.input,
                  warning: styles.fieldWarning,
                  notValid: styles.notValid,
                }}
                type="text"
                label="your suggestion"
              />
            )}

            {valid && (
              <button type="submit" className={styles.btnOffer}>
                Send Offer
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OfferForm;
