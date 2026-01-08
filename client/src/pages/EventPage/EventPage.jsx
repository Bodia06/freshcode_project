import { useState } from 'react';
import { useEvent } from '../../hooks/useEvent';
import EventForm from '../../components/EventForm/EventForm';
import EventsList from '../../components/EventsList/EventsList';
import styles from './EventPage.module.sass';

export default function EventPage() {
  const { events, addEvent, deleteEvent } = useEvent();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
    console.log(openModal);
  };

  return (
    <div className={styles.eventContainer}>
      <h2 className={styles.eventTitle}>Events List</h2>

      <button className={styles.addEventButton} onClick={handleOpenModal}>
        Add new event
      </button>

      {openModal && <EventForm close={handleOpenModal} addEvent={addEvent} />}

      {events.length === 0 ? (
        <p className={styles.eventNotFound}>No events available.</p>
      ) : (
        <ul className={styles.listContainer}>
          {events.map((event) => (
            <EventsList
              key={event.id}
              eventData={event}
              deleteEvent={deleteEvent}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
