import { useEffect, useState, createContext } from 'react';

export const EventContest = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const checkNotifications = () => {
      const now = Date.now();

      const activeList = events.filter((event) => {
        const dateTimeStr =
          event.time.length === 5 ? `${event.time}:00` : event.time;
        const eventDateTimeString = `${event.date}T${dateTimeStr}`;

        const eventTime = new Date(eventDateTimeString).getTime();

        if (isNaN(eventTime)) {
          return false;
        }

        const notifyOffset = event.notifyBefore * 60 * 60 * 1000;
        const notificationStartTime = eventTime - notifyOffset;

        return now >= notificationStartTime && now < eventTime;
      });

      setNotificationCount((prevCount) => {
        if (prevCount !== activeList.length) {
          return activeList.length;
        }
        return prevCount;
      });
    };

    checkNotifications();

    const interval = setInterval(checkNotifications, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const addEvent = (formData) => {
    const newEvent = {
      id: Date.now(),
      name: formData.name,
      date: formData.date,
      time: formData.time,
      notifyBefore: Number(formData.notifyBefore),
      createdAt: Date.now(),
    };

    setEvents((prevEvent) => {
      const newListEvents = [...prevEvent, newEvent];
      return newListEvents.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      });
    });
  };

  const deleteEvent = (id) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  return (
    <EventContest.Provider
      value={{
        events,
        addEvent,
        deleteEvent,
        notificationCount,
      }}
    >
      {children}
    </EventContest.Provider>
  );
};
