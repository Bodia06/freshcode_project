import CONSTANTS from '../../../constants';
import styles from './ModeratorOfferItem.module.sass';

const ModeratorOfferItem = ({ offer, onAction }) => {
  const renderContent = () => {
    if (offer.fileName) {
      return (
        <img
          src={`${CONSTANTS.publicURL}${offer.fileName}`}
          className={styles.offerImage}
          alt="contest-offer"
        />
      );
    }
    return <span className={styles.offerText}>{offer.text}</span>;
  };

  return (
    <li className={styles.offerItem}>
      <div className={styles.idInfo}>
        <span>
          <strong>ID:</strong> {offer.id}
        </span>
        <span>
          <strong>Contest:</strong> {offer.contestId}
        </span>
      </div>

      <div className={styles.contentCell}>{renderContent()}</div>

      <div className={styles.actionButtons}>
        <button
          className={styles.approveBtn}
          onClick={() => onAction(offer.id, 'approve')}
        >
          Approve
        </button>
        <button
          className={styles.rejectBtn}
          onClick={() => onAction(offer.id, 'reject')}
        >
          Reject
        </button>
      </div>
    </li>
  );
};

export default ModeratorOfferItem;
