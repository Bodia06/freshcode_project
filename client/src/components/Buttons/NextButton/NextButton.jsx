import styles from './NextButton.module.sass';

const NextButton = ({ submit }) => {
  return (
    <button type="button" onClick={submit} className={styles.buttonContainer}>
      <span>Next</span>
    </button>
  );
};

export default NextButton;
