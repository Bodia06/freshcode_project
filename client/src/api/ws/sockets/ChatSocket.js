import WebSocket from './WebSocket';
import {
  addMessage,
  changeBlockStatusInStore,
} from '../../../store/slices/chatSlice';
import CONTANTS from '../../../constants';

class ChatSocket extends WebSocket {
  constructor (dispatch, getState, room) {
    super(dispatch, getState, room);
  }

  anotherSubscribes = () => {
    this.onNewMessage();
    this.onChangeBlockStatus();
  };

  onChangeBlockStatus = () => {
    this.socket.on(CONTANTS.CHANGE_BLOCK_STATUS, data => {
      this.dispatch(changeBlockStatusInStore(data.message));
    });
  };

  onNewMessage = () => {
    this.socket.on('newMessage', data => {
      this.dispatch(addMessage(data.message));
    });
  };

  subscribeChat = id => {
    this.socket.emit('subscribeChat', id);
  };

  unsubscribeChat = id => {
    this.socket.emit('unsubscribeChat', id);
  };
}

export default ChatSocket;
