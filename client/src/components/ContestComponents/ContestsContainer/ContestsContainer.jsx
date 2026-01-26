import { useEffect, useCallback } from 'react';
import Spinner from '../../Spinner/Spinner';
import styles from './ContestContainer.module.sass';

const ContestsContainer = ({ isFetching, haveMore, loadMore, children }) => {
  const scrollHandler = useCallback(() => {
    const isBottom =
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 10;

    if (isBottom && haveMore && !isFetching) {
      loadMore(children.length);
    }
  }, [haveMore, loadMore, children.length, isFetching]);

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollHandler]);

  if (!isFetching && children.length === 0) {
    return <div className={styles.notFound}>Nothing not found</div>;
  }

  return (
    <div>
      {children}
      {isFetching && (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ContestsContainer;
