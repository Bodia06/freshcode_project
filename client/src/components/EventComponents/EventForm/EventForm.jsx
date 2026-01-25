import { Formik, Form, Field, ErrorMessage } from 'formik';
import SCHEMS from '../../../utils/validators/validationSchems';
import CONSTANTS from '../../../constants';
import styles from './EventForm.module.sass';

export default function EventFrom({ close, addEvent }) {
  const handleSubmit = (values, { resetForm }) => {
    addEvent({
      name: values.name,
      date: values.date,
      time: values.time,
      notifyBefore: values.notifyBefore,
    });
    close();
    resetForm();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2>Create New Event</h2>
          <button className={styles.btnClose} onClick={close}>
            ×
          </button>
        </div>

        <Formik
          initialValues={CONSTANTS.INITIAL_VALUES_EVENT_FROM}
          validationSchema={SCHEMS.EventSchema}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Event Name</label>
              <Field
                name="name"
                type="text"
                placeholder="New Year Sale..."
                className={styles.input}
              />
              <ErrorMessage
                name="name"
                component="div"
                className={styles.error}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="date">Date</label>
                <Field name="date" type="date" className={styles.input} />
                <ErrorMessage
                  name="date"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="time">Time</label>
                <Field name="time" type="time" className={styles.input} />
                <ErrorMessage
                  name="time"
                  component="div"
                  className={styles.error}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="notifyBefore">Notify before (hours)</label>
              <Field
                name="notifyBefore"
                type="number"
                min="1"
                className={styles.input}
              />
              <ErrorMessage
                name="notifyBefore"
                component="div"
                className={styles.error}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Create Event
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
