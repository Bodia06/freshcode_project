import styles from './AtomContestSteps.module.sass';

export default function AtomContestSteps({ data, stepNumber, isLast }) {
  const { description } = data;

  return (
    <>
      <div className={styles.stepCard}>
        <div className={styles.stepBadge}>Step {stepNumber}</div>
        <p className={styles.stepDescription}>{description}</p>
      </div>

      {!isLast && (
        <div className={styles.arrowContainer}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ccc"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </>
  );
}
