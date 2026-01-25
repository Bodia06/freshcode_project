import CONSTANTS from '../../constants';
import styles from './ContestButtonGroup.module.sass';

const ContestButtonGroup = ({ setFieldValue, values }) => {
  const handleMainChange = (item) => {
    setFieldValue('domainOption', item.value);

    if (item.options) {
      if (!values.extensionOption) {
        setFieldValue('extensionOption', 'no_other_ext');
      }
    }
  };

  const handleExtensionChange = (value) => {
    setFieldValue('extensionOption', value);
  };

  const selectedMainOption = CONSTANTS.CONTEST_BUTTON_GROUP_INFO.find(
    (item) => item.value === values.domainOption
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>
        Do you want a matching domain (.com URL) with your name?
      </h3>

      <div className={styles.row}>
        {CONSTANTS.CONTEST_BUTTON_GROUP_INFO.map((item, index) => {
          const isActive = values.domainOption === item.value;
          return (
            <div
              key={index}
              className={`${styles.card} ${isActive ? styles.active : ''}`}
              onClick={() => handleMainChange(item)}
            >
              {index === 0 && (
                <span className={styles.recommended}>Recommended</span>
              )}
              {isActive && <div className={styles.checkMark}>✔</div>}

              <span className={styles.cardLabel}>{item.label}</span>
              <span className={styles.cardDescription}>{item.description}</span>
            </div>
          );
        })}
      </div>

      <p className={styles.infoText}>
        If you want a matching domain, our platform will only accept those name
        suggestions where the domain is available.
      </p>

      {selectedMainOption && selectedMainOption.options && (
        <>
          <h3 className={styles.header}>
            Are you open to any other URL extensions besides (.com)?
          </h3>

          <div className={styles.row}>
            {selectedMainOption.options.map((option, index) => {
              const isActive = values.extensionOption === option.value;
              return (
                <div
                  key={index}
                  className={`${styles.card} ${isActive ? styles.active : ''}`}
                  onClick={() => handleExtensionChange(option.value)}
                >
                  {isActive && <div className={styles.checkMark}>✔</div>}
                  <span className={styles.cardLabel}>{option.label}</span>
                  <span className={styles.cardDescription}>
                    {option.description}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ContestButtonGroup;
