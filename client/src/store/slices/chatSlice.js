import { createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';
import * as restController from '../../api/rest/restController';
import {
  decorateAsyncThunk,
  createExtraReducers,
  rejectedReducer,
} from '../../utils/store';
import CONSTANTS from '../../constants';

const CHAT_SLICE_NAME = 'chat';

const findPreviewIndex = (messagesPreview, participants) => {
  return messagesPreview.findIndex(preview => {
    return (
      preview.participants.length === participants.length &&
      preview.participants.every(id =>
        participants.map(Number).includes(Number(id))
      )
    );
  });
};

const initialState = {
  isFetching: true,
  addChatId: null,
  isShowCatalogCreation: false,
  currentCatalog: null,
  chatData: null,
  messages: [],
  error: null,
  isExpanded: false,
  interlocutor: [],
  messagesPreview: [],
  isShow: false,
  chatMode: CONSTANTS.NORMAL_PREVIEW_CHAT_MODE,
  catalogList: [],
  isRenameCatalog: false,
  isShowChatsInCatalog: false,
  catalogCreationMode: CONSTANTS.ADD_CHAT_TO_OLD_CATALOG,
};

export const getPreviewChat = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/getPreviewChat`,
  thunk: async () => {
    const { data } = await restController.getPreviewChat();
    return data;
  },
});

const getPreviewChatExtraReducers = createExtraReducers({
  thunk: getPreviewChat,
  fulfilledReducer: (state, { payload }) => {
    state.messagesPreview = payload;
    state.error = null;
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
    state.messagesPreview = [];
  },
});

export const getDialogMessages = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/getDialogMessages`,
  thunk: async payload => {
    const { data } = await restController.getDialog(payload);
    return data;
  },
});

const getDialogMessagesExtraReducers = createExtraReducers({
  thunk: getDialogMessages,
  fulfilledReducer: (state, { payload }) => {
    state.messages = payload.messages;
    state.interlocutor = payload.interlocutor;
    state.chatData = payload.chatData;
  },
  rejectedReducer: (state, { payload }) => {
    state.messages = [];
    state.interlocutor = null;
    state.error = payload;
  },
});

export const sendMessage = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/sendMessage`,
  thunk: async payload => {
    const { data } = await restController.newMessage(payload);
    return data;
  },
});

const sendMessageExtraReducers = createExtraReducers({
  thunk: sendMessage,
  fulfilledReducer: (state, { payload }) => {
    const { message, preview: newPreview } = payload;
    const index = findPreviewIndex(
      state.messagesPreview,
      newPreview.participants
    );

    if (index !== -1) {
      const updatedPreview = {
        ...state.messagesPreview[index],
        text: message.body,
        sender: message.senderId,
        createAt: message.createdAt,
        _id: newPreview._id,
      };
      state.messagesPreview.splice(index, 1);
      state.messagesPreview.unshift(updatedPreview);
    } else {
      state.messagesPreview.unshift(newPreview);
    }

    state.chatData = {
      _id: newPreview._id,
      participants: newPreview.participants,
      favoriteList: newPreview.favoriteList,
      blackList: newPreview.blackList,
    };
    state.messages = [...state.messages, message];
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

export const changeChatFavorite = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/changeChatFavorite`,
  thunk: async payload => {
    const { data } = await restController.changeChatFavorite(payload);
    return data;
  },
});

const changeChatFavoriteExtraReducers = createExtraReducers({
  thunk: changeChatFavorite,
  fulfilledReducer: (state, { payload }) => {
    const index = findPreviewIndex(state.messagesPreview, payload.participants);
    if (index !== -1) {
      state.messagesPreview[index].favoriteList = payload.favoriteList;
    }
    state.chatData = payload;
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

export const changeChatBlock = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/changeChatBlock`,
  thunk: async payload => {
    const { data } = await restController.changeChatBlock(payload);
    return data;
  },
});

const changeChatBlockExtraReducers = createExtraReducers({
  thunk: changeChatBlock,
  fulfilledReducer: (state, { payload }) => {
    const index = findPreviewIndex(state.messagesPreview, payload.participants);
    if (index !== -1) {
      state.messagesPreview[index].blackList = payload.blackList;
    }
    state.chatData = payload;
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

export const getCatalogList = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/getCatalogList`,
  thunk: async payload => {
    const { data } = await restController.getCatalogList(payload);
    return data;
  },
});

const getCatalogListExtraReducers = createExtraReducers({
  thunk: getCatalogList,
  fulfilledReducer: (state, { payload }) => {
    state.isFetching = false;
    state.catalogList = [...payload];
  },
  rejectedReducer,
});

export const addChatToCatalog = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/addChatToCatalog`,
  thunk: async payload => {
    const { data } = await restController.addChatToCatalog(payload);
    return data;
  },
});

const addChatToCatalogExtraReducers = createExtraReducers({
  thunk: addChatToCatalog,
  fulfilledReducer: (state, { payload }) => {
    const { catalogList } = state;
    for (let i = 0; i < catalogList.length; i++) {
      if (catalogList[i]._id === payload._id) {
        catalogList[i].chats = payload.chats;
        break;
      }
    }
    state.isShowCatalogCreation = false;
    state.catalogList = [...catalogList];
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
    state.isShowCatalogCreation = false;
  },
});

export const createCatalog = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/createCatalog`,
  thunk: async payload => {
    const { data } = await restController.createCatalog(payload);
    return data;
  },
});

