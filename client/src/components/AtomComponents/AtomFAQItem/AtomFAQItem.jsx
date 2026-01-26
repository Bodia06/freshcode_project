import { useState } from 'react';
import styles from './AtomFAQItem.module.sass';

function AtomFAQItem({ data }) {
  const [isOpen, setIsOpen] = useState(false);

  const content = data.description;

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}
      onClick={toggleOpen}
    >
      <div className={styles.faqHeader}>
        <h4 className={styles.questionTitle}>{data.title}</h4>
        <div className={styles.icon}>
          {isOpen ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 1V13M1 7H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>

      {isOpen && (
        <div className={styles.faqBody}>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
}

export default AtomFAQItem;
