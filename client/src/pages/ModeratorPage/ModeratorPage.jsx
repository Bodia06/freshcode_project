import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getModerationOffers,
  changeOfferStatus,
} from '../../store/slices/moderatorSlice';
import Spinner from '../../components/Spinner/Spinner';
import ModeratorOfferItem from '../../components/ModeratorOfferItem/ModeratorOfferItem';
import styles from './ModeratorPage.module.sass';

const ModeratorPage = () => {
  const dispatch = useDispatch();
  const { offers, isFetching, count, error } = useSelector(
    (state) => state.moderator
  );
  const [offset, setOffset] = useState(0);
  const limit = 9;

  useEffect(() => {
    dispatch(getModerationOffers({ limit, offset }));
  }, [dispatch, offset]);

  useEffect(() => {
    if (!isFetching && offers.length === 0 && offset > 0) {
      setOffset((prev) => Math.max(0, prev - limit));
    }
  }, [offers.length, isFetching, offset]);

  const handleStatusChange = (offerId, command) => {
    dispatch(changeOfferStatus({ offerId, command })).then(() => {
      dispatch(getModerationOffers({ limit, offset }));
    });
  };

  if (isFetching && offers.length === 0) return <Spinner />;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h2>Moderation Review Panel</h2>
          <p>
            Waiting: <strong>{count}</strong>
          </p>
        </div>

        {error && <div className={styles.error}>Error: {error.message}</div>}

        <div
          className={styles.listContainer}
          style={{ opacity: isFetching ? 0.6 : 1 }}
        >
          <ul className={styles.offersList}>
            {offers.map((offer) => (
              <ModeratorOfferItem
                key={offer.id}
                offer={offer}
                onAction={handleStatusChange}
              />
            ))}
            {!isFetching && offers.length === 0 && (
              <div className={styles.empty}>No offers to moderate.</div>
            )}
          </ul>
        </div>

        <div className={styles.paginationControls}>
          <button
            disabled={offset === 0}
            onClick={() => setOffset(offset - limit)}
          >
            Previous
          </button>
          <span>Page {offset / limit + 1}</span>
          <button
            disabled={offset + limit >= count}
            onClick={() => setOffset(offset + limit)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeratorPage;
