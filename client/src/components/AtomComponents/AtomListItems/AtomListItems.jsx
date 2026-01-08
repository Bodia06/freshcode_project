import styles from './AtomListItems.module.sass';

export default function AtomListItems({ data }) {
  const { title, description, buttonText, iconPath, iconColor } = data;

  return (
    <li className={styles.cardItem}>
      <div className={styles.cardIcon} style={{ fill: iconColor }}>
        <svg viewBox="0 0 24 24" width="45" height="45">
          {iconPath}
        </svg>
      </div>

      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>

      <button className={styles.cardButton}>
        {buttonText} <span className={styles.arrow}>→</span>
      </button>
    </li>
  );
}
