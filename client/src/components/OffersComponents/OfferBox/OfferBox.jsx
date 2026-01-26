import { useSelector, useDispatch } from 'react-redux';
import Rating from 'react-rating';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './confirmStyle.css';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { confirmAlert } from 'react-confirm-alert';
import withRouter from '../../../hocs/withRouter';
import { goToExpandedDialog } from '../../../store/slices/chatSlice';
import {
  changeMark as changeMarkAction,
  clearChangeMarkError,
  changeShowImage,
} from '../../../store/slices/contestByIdSlice';
import CONSTANTS from '../../../constants';
import styles from './OfferBox.module.sass';

const OfferBox = (props) => {
  const dispatch = useDispatch();
  const { id, role } = useSelector((state) => state.userStore.data);
  const { messagesPreview } = useSelector((state) => state.chatStore);

  const { data, contestType, setOfferStatus, needButtons } = props;
  const { avatar, firstName, lastName, email, rating } = data.User;

  const findConversationInfo = () => {
    const participants = [id, data.User.id].sort((a, b) => a - b);
    return (
      messagesPreview.find((p) => isEqual(participants, p.participants)) || null
    );
  };

  const resolveOffer = () => {
    confirmAlert({
      title: 'Confirm',
      message: 'Are you sure you want to accept this offer?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => setOfferStatus(data.User.id, data.id, 'resolve'),
        },
        { label: 'No' },
      ],
    });
  };

  const rejectOffer = () => {
    confirmAlert({
      title: 'Confirm',
      message: 'Are you sure you want to decline this offer?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => setOfferStatus(data.User.id, data.id, 'reject'),
        },
        { label: 'No' },
      ],
    });
  };

  const handleChangeMark = (value) => {
    dispatch(clearChangeMarkError());
    dispatch(
      changeMarkAction({
        mark: value,
        offerId: data.id,
        isFirst: !data.mark,
        creatorId: data.User.id,
      })
    );
  };

  const offerStatus = () => {
    if (data.status === CONSTANTS.OFFER_STATUS_REJECTED) {
      return (
        <i
          className={classNames('fas fa-times-circle reject', styles.reject)}
        />
      );
    }
    if (data.status === CONSTANTS.OFFER_STATUS_WON) {
      return (
        <i
          className={classNames('fas fa-check-circle resolve', styles.resolve)}
        />
      );
    }
    return null;
  };

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
                dispatch(
                  changeShowImage({
                    imagePath: data.fileName,
                    isShowOnFull: true,
                  })
                )
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
                onClick={handleChangeMark}
                placeholderRating={data.mark}
              />
            )}
          </div>
          {role !== CONSTANTS.CREATOR && (
            <i
              onClick={() =>
                dispatch(
                  goToExpandedDialog({
                    interlocutor: data.User,
                    conversationData: findConversationInfo(),
                  })
                )
              }
              className={classNames('fas fa-comments', styles.chatIcon)}
            />
          )}
        </div>
      </div>
      {needButtons(data.status) && (
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

export default withRouter(OfferBox);
