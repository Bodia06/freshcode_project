import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.sass';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={styles.buttonContainer}
    >
      <span>Back</span>
    </button>
  );
};

export default BackButton;
