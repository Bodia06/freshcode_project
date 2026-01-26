import CONSTANTS from '../../../constants';
import styles from './SponsorsAndStats.module.sass';

const SponsorsAndStats = () => {
  return (
    <div className={styles.greyContainer}>
      <div className={styles.adv}>
        <div className={styles.images}>
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}sponsors/Forbes-inactive.png`}
            alt="forbes"
          />
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}sponsors/Forbes-active.png`}
            alt="forbes"
          />
        </div>
        <div className={styles.images}>
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}sponsors/the_next_web_inactive.png`}
            alt="web"
          />
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}sponsors/the_next_web_active.png`}
            alt="web"
          />
        </div>
        <div className={styles.images}>
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}sponsors/mashable-inactive.png`}
            alt="mashable"
          />
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}sponsors/mashable-active.png`}
            alt="mashable"
          />
        </div>
      </div>
      <div className={styles.stats}>
        <div>
          <p>119,525</p>
          <span>Creatives</span>
        </div>
        <div>
          <p>21,875</p>
          <span>Customers</span>
        </div>
        <div>
          <p>85</p>
          <span>Industries</span>
        </div>
      </div>
    </div>
  );
};

export default SponsorsAndStats;
