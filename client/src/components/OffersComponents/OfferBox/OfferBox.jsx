import { connect } from 'react-redux';
import Rating from 'react-rating';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './confirmStyle.css';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { confirmAlert } from 'react-confirm-alert';
import withRouter from '../../../hocs/withRouter';
import { goToExpandedDialog } from '../../../store/slices/chatSlice';
import {
  changeMark,
  clearChangeMarkError,
  changeShowImage,
} from '../../../store/slices/contestByIdSlice';
import CONSTANTS from '../../../constants';
import styles from './OfferBox.module.sass';

const OfferBox = (props) => {
  const findConversationInfo = () => {
    const { messagesPreview, id } = props;
    const participants = [id, props.data.User.id];
    participants.sort(
      (participant1, participant2) => participant1 - participant2
    );
    for (let i = 0; i < messagesPreview.length; i++) {
      if (isEqual(participants, messagesPreview[i].participants)) {
        return {
          participants: messagesPreview[i].participants,
          _id: messagesPreview[i]._id,
          blackList: messagesPreview[i].blackList,
          favoriteList: messagesPreview[i].favoriteList,
        };
      }
    }
    return null;
  };

  const resolveOffer = () => {
    confirmAlert({
      title: 'confirm',
      message: 'Are u sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            props.setOfferStatus(props.data.User.id, props.data.id, 'resolve'),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const rejectOffer = () => {
    confirmAlert({
      title: 'confirm',
      message: 'Are u sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            props.setOfferStatus(props.data.User.id, props.data.id, 'reject'),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const changeMark = (value) => {
    props.clearError();
    props.changeMark({
      mark: value,
      offerId: props.data.id,
      isFirst: !props.data.mark,
      creatorId: props.data.User.id,
    });
  };

  const offerStatus = () => {
    const { status } = props.data;
    if (status === CONSTANTS.OFFER_STATUS_REJECTED) {
      return (
        <i
          className={classNames('fas fa-times-circle reject', styles.reject)}
        />
      );
    }
    if (status === CONSTANTS.OFFER_STATUS_WON) {
      return (
        <i
          className={classNames('fas fa-check-circle resolve', styles.resolve)}
        />
      );
    }
    return null;
  };

  const goChat = () => {
    props.goToExpandedDialog({
      interlocutor: props.data.User,
      conversationData: findConversationInfo(),
    });
  };

  const { data, role, id, contestType } = props;
  const { avatar, firstName, lastName, email, rating } = props.data.User;
  return (
    <div className={styles.offerContainer}>
      <div className={styles.mainInfoContainer}>
        <div className={styles.headerRow}>
          <div className={styles.userInfo}>
            <div className={styles.creativeInfoContainer}>
              <img
                src={
                  avatar === 'anon.png'
                    ? CONSTANTS.ANONYM_IMAGE_PATH
                    : `${CONSTANTS.publicURL}${avatar}`
                }
                className={styles.avatar}
                alt="user"
              />
              <div className={styles.nameAndEmail}>
                <span
                  className={styles.name}
                >{`${firstName} ${lastName}`}</span>
                <span className={styles.email}>{email}</span>
              </div>
            </div>

            <div className={styles.creativeRating}>
              <span className={styles.userScoreLabel}>Rating</span>
              <div className={styles.ratingContainer}>
                <Rating
                  initialRating={rating}
                  readonly
                  fractions={2}
                  fullSymbol={
                    <img
                      src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                      alt="star"
                    />
                  }
                  placeholderSymbol={
                    <img
                      src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                      alt="star"
                    />
                  }
                  emptySymbol={
                    <img
                      src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`}
                      alt="star-outline"
                    />
                  }
                />
              </div>
            </div>
          </div>

          <div className={styles.statusBadge}>{offerStatus()}</div>
        </div>
        <div className={styles.responseConainer}>
          {contestType === CONSTANTS.LOGO_CONTEST ? (
            <img
              onClick={() =>
                props.changeShowImage({
                  imagePath: data.fileName,
                  isShowOnFull: true,
                })
              }
              className={styles.responseLogo}
              src={`${CONSTANTS.publicURL}${data.fileName}`}
              alt="logo"
            />
          ) : (
            <span className={styles.response}>{data.text}</span>
          )}
        </div>
        <div className={styles.footerRow}>
          <div className={styles.ratingContainer}>
            {data.User.id !== id && (
              <Rating
                fractions={2}
                fullSymbol={
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                    alt="star"
                  />
                }
                placeholderSymbol={
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                    alt="star"
                  />
                }
                emptySymbol={
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`}
                    alt="star-outline"
                  />
                }
                onClick={changeMark}
                placeholderRating={data.mark}
              />
            )}
          </div>

          {role !== CONSTANTS.CREATOR && (
            <i
              onClick={goChat}
              className={classNames('fas fa-comments', styles.chatIcon)}
            />
          )}
        </div>
      </div>
      {props.needButtons(data.status) && (
        <div className={styles.btnsContainer}>
          <div onClick={resolveOffer} className={styles.resolveBtn}>
            Accept
          </div>
          <div onClick={rejectOffer} className={styles.rejectBtn}>
            Decline
          </div>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  changeMark: (data) => dispatch(changeMark(data)),
  clearError: () => dispatch(clearChangeMarkError()),
  goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
  changeShowImage: (data) => dispatch(changeShowImage(data)),
});

const mapStateToProps = (state) => {
  const { changeMarkError } = state.contestByIdStore;
  const { id, role } = state.userStore.data;
  const { messagesPreview } = state.chatStore;
  return {
    changeMarkError,
    id,
    role,
    messagesPreview,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OfferBox)
);
