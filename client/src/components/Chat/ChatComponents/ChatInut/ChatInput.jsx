import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import { sendMessage } from '../../../../store/slices/chatSlice';
import FormInput from '../../../InputComponents/FormInput/FormInput';
import Schems from '../../../../utils/validators/validationSchems';
import CONSTANTS from '../../../../constants';
import styles from './ChatInput.module.sass';

const ChatInput = () => {
  const dispatch = useDispatch();

  const { interlocutor } = useSelector((state) => state.chatStore);

  const submitHandler = (values, { resetForm }) => {
    if (values.message.trim() && interlocutor) {
      dispatch(
        sendMessage({
          messageBody: values.message,
          recipient: interlocutor.id,
          interlocutor: interlocutor,
        })
      );
      resetForm();
    }
  };

  if (!interlocutor) return null;

  return (
    <div className={styles.inputContainer}>
      <Formik
        onSubmit={submitHandler}
        initialValues={{ message: '' }}
        validationSchema={Schems.MessageSchema}
      >
        <Form className={styles.form}>
          <div className={styles.container}>
            <FormInput
              name="message"
              type="text"
              placeholder="Type a message..."
              classes={{
                input: styles.input,
                notValid: styles.notValid,
                warning: styles.fieldWarning,
              }}
            />
          </div>
          <button type="submit">
            <img src={`${CONSTANTS.STATIC_IMAGES_PATH}send.png`} alt="Send" />
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default ChatInput;
