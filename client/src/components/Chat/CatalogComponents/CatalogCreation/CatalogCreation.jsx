import React from 'react';
import { connect } from 'react-redux';
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

class CatalogCreation extends React.Component {
  componentDidMount() {
    this.props.getCatalogList();
  }

  render() {
    const {
      changeTypeOfChatAdding,
      catalogCreationMode,
      changeShowAddChatToCatalogMenu,
      isFetching,
      catalogList,
    } = this.props;

    const { ADD_CHAT_TO_OLD_CATALOG, CREATE_NEW_CATALOG_AND_ADD_CHAT } =
      CONSTANTS;

    const isOldDisabled = catalogList.length === 0;

    return (
      <>
        {!isFetching && (
          <div className={styles.catalogCreationContainer}>
            <i
              className="far fa-times-circle"
              onClick={() => changeShowAddChatToCatalogMenu()}
              title="Close"
            />
            <div className={styles.buttonsContainer}>
              <span
                onClick={() =>
                  !isOldDisabled &&
                  changeTypeOfChatAdding(ADD_CHAT_TO_OLD_CATALOG)
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
                  changeTypeOfChatAdding(CREATE_NEW_CATALOG_AND_ADD_CHAT)
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
  }
}

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
  changeTypeOfChatAdding: (data) => dispatch(changeTypeOfChatAdding(data)),
  changeShowAddChatToCatalogMenu: () =>
    dispatch(changeShowAddChatToCatalogMenu()),
  getCatalogList: () => dispatch(getCatalogList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogCreation);
