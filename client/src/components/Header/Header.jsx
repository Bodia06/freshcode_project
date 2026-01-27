import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearUserStore, getUser } from '../../store/slices/userSlice';
import withRouter from '../../hocs/withRouter';
import withEventContext from '../../hocs/withEventContext';
import UserProfile from './UserProfile/UserProfile';
import Navigation from './Navigation/Navigation';
import CONSTANTS from '../../constants';
import styles from './Header.module.sass';

const Header = (props) => {
  const { navigate, eventContext } = props;
  const dispatch = useDispatch();

  const { isFetching, data } = useSelector((state) => state.userStore);

  useEffect(() => {
    if (!data) {
      dispatch(getUser());
    }
  }, [data, dispatch]);

  const logOut = () => {
    localStorage.clear();
    dispatch(clearUserStore());
    navigate('/login', { replace: true });
  };

  const renderLoginButtons = () => {
    if (data) {
      return (
        <>
          <UserProfile
            data={data}
            logOut={logOut}
            notificationCount={eventContext.notificationCount}
          />
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}email.png`}
            className={styles.emailIcon}
            alt="email"
          />
        </>
      );
    }
    return (
      <>
        <Link to="/login">
          <span className={styles.btn}>LOGIN</span>
        </Link>
        <Link to="/registration">
          <span className={styles.btn}>SIGN UP</span>
        </Link>
      </>
    );
  };

  if (isFetching) {
    return null;
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.fixedHeader}>
        <span className={styles.info}>
          Squadhelp recognized as one of the Most Innovative Companies by Inc
          Magazine.
        </span>
        <a href="http://www.squadhelp.com/blog/">Read Announcement</a>
      </div>
      <div className={styles.loginSignnUpHeaders}>
        <div className={styles.numberContainer}>
          <img src={`${CONSTANTS.STATIC_IMAGES_PATH}phone.png`} alt="phone" />
          <a href="tel:(877)355-3585">(877) 355-3585</a>
        </div>
        <div className={styles.userButtonsContainer}>
          {renderLoginButtons()}
        </div>
      </div>
      <div className={styles.navContainer}>
        <img
          src={`${CONSTANTS.STATIC_IMAGES_PATH}blue-logo.png`}
          className={styles.logo}
          alt="blue_logo"
          onClick={() => navigate('/')}
        />

        <div className={styles.leftNav}>
          <Navigation isLoggedIn={!!data} />

          {data &&
            data.role !== CONSTANTS.CREATOR &&
            data.role !== CONSTANTS.MODERATOR && (
              <button
                className={styles.startContestBtn}
                onClick={() => navigate('/startContest')}
              >
                START CONTEST
              </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default withRouter(withEventContext(Header));
