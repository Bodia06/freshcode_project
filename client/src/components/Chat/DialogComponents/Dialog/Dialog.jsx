import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import className from 'classnames';
import {
  getDialogMessages,
  clearMessageList,
} from '../../../../store/slices/chatSlice';
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import ChatInput from '../../ChatComponents/ChatInut/ChatInput';
import styles from './Dialog.module.sass';

const Dialog = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const { messages, interlocutor, chatData } = useSelector(
    (state) => state.chatStore
  );
  const userId = useSelector((state) => state.userStore.data?.id);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (interlocutor?.id) {
      dispatch(getDialogMessages({ interlocutorId: interlocutor.id }));
    }
    return () => {
      dispatch(clearMessageList());
    };
  }, [interlocutor?.id, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const renderedMessages = useMemo(() => {
    const nodes = [];
    let lastDate = null;

    messages.forEach((message, i) => {
      const messageDate = moment(message.createdAt);
      const dateFormatted = messageDate.format('MMMM DD, YYYY');

      if (lastDate !== dateFormatted) {
        nodes.push(
          <div key={`date-${message.createdAt}-${i}`} className={styles.date}>
            {dateFormatted}
          </div>
        );
        lastDate = dateFormatted;
      }

      const isOwnMessage = Number(message.senderId) === Number(userId);

      nodes.push(
        <div
          key={message.id || `msg-${i}`}
          className={className(
            isOwnMessage ? styles.ownMessage : styles.message
          )}
        >
          <span>{message.body}</span>
          <span className={styles.messageTime}>
            {messageDate.format('HH:mm')}
          </span>
        </div>
      );
    });

    return nodes;
  }, [messages, userId]);

  const renderFooter = () => {
    const blackList = chatData?.blackList;
    const participants = chatData?.participants;

    if (!blackList || !participants) {
      return <ChatInput />;
    }

    const userIndex = participants.findIndex(
      (id) => Number(id) === Number(userId)
    );
    const interlocutorIndex = userIndex === 0 ? 1 : 0;

    if (blackList[userIndex])
      return <span className={styles.messageBlock}>You blocked him</span>;
    if (blackList[interlocutorIndex])
      return <span className={styles.messageBlock}>He blocked you</span>;

    return <ChatInput />;
  };

  return (
    <div className={styles.dialogMainContainer}>
      <ChatHeader userId={userId} />
      <div className={styles.messageList}>
        {renderedMessages}
        <div ref={messagesEndRef} style={{ clear: 'both' }} />
      </div>
      {renderFooter()}
    </div>
  );
};

export default Dialog;
