import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import SelectInput from '../../../InputComponents/SelectInput/SelectInput';
import { addChatToCatalog as addChatToCatalogAction } from '../../../../store/slices/chatSlice';
import styles from './AddToCatalog.module.sass';

const AddToCatalog = () => {
  const dispatch = useDispatch();

  const catalogList = useSelector((state) => state.chatStore.catalogList);
  const addChatId = useSelector((state) => state.chatStore.addChatId);

  const getCatalogsNames = () => {
    return catalogList.map((catalog) => catalog.catalogName);
  };

  const getValueArray = () => {
    return catalogList.map((catalog) => catalog._id);
  };

  const click = (values) => {
    dispatch(
      addChatToCatalogAction({
        chatId: addChatId,
        catalogId: values.catalogId,
      })
    );
  };

  const selectArray = getCatalogsNames();
  const valueArray = getValueArray();

  return (
    <>
      {selectArray.length !== 0 ? (
        <Formik
          onSubmit={click}
          initialValues={{ catalogId: valueArray[0] || '' }}
          enableReinitialize={true}
        >
          <Form className={styles.form}>
            <SelectInput
              name="catalogId"
              header="name of catalog"
              classes={{
                inputContainer: styles.selectInputContainer,
                inputHeader: styles.selectHeader,
                selectInput: styles.select,
              }}
              optionsArray={selectArray}
              valueArray={valueArray}
            />
            <button type="submit">Add</button>
          </Form>
        </Formik>
      ) : (
        <div className={styles.notFound}>
          You have not created any directories.
        </div>
      )}
    </>
  );
};

export default AddToCatalog;
