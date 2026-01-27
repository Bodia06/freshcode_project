import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import {
  changeShowModeCatalog,
  changeRenameCatalogMode,
  changeCatalogName as changeCatalogNameAction,
} from '../../../../store/slices/chatSlice';
import FormInput from '../../../InputComponents/FormInput/FormInput';
import Schems from '../../../../utils/validators/validationSchems';
import styles from './CatalogHeader.module.sass';

const CatalogListHeader = () => {
  const dispatch = useDispatch();

  const isRenameCatalog = useSelector(
    (state) => state.chatStore.isRenameCatalog
  );
  const currentCatalog = useSelector((state) => state.chatStore.currentCatalog);

  if (!currentCatalog) {
    return null;
  }

  const { catalogName, _id } = currentCatalog;

  const handleSubmit = (values) => {
    dispatch(
      changeCatalogNameAction({
        catalogName: values.catalogName,
        catalogId: _id,
      })
    );
  };

  return (
    <div className={styles.headerContainer}>
      <i
        className="fas fa-long-arrow-alt-left"
        onClick={() => dispatch(changeShowModeCatalog())}
      />
      {!isRenameCatalog && (
        <div className={styles.infoContainer}>
          <span>{catalogName}</span>
          <i
            className="fas fa-edit"
            onClick={() => dispatch(changeRenameCatalogMode())}
          />
        </div>
      )}
      {isRenameCatalog && (
        <div className={styles.changeContainer}>
          <Formik
            onSubmit={handleSubmit}
            initialValues={{ catalogName }}
            validationSchema={Schems.CatalogSchema}
          >
            <Form>
              <FormInput
                name="catalogName"
                classes={{
                  container: styles.inputContainer,
                  input: styles.input,
                  warning: styles.fieldWarning,
                  notValid: styles.notValid,
                }}
                type="text"
                label="Catalog Name"
              />
              <button type="submit">Change</button>
            </Form>
          </Formik>
        </div>
      )}
    </div>
  );
};

export default CatalogListHeader;