const createCatalogExtraReducers = createExtraReducers({
  thunk: createCatalog,
  fulfilledReducer: (state, { payload }) => {
    state.catalogList = [...state.catalogList, payload];
    state.isShowCatalogCreation = false;
  },
  rejectedReducer: (state, { payload }) => {
    state.isShowCatalogCreation = false;
    state.error = payload;
  },
});

export const deleteCatalog = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/deleteCatalog`,
  thunk: async payload => {
    await restController.deleteCatalog(payload);
    return payload;
  },
});

const deleteCatalogExtraReducers = createExtraReducers({
  thunk: deleteCatalog,
  fulfilledReducer: (state, { payload }) => {
    const { catalogList } = state;
    const newCatalogList = remove(
      catalogList,
      catalog => payload.catalogId !== catalog._id
    );
    state.catalogList = [...newCatalogList];
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

export const removeChatFromCatalog = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/removeChatFromCatalog`,
  thunk: async payload => {
    const { data } = await restController.removeChatFromCatalog(payload);
    return data;
  },
});

const removeChatFromCatalogExtraReducers = createExtraReducers({
  thunk: removeChatFromCatalog,
  fulfilledReducer: (state, { payload }) => {
    const { catalogList } = state;
    for (let i = 0; i < catalogList.length; i++) {
      if (catalogList[i]._id === payload._id) {
        catalogList[i].chats = payload.chats;
        break;
      }
    }
    state.currentCatalog = payload;
    state.catalogList = [...catalogList];
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

export const changeCatalogName = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/changeCatalogName`,
  thunk: async payload => {
    const { data } = await restController.changeCatalogName(payload);
    return data;
  },
});

const changeCatalogNameExtraReducers = createExtraReducers({
  thunk: changeCatalogName,
  fulfilledReducer: (state, { payload }) => {
    const { catalogList } = state;
    for (let i = 0; i < catalogList.length; i++) {
      if (catalogList[i]._id === payload._id) {
        catalogList[i].catalogName = payload.catalogName;
        break;
      }
    }
    state.catalogList = [...catalogList];
    state.currentCatalog = payload;
    state.isRenameCatalog = false;
  },
  rejectedReducer: state => {
    state.isRenameCatalog = false;
  },
});

const reducers = {
  changeBlockStatusInStore: (state, { payload }) => {
    const index = findPreviewIndex(state.messagesPreview, payload.participants);
    if (index !== -1) {
      state.messagesPreview[index].blackList = payload.blackList;
    }
    state.chatData = payload;
  },

  addMessage: (state, { payload }) => {
    const { message, preview } = payload;
    const index = findPreviewIndex(state.messagesPreview, preview.participants);

    if (index !== -1) {
      state.messagesPreview[index].text = message.body;
      state.messagesPreview[index].sender = message.senderId;
      state.messagesPreview[index].createAt = message.createdAt;
      const [updatedChat] = state.messagesPreview.splice(index, 1);
      state.messagesPreview.unshift(updatedChat);
    } else {
      state.messagesPreview.unshift(preview);
    }

    if (
      state.chatData &&
      findPreviewIndex([state.chatData], preview.participants) !== -1
    ) {
      state.messages = [...state.messages, message];
    }
  },

  backToDialogList: state => {
    state.isExpanded = false;
  },

  goToExpandedDialog: (state, { payload }) => {
    state.interlocutor = { ...state.interlocutor, ...payload.interlocutor };
    state.chatData = payload.conversationData;
    state.isShow = true;
    state.isExpanded = true;
    state.messages = [];
  },

  clearMessageList: state => {
    state.messages = [];
  },

  changeChatShow: state => {
    state.isShowCatalogCreation = false;
    state.isShow = !state.isShow;
  },

  setPreviewChatMode: (state, { payload }) => {
    state.chatMode = payload;
  },

  changeShowModeCatalog: (state, { payload }) => {
    state.currentCatalog = payload ? { ...payload } : null;
    state.isShowChatsInCatalog = !state.isShowChatsInCatalog;
    state.isRenameCatalog = false;
  },

  changeTypeOfChatAdding: (state, { payload }) => {
    state.catalogCreationMode = payload;
  },

  changeShowAddChatToCatalogMenu: (state, { payload }) => {
    state.addChatId = payload;
    state.isShowCatalogCreation = !state.isShowCatalogCreation;
  },

  changeRenameCatalogMode: state => {
    state.isRenameCatalog = !state.isRenameCatalog;
  },

  clearChatError: state => {
    state.error = null;
  },
};

const extraReducers = builder => {
  getPreviewChatExtraReducers(builder);
  getDialogMessagesExtraReducers(builder);
  sendMessageExtraReducers(builder);
  changeChatFavoriteExtraReducers(builder);
  changeChatBlockExtraReducers(builder);
  getCatalogListExtraReducers(builder);
  addChatToCatalogExtraReducers(builder);
  createCatalogExtraReducers(builder);
  deleteCatalogExtraReducers(builder);
  removeChatFromCatalogExtraReducers(builder);
  changeCatalogNameExtraReducers(builder);
};

const chatSlice = createSlice({
  name: CHAT_SLICE_NAME,
  initialState,
  reducers,
  extraReducers,
});

const { actions, reducer } = chatSlice;

export const {
  changeBlockStatusInStore,
  addMessage,
  backToDialogList,
  goToExpandedDialog,
  clearMessageList,
  changeChatShow,
  setPreviewChatMode,
  changeShowModeCatalog,
  changeTypeOfChatAdding,
  changeShowAddChatToCatalogMenu,
  changeRenameCatalogMode,
  clearChatError,
} = actions;

export default reducer;
