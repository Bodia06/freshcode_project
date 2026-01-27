import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  goToExpandedDialog as goToDialogAction,
  changeChatFavorite as changeFavoriteAction,
  changeChatBlock as changeBlockAction,
  changeShowAddChatToCatalogMenu as showCatalogMenuAction,
} from '../../../../store/slices/chatSlice';
import DialogBox from '../DialogBox/DialogBox';
import CONSTANTS from '../../../../constants';
import styles from './DialogList.module.sass';

const DialogList = ({
  removeChat,
  preview: propsPreview,
  chatMode: propsChatMode,
  userId: propsUserId,
}) => {
  const dispatch = useDispatch();

  const {
    messagesPreview: reduxPreview = [],
    chatMode: reduxChatMode,
    userId: chatStoreUserId,
  } = useSelector((state) => state.chatStore || {});

  const authUserId = useSelector((state) => state.userStore?.data?.id);

  const preview = propsPreview || reduxPreview;
  const chatMode = propsChatMode || reduxChatMode;
  const userId = propsUserId || chatStoreUserId || authUserId;

  const changeFavorite = useCallback(
    (data, event) => {
      event.stopPropagation();
      dispatch(changeFavoriteAction(data));
    },
    [dispatch]
  );

  const changeBlackList = useCallback(
    (data, event) => {
      event.stopPropagation();
      dispatch(changeBlockAction(data));
    },
    [dispatch]
  );

  const changeShowCatalogCreation = useCallback(
    (event, chatId) => {
      event.stopPropagation();
      dispatch(showCatalogMenuAction(chatId));
    },
    [dispatch]
  );

  const goToExpandedDialog = useCallback(
    (data) => {
      dispatch(goToDialogAction(data));
    },
    [dispatch]
  );

  const getTimeStr = useCallback((time) => {
    const mTime = moment(time);
    const currentTime = moment();
    if (currentTime.isSame(mTime, 'day')) return mTime.format('HH:mm');
    if (currentTime.isSame(mTime, 'week')) return mTime.format('dddd');
    if (currentTime.isSame(mTime, 'year')) return mTime.format('MM DD');
    return mTime.format('MMMM DD, YYYY');
  }, []);

  const filteredPreview = useMemo(() => {
    if (!Array.isArray(preview)) return [];

    return preview.filter((chatPreview) => {
      if (!chatPreview?.participants) return false;

      const userIndex = chatPreview.participants.findIndex(
        (id) => Number(id) === Number(userId)
      );

      if (userIndex === -1) return false;

      if (chatMode === CONSTANTS.FAVORITE_PREVIEW_CHAT_MODE) {
        return chatPreview.favoriteList?.[userIndex];
      }
      if (chatMode === CONSTANTS.BLOCKED_PREVIEW_CHAT_MODE) {
        return chatPreview.blackList?.[userIndex];
      }

      return true;
    });
  }, [preview, chatMode, userId]);

  const renderContent = () => {
    if (!filteredPreview.length) {
      return <span className={styles.notFound}>Not found</span>;
    }

    return filteredPreview.map((chatPreview, index) => (
      <DialogBox
        key={chatPreview._id || `preview-${index}`}
        interlocutor={chatPreview.interlocutor}
        chatPreview={chatPreview}
        userId={userId}
        getTimeStr={getTimeStr}
        changeFavorite={changeFavorite}
        changeBlackList={changeBlackList}
        chatMode={chatMode}
        catalogOperation={
          chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE
            ? removeChat
            : changeShowCatalogCreation
        }
        goToExpandedDialog={goToExpandedDialog}
      />
    ));
  };

  return <div className={styles.previewContainer}>{renderContent()}</div>;
};

export default DialogList;
