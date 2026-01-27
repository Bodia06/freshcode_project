import Cards from 'react-credit-cards-2';
import { Form, Formik, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { changeFocusOnCard } from '../../../store/slices/paymentSlice';
import PayInput from '../../InputComponents/PayInput/PayInput';
import Schems from '../../../utils/validators/validationSchems';
import styles from './PayForm.module.sass';

const PayForm = ({ sendRequest, back, isPayForOrder, balance }) => {
  const dispatch = useDispatch();
  const { focusOnElement } = useSelector((state) => state.payment);

  const handleFocusChange = (name) => {
    dispatch(changeFocusOnCard(name));
  };

  const initialValues = {
    name: '',
    number: '',
    cvc: '',
    expiry: '',
    sum: isPayForOrder ? '' : balance,
  };

  return (
    <div className={styles.payFormContainer}>
      <h3 className={styles.headerInfo}>Payment Information</h3>

      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          sendRequest(values);
        }}
        validationSchema={Schems.PaymentSchema}
        enableReinitialize
      >
        {({ values }) => (
          <>
            <div className={styles.cardVisual}>
              <Cards
                number={values.number}
                name={values.name}
                expiry={values.expiry}
                cvc={values.cvc}
                focused={focusOnElement}
              />
            </div>

            <Form id="myForm" className={styles.formContainer}>
              <div className={styles.inputWrapper}>
                <label>Cardholder Name</label>
                <PayInput
                  name="name"
                  type="text"
                  changeFocus={handleFocusChange}
                  classes={styles}
                />
              </div>

              <div className={styles.inputWrapper}>
                <label>Card Number</label>
                <PayInput
                  isInputMask
                  mask="9999 9999 9999 9999"
                  name="number"
                  type="text"
                  changeFocus={handleFocusChange}
                  classes={styles}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.inputWrapper}>
                  <label>Expiry Date</label>
                  <PayInput
                    isInputMask
                    mask="99/99"
                    name="expiry"
                    type="text"
                    changeFocus={handleFocusChange}
                    classes={styles}
                  />
                </div>
                <div className={styles.inputWrapper}>
                  <label>CVC / CVV</label>
                  <PayInput
                    isInputMask
                    mask="999"
                    name="cvc"
                    type="text"
                    changeFocus={handleFocusChange}
                    classes={styles}
                  />
                </div>
              </div>
              <Field type="hidden" name="sum" />
            </Form>
          </>
        )}
      </Formik>

      <div className={styles.footer}>
        <div className={styles.actions}>
          <button form="myForm" className={styles.payButton} type="submit">
            {isPayForOrder ? 'Confirm Payment' : 'Cash Out'}
          </button>
          {isPayForOrder && (
            <button type="button" onClick={back} className={styles.backButton}>
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayForm;
