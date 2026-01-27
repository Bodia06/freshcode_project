import { useDispatch } from 'react-redux';
import Catalog from '../Catalog/Catalog';
import {
  changeShowModeCatalog,
  deleteCatalog as deleteCatalogAction,
} from '../../../../store/slices/chatSlice';
import styles from '../CatalogListContainer/CatalogListContainer.module.sass';

const CatalogList = ({ catalogList }) => {
  const dispatch = useDispatch();

  const goToCatalog = (event, catalog) => {
    event.stopPropagation();
    dispatch(changeShowModeCatalog(catalog));
  };

  const handleDeleteCatalog = (event, catalogId) => {
    event.stopPropagation();
    dispatch(deleteCatalogAction({ catalogId }));
  };

  const getListCatalog = () => {
    if (!catalogList || catalogList.length === 0) {
      return <span className={styles.notFound}>Not found</span>;
    }

    return catalogList.map((catalog) => (
      <Catalog
        catalog={catalog}
        key={catalog._id}
        deleteCatalog={handleDeleteCatalog}
        goToCatalog={goToCatalog}
      />
    ));
  };

  return <div className={styles.listContainer}>{getListCatalog()}</div>;
};

export default CatalogList;
