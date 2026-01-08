import { useState } from 'react';
import AtomContestSteps from '../../components/AtomComponents/AtomContestSteps/AtomContestSteps';
import AtomListItems from '../../components/AtomComponents/AtomListItems/AtomListItems';
import AtomFAQItem from '../../components/AtomComponents/AtomFAQItem/AtomFAQItem';
import CONSTANS from '../../constants';
import styles from './AtomPage.module.sass';

function AtomPage() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const scrollToCategory = (index) => {
    setActiveCategoryIndex(index);
    const element = document.getElementById(`faq-category-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <section className={styles.startInfo}>
        <article className={styles.startInfoText}>
          <span className={styles.badge}>World's #1 Naming Platform</span>
          <h2>How Does Atom Work?</h2>
          <p>
            Atom helps you come up with a great name for your business by
            combining the power of crowdsourcing with sophisticated technology
            and Agency-level validation services.
          </p>
        </article>
        <div className={styles.startInfoMedia}>
          <iframe
            src="https://iframe.mediadelivery.net/embed/239474/327efcdd-b1a2-4891-b274-974787ae8362?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
            title="How Atom Works"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <section className={styles.startUsingAtomInfo}>
        <article className={styles.usingAtomTitle}>
          <span className={styles.serviceBadge}>Our Services</span>
          <h2>3 Ways To Use Atom</h2>
          <p>Atom offers 3 ways to get you a perfect name for your business.</p>
        </article>
        <div className={styles.usingAtomListContainer}>
          <ul className={styles.usingAtomList}>
            {CONSTANS.SERVICES_DATA.map((item, index) => (
              <AtomListItems data={item} key={index} />
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.contestStepsSection}>
        <div className={styles.contestHeader}>
          <div className={styles.trophyIcon}>
            <svg
              width="60"
              height="60"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M52 12H44V8C44 5.79 42.21 4 40 4H24C21.79 4 20 5.79 20 8V12H12C9.79 12 8 13.79 8 16V22C8 26.69 11.19 30.64 15.5 31.75C16.81 35.9 20.69 39 25.35 39.81C26.12 42.19 28.34 44 31 44H33C35.66 44 37.88 42.19 38.65 39.81C43.31 39 47.19 35.9 48.5 31.75C52.81 30.64 56 26.69 56 22V16C56 13.79 54.21 12 52 12ZM12 22V16H20V24.5C15.42 24.12 12 22 12 22ZM40 36C40 38.21 38.21 40 36 40H28C25.79 40 24 38.21 24 36V8H40V36ZM52 22C52 22 48.58 24.12 44 24.5V16H52V22Z"
                fill="#377dff"
                opacity="0.3"
              />
              <path
                d="M32 16L34.5 21L39.5 21.75L36 25.5L37 31L32 28.5L27 31L28 25.5L24.5 21.75L29.5 21L32 16Z"
                fill="#377dff"
              />
              <rect
                x="22"
                y="46"
                width="20"
                height="4"
                rx="2"
                fill="#377dff"
                opacity="0.5"
              />
              <rect x="18" y="52" width="28" height="4" rx="2" fill="#377dff" />
            </svg>
          </div>
          <h2>How Do Naming Contests Work?</h2>
        </div>

        <div className={styles.stepsContainer}>
          {CONSTANS.CONTEST_STEPS_DATA.map((step, index) => (
            <AtomContestSteps
              key={index}
              data={step}
              stepNumber={index + 1}
              isLast={index === CONSTANS.CONTEST_STEPS_DATA.length - 1}
            />
          ))}
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.faqHeaderTitle}>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className={styles.faqNavContainer}>
          <div className={styles.faqNav}>
            {CONSTANS.FREQUENTLY_ASKED_QUESTIONS.map((category, index) => (
              <button
                key={index}
                className={`${styles.navButton} ${
                  activeCategoryIndex === index ? styles.active : ''
                }`}
                onClick={() => scrollToCategory(index)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.allQuestionsContainer}>
          {CONSTANS.FREQUENTLY_ASKED_QUESTIONS.map((category, index) => (
            <div
              key={index}
              id={`faq-category-${index}`}
              className={styles.faqCategoryBlock}
            >
              <h3 className={styles.categoryTitle}>{category.title}</h3>

              {category.questions.map((question, qIndex) => (
                <AtomFAQItem key={qIndex} data={question} />
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.inputWrapper}>
            <svg
              className={styles.searchIconLeft}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="#77838f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="#77838f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search Over 300,000+ Premium Names"
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className={styles.tagsRow}>
            {CONSTANS.POPULAR_TAGS.map((tag, index) => (
              <button key={index} className={styles.tagItem}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default AtomPage;
