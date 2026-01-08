import { useContext } from 'react';
import { EventContest } from '../contexts/eventContest';

const withEventContext = (Component) => {
  return (props) => {
    const eventContext = useContext(EventContest);

    return <Component {...props} eventContext={eventContext} />;
  };
};

export default withEventContext;
