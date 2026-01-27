import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  changeTypeOfChatAdding,
  changeShowAddChatToCatalogMenu,
  getCatalogList,
} from '../../../../store/slices/chatSlice';
import AddToCatalog from '../AddToCatalog/AddToCatalog';
import CreateCatalog from '../CreateCatalog/CreateCatalog';
import CONSTANTS from '../../../../constants';
import styles from './CatalogCreation.module.sass';

const CatalogCreation = () => {
  const dispatch = useDispatch();

  const catalogCreationMode = useSelector(
    (state) => state.chatStore.catalogCreationMode
  );
  const isFetching = useSelector((state) => state.chatStore.isFetching);
  const catalogList = useSelector((state) => state.chatStore.catalogList);

  const { ADD_CHAT_TO_OLD_CATALOG, CREATE_NEW_CATALOG_AND_ADD_CHAT } =
    CONSTANTS;

  useEffect(() => {
    dispatch(getCatalogList());
  }, [dispatch]);

  const isOldDisabled = catalogList.length === 0;

  return (
    <>
      {!isFetching && (
        <div className={styles.catalogCreationContainer}>
          <i
            className="far fa-times-circle"
            onClick={() => dispatch(changeShowAddChatToCatalogMenu())}
            title="Close"
          />
          <div className={styles.buttonsContainer}>
            <span
              onClick={() =>
                !isOldDisabled &&
                dispatch(changeTypeOfChatAdding(ADD_CHAT_TO_OLD_CATALOG))
              }
              className={classNames({
                [styles.active]:
                  catalogCreationMode === ADD_CHAT_TO_OLD_CATALOG,
                [styles.disabled]: isOldDisabled,
              })}
            >
              Old
            </span>
            <span
              onClick={() =>
                dispatch(
                  changeTypeOfChatAdding(CREATE_NEW_CATALOG_AND_ADD_CHAT)
                )
              }
              className={classNames({
                [styles.active]:
                  catalogCreationMode === CREATE_NEW_CATALOG_AND_ADD_CHAT,
              })}
            >
              New
            </span>
          </div>
          <div
            style={{
              backgroundColor: '#8aca6b',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
            }}
          >
            {catalogCreationMode === CREATE_NEW_CATALOG_AND_ADD_CHAT ? (
              <CreateCatalog />
            ) : (
              <AddToCatalog />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CatalogCreation;
