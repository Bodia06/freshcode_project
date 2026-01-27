import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import FormInput from '../../../InputComponents/FormInput/FormInput';
import { createCatalog as createCatalogAction } from '../../../../store/slices/chatSlice';
import Schems from '../../../../utils/validators/validationSchems';
import styles from './CreateCatalog.module.sass';

const CreateCatalog = () => {
  const dispatch = useDispatch();

  const addChatId = useSelector((state) => state.chatStore.addChatId);

  const onSubmit = (values) => {
    dispatch(
      createCatalogAction({
        catalogName: values.catalogName,
        chatId: addChatId,
      })
    );
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{ catalogName: '' }}
      validationSchema={Schems.CatalogSchema}
    >
      <Form className={styles.form}>
        <FormInput
          name="catalogName"
          type="text"
          label="name of catalog"
          classes={{
            container: styles.inputContainer,
            input: styles.input,
            warning: styles.fieldWarning,
            notValid: styles.notValid,
          }}
        />
        <button type="submit">Create Catalog</button>
      </Form>
    </Formik>
  );
};

export default CreateCatalog;
