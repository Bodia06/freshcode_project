import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { changeProfileViewMode } from '../../store/slices/userProfileSlice';
import { cashOut, clearPaymentStore } from '../../store/slices/paymentSlice';
import UserInfo from '../../components/UserComponents/UserInfo/UserInfo';
import PayForm from '../../components/PaymentComponents/PayForm/PayForm';
import Error from '../../components/Error/Error';
import Spinner from '../../components/Spinner/Spinner';
import CONSTANTS from '../../constants';
import styles from './UserProfile.module.sass';

const UserProfile = () => {
  const dispatch = useDispatch();

  const { data, isFetching } = useSelector((state) => state.userStore);
  const { profileViewMode } = useSelector((state) => state.userProfile);
  const { error } = useSelector((state) => state.payment);

  if (isFetching) return <Spinner />;

  if (!data) return <div className={styles.error}>User data not found</div>;

  const { balance, role } = data;

  const pay = (values) => {
    const { number, expiry, cvc } = values;

    const amountToCashOut = values.sum || balance;

    dispatch(cashOut({ number, expiry, cvc, sum: amountToCashOut }));
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainContainer}>
        <aside className={styles.aside}>
          <div className={styles.headerAside}>Account Options</div>
          <div className={styles.optionsContainer}>
            <div
              className={classNames(styles.optionContainer, {
                [styles.currentOption]:
                  profileViewMode === CONSTANTS.USER_INFO_MODE,
              })}
              onClick={() =>
                dispatch(changeProfileViewMode(CONSTANTS.USER_INFO_MODE))
              }
            >
              User Info
            </div>

            {role === CONSTANTS.CREATOR && (
              <div
                className={classNames(styles.optionContainer, {
                  [styles.currentOption]:
                    profileViewMode === CONSTANTS.CASHOUT_MODE,
                })}
                onClick={() =>
                  dispatch(changeProfileViewMode(CONSTANTS.CASHOUT_MODE))
                }
              >
                Cashout
              </div>
            )}
          </div>
        </aside>
        <main className={styles.contentArea}>
          {profileViewMode === CONSTANTS.USER_INFO_MODE ? (
            <UserInfo />
          ) : (
            <div className={styles.container}>
              {parseFloat(balance) === 0 ? (
                <div className={styles.notMoneyCard}>
                  <span className={styles.notMoney}>
                    There is no money on your balance
                  </span>
                </div>
              ) : (
                <div className={styles.paymentSection}>
                  {error && (
                    <Error
                      data={error.data}
                      status={error.status}
                      clearError={() => dispatch(clearPaymentStore())}
                    />
                  )}
                  <PayForm
                    sendRequest={pay}
                    balance={balance}
                    isPayForOrder={false}
                  />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
