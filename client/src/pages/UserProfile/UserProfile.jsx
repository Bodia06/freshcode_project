import { connect } from 'react-redux';
import classNames from 'classnames';
import { changeProfileViewMode } from '../../store/slices/userProfileSlice';
import { cashOut, clearPaymentStore } from '../../store/slices/paymentSlice';
import UserInfo from '../../components/UserComponents/UserInfo/UserInfo';
import PayForm from '../../components/PaymentComponents/PayForm/PayForm';
import Error from '../../components/Error/Error';
import Spinner from '../../components/Spinner/Spinner';
import CONSTANTS from '../../constants';
import styles from './UserProfile.module.sass';

const UserProfile = (props) => {
  if (props.isFetching) return <Spinner />;
  if (!props.data)
    return <div className={styles.error}>User data not found</div>;

  const { balance, role } = props.data;
  const { profileViewMode, changeProfileViewMode, error, clearPaymentStore } =
    props;

  const pay = (values) => {
    const { number, expiry, cvc, sum } = values;
    props.cashOut({ number, expiry, cvc, sum });
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
              onClick={() => changeProfileViewMode(CONSTANTS.USER_INFO_MODE)}
            >
              User Info
            </div>

            {role === CONSTANTS.CREATOR && (
              <div
                className={classNames(styles.optionContainer, {
                  [styles.currentOption]:
                    profileViewMode === CONSTANTS.CASHOUT_MODE,
                })}
                onClick={() => changeProfileViewMode(CONSTANTS.CASHOUT_MODE)}
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
                      clearError={clearPaymentStore}
                    />
                  )}
                  <PayForm sendRequest={pay} />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  data: state.userStore.data,
  isFetching: state.userStore.isFetching,
  profileViewMode: state.userProfile.profileViewMode,
  error: state.payment.error,
});

const mapDispatchToProps = (dispatch) => ({
  cashOut: (data) => dispatch(cashOut(data)),
  changeProfileViewMode: (data) => dispatch(changeProfileViewMode(data)),
  clearPaymentStore: () => dispatch(clearPaymentStore()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
