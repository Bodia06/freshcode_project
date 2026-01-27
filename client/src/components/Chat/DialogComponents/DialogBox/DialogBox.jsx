import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import {
  changeChatFavorite,
  changeChatBlock,
} from '../../../../store/slices/chatSlice';
import CONSTANTS from '../../../../constants';
import styles from './DialogBox.module.sass';

const DialogBox = ({
  chatPreview,
  userId,
  getTimeStr,
  catalogOperation,
  goToExpandedDialog,
  chatMode,
}) => {
  const dispatch = useDispatch();

  const {
    interlocutor,
    favoriteList,
    participants,
    blackList,
    _id,
    text,
    createAt,
  } = chatPreview;

  if (!interlocutor) return null;

  const userIndex = participants.findIndex(
    (id) => Number(id) === Number(userId)
  );

  const isFavorite = userIndex !== -1 ? favoriteList[userIndex] : false;
  const isBlocked = userIndex !== -1 ? blackList[userIndex] : false;

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
    dispatch(
      changeChatFavorite({
        conversationId: _id,
        participants,
        favoriteFlag: !isFavorite,
      })
    );
  };

  const handleBlackListClick = (event) => {
    event.stopPropagation();
    dispatch(
      changeChatBlock({
        conversationId: _id,
        participants,
        blackListFlag: !isBlocked,
      })
    );
  };

  const handleCatalogClick = (event) => {
    event.stopPropagation();
    catalogOperation(event, _id);
  };

  const handleBoxClick = () => {
    goToExpandedDialog({
      interlocutor,
      conversationData: {
        _id,
        participants,
        blackList,
        favoriteList,
      },
    });
  };

  const avatarSrc =
    interlocutor.avatar === 'anon.png'
      ? CONSTANTS.ANONYM_IMAGE_PATH
      : `${CONSTANTS.publicURL}${interlocutor.avatar}`;

  return (
    <div className={styles.previewChatBox} onClick={handleBoxClick}>
      <img src={avatarSrc} alt="user avatar" />

      <div className={styles.infoContainer}>
        <div className={styles.interlocutorInfo}>
          <span className={styles.interlocutorName}>
            {interlocutor.firstName}
          </span>
          <span className={styles.interlocutorMessage}>{text}</span>
        </div>

        <div className={styles.buttonsContainer}>
          <span className={styles.time}>{getTimeStr(createAt)}</span>

          <i
            onClick={handleFavoriteClick}
            className={classNames(isFavorite ? 'fas fa-heart' : 'far fa-heart')}
            title={isFavorite ? 'Remove from favorite' : 'Add to favorite'}
          />

          <i
            onClick={handleBlackListClick}
            className={classNames(
              isBlocked ? 'fas fa-unlock' : 'fas fa-user-lock'
            )}
            title={isBlocked ? 'Unblock user' : 'Block user'}
          />

          <i
            onClick={handleCatalogClick}
            className={classNames({
              'far fa-plus-square':
                chatMode !== CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
              'fas fa-minus-circle':
                chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
            })}
            title={
              chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE
                ? 'Remove from catalog'
                : 'Add to catalog'
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
