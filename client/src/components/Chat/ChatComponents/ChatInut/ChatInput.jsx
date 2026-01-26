import { connect } from 'react-redux';
import { Form, Formik } from 'formik';
import { sendMessage } from '../../../../store/slices/chatSlice';
import FormInput from '../../../InputComponents/FormInput/FormInput';
import Schems from '../../../../utils/validators/validationSchems';
import CONSTANTS from '../../../../constants';
import styles from './ChatInput.module.sass';

const ChatInput = (props) => {
  const submitHandler = (values, { resetForm }) => {
    if (values.message.trim()) {
      props.sendMessage({
        messageBody: values.message,
        recipient: props.interlocutor.id,
        interlocutor: props.interlocutor,
      });
      resetForm();
    }
  };

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

const mapStateToProps = (state) => {
  const { interlocutor } = state.chatStore;
  const { data } = state.userStore;
  return { interlocutor, data };
};

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (data) => dispatch(sendMessage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);
