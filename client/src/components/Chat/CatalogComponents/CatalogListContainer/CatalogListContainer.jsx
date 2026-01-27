import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCatalogList,
  removeChatFromCatalog as removeChatAction,
} from '../../../../store/slices/chatSlice';
import CatalogList from '../CatalogList/CatalogList';
import DialogList from '../../DialogComponents/DialogList/DialogList';
import CONSTANTS from '../../../../constants';

const CatalogListContainer = () => {
  const dispatch = useDispatch();

  const { catalogList, isShowChatsInCatalog, messagesPreview, currentCatalog } =
    useSelector((state) => state.chatStore);

  const userId = useSelector((state) => state.userStore.data.id);

  useEffect(() => {
    dispatch(getCatalogList());
  }, [dispatch]);

  const removeChatFromCatalog = (event, chatId) => {
    event.stopPropagation();
    if (currentCatalog && currentCatalog._id) {
      dispatch(
        removeChatAction({
          chatId,
          catalogId: currentCatalog._id,
        })
      );
    }
  };

  const getDialogsPreview = () => {
    if (!currentCatalog || !currentCatalog.chats || !messagesPreview.length)
      return [];

    const chatsInCatalogIds = currentCatalog.chats.map(Number);

    return messagesPreview.filter((preview) => {
      return chatsInCatalogIds.includes(Number(preview._id));
    });
  };

  return (
    <>
      {isShowChatsInCatalog ? (
        <DialogList
          userId={userId}
          preview={getDialogsPreview()}
          removeChat={removeChatFromCatalog}
          chatMode={CONSTANTS.CATALOG_PREVIEW_CHAT_MODE}
        />
      ) : (
        <CatalogList catalogList={catalogList} />
      )}
    </>
  );
};

export default CatalogListContainer;
