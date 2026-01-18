import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import SelectInput from '../../../SelectInput/SelectInput';
import { addChatToCatalog } from '../../../../store/slices/chatSlice';
import styles from './AddToCatalog.module.sass';

const AddToCatalog = (props) => {
  const { catalogList, addChatId, addChatToCatalog } = props;

  const getCatalogsNames = () => {
    return catalogList.map((catalog) => catalog.catalogName);
  };

  const getValueArray = () => {
    return catalogList.map((catalog) => catalog._id);
  };

  const click = (values) => {
    if (!values.catalogId) return;

    addChatToCatalog({
      chatId: addChatId,
      catalogId: values.catalogId,
    });
  };

  const selectArray = getCatalogsNames();
  const valueArray = getValueArray();

  return (
    <>
      {selectArray.length !== 0 ? (
        <Formik
          onSubmit={click}
          initialValues={{ catalogId: valueArray[0] || '' }}
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

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
  addChatToCatalog: (data) => dispatch(addChatToCatalog(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddToCatalog);
