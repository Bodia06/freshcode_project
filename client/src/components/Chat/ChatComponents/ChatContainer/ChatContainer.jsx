import { useSelector } from 'react-redux';
import Chat from '../Chat/Chat';

const ChatContainer = () => {
  const { data } = useSelector((state) => state.userStore);

  return <>{data ? <Chat /> : null}</>;
};

export default ChatContainer;
