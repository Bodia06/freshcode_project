import { connect } from 'react-redux';
import UpdateUserInfoForm from '../UpdateUserInfoForm/UpdateUserInfoForm';
import { updateUser } from '../../store/slices/userSlice';
import { changeEditModeOnUserProfile } from '../../store/slices/userProfileSlice';
import CONSTANTS from '../../constants';
import styles from './UserInfo.module.sass';

const UserInfo = (props) => {
  const { isEdit, changeEditMode, data } = props;
  const { avatar, firstName, lastName, displayName, email, role, balance } =
    data;

  const updateUserData = (values) => {
    const formData = new FormData();
    formData.append('file', values.file);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('displayName', values.displayName);
    props.updateUser(formData);
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.mainContainer}>
        {isEdit ? (
          <div className={styles.formWrapper}>
            <UpdateUserInfoForm onSubmit={updateUserData} />
          </div>
        ) : (
          <div className={styles.contentLayout}>
            <div className={styles.imageSection}>
              <img
                src={
                  avatar === 'anon.png'
                    ? CONSTANTS.ANONYM_IMAGE_PATH
                    : `${CONSTANTS.publicURL}${avatar}`
                }
                className={styles.avatar}
                alt="user"
              />
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoBlock}>
                <span className={styles.label}>First Name</span>
                <span className={styles.info}>{firstName}</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.label}>Last Name</span>
                <span className={styles.info}>{lastName}</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.label}>Display Name</span>
                <span className={styles.info}>{displayName}</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.label}>Email</span>
                <span className={styles.info}>{email}</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.label}>Role</span>
                <span className={styles.info}>{role}</span>
              </div>
              {role === CONSTANTS.CREATOR && (
                <div className={styles.infoBlock}>
                  <span className={styles.label}>Balance</span>
                  <span className={styles.info}>{`${balance}$`}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button
            onClick={() => changeEditMode(!isEdit)}
            className={styles.buttonEdit}
          >
            {isEdit ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { data } = state.userStore;
  const { isEdit } = state.userProfile;
  return { data, isEdit };
};

const mapDispatchToProps = (dispatch) => ({
  updateUser: (data) => dispatch(updateUser(data)),
  changeEditMode: (data) => dispatch(changeEditModeOnUserProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
