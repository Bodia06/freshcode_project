import { Link } from 'react-router-dom';
import CONSTANTS from '../../../constants';
import styles from '../Header.module.sass';

const UserProfile = ({ data, logOut, notificationCount }) => {
  return (
    <div className={styles.userInfo}>
      <img
        src={
          data.avatar === 'anon.png'
            ? CONSTANTS.ANONYM_IMAGE_PATH
            : `${CONSTANTS.publicURL}${data.avatar}`
        }
        alt="user"
      />
      <span>{`Hi, ${data.displayName}`}</span>
      <img src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`} alt="menu" />
      <ul>
        <li>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <span>View Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/account" style={{ textDecoration: 'none' }}>
            <span>My Account</span>
          </Link>
        </li>
        {data.role === 'moderator' && (
          <li>
            <Link to="/moderation" style={{ textDecoration: 'none' }}>
              <span>Moderation Panel</span>
            </Link>
          </li>
        )}
        <li>
          <Link to="/events" className={styles.navLink}>
            <span>Events</span>
            {notificationCount > 0 && (
              <span className={styles.badge}>{`NEW ${notificationCount}`}</span>
            )}
          </Link>
        </li>
        <li>
          <Link to="#" style={{ textDecoration: 'none' }}>
            <span>Messages</span>
          </Link>
        </li>
        <li>
          <Link to="#" style={{ textDecoration: 'none' }}>
            <span>Affiliate Dashboard</span>
          </Link>
        </li>
        <li>
          <span onClick={logOut}>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default UserProfile;
