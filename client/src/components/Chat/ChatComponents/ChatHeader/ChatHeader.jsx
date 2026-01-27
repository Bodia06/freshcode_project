import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  backToDialogList,
  changeChatFavorite,
  changeChatBlock,
} from '../../../../store/slices/chatSlice';
import CONSTANTS from '../../../../constants';
import styles from './ChatHeader.module.sass';

const ChatHeader = ({ userId }) => {
  const dispatch = useDispatch();
  const { interlocutor, chatData } = useSelector((state) => state.chatStore);

  const getStatus = useCallback(
    (list) => {
      if (!chatData || !userId) return false;
      const index = chatData.participants.findIndex(
        (id) => Number(id) === Number(userId)
      );
      return index !== -1 ? list[index] : false;
    },
    [chatData, userId]
  );

  const favoriteFlag = getStatus(chatData?.favoriteList);
  const blackListFlag = getStatus(chatData?.blackList);

  const onFavoriteClick = (event) => {
    event.stopPropagation();
    dispatch(
      changeChatFavorite({
        conversationId: chatData._id,
        participants: chatData.participants,
        favoriteFlag: !favoriteFlag,
      })
    );
  };

  const onBlackListClick = (event) => {
    event.stopPropagation();
    dispatch(
      changeChatBlock({
        conversationId: chatData._id,
        participants: chatData.participants,
        blackListFlag: !blackListFlag,
      })
    );
  };

  if (!interlocutor) return null;

  return (
    <div className={styles.chatHeader}>
      <div
        className={styles.buttonContainer}
        onClick={() => dispatch(backToDialogList())}
      >
        <img
          src={`${CONSTANTS.STATIC_IMAGES_PATH}arrow-left-thick.png`}
          alt="back"
        />
      </div>
      <div className={styles.infoContainer}>
        <div>
          <img
            src={
              interlocutor.avatar === 'anon.png'
                ? CONSTANTS.ANONYM_IMAGE_PATH
                : `${CONSTANTS.publicURL}${interlocutor.avatar}`
            }
            alt="user"
          />
          <span>{interlocutor.firstName}</span>
        </div>
        {chatData && (
          <div>
            <i
              onClick={onFavoriteClick}
              className={classNames({
                'far fa-heart': !favoriteFlag,
                'fas fa-heart': favoriteFlag,
              })}
            />
            <i
              onClick={onBlackListClick}
              className={classNames({
                'fas fa-user-lock': !blackListFlag,
                'fas fa-unlock': blackListFlag,
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
