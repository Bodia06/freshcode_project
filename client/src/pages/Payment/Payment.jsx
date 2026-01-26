import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import {
  pay as payAction,
  clearPaymentStore,
} from '../../store/slices/paymentSlice';
import { getFile } from '../../utils/fileCashe';
import PayForm from '../../components/PaymentComponents/PayForm/PayForm';
import Error from '../../components/Error/Error';
import styles from './Payment.module.sass';

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { contests } = useSelector((state) => state.contestCreationStore);
  const { error } = useSelector((state) => state.payment);

  useEffect(() => {
    if (isEmpty(contests)) {
      navigate('/startContest', { replace: true });
    }
  }, [contests, navigate]);

  const handlePay = (values) => {
    const contestArray = [];
    const data = new FormData();

    Object.keys(contests).forEach((key) => {
      const contest = contests[key];
      const fileFromCache = getFile(key);

      if (fileFromCache) {
        data.append('files', fileFromCache);
      }

      const { file, ...contestData } = contest;
      contestArray.push(contestData);
    });

    const { number, expiry, cvc } = values;

    data.append('number', number);
    data.append('expiry', expiry);
    data.append('cvc', cvc);
    data.append('contests', JSON.stringify(contestArray));
    data.append('price', '100');

    dispatch(payAction({ data: { formData: data }, navigate }));
  };

  if (isEmpty(contests)) return null;

  return (
    <main className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <section className={styles.paymentContainer}>
          <h2 className={styles.headerLabel}>Checkout</h2>
          {error && (
            <Error
              data={error.data}
              status={error.status}
              clearError={() => dispatch(clearPaymentStore())}
            />
          )}
          <PayForm
            sendRequest={handlePay}
            back={() => navigate(-1)}
            isPayForOrder
          />
        </section>

        <aside className={styles.orderInfoContainer}>
          <div className={styles.orderCard}>
            <h3 className={styles.orderHeader}>Order Summary</h3>
            <div className={styles.packageInfoContainer}>
              <span className={styles.packageName}>Standard Package</span>
              <span className={styles.packagePrice}>$100.00 USD</span>
            </div>
            <div className={styles.resultPriceContainer}>
              <span>Total:</span>
              <span className={styles.totalPrice}>$100.00 USD</span>
            </div>
            <a href="http://www.google.com" className={styles.promoCode}>
              Have a promo code?
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Payment;
