import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import CONSTANTS from '../../../constants';
import styles from '../Header.module.sass';

const Navigation = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveSubMenu(null);
  };

  const toggleSubMenu = (e, name) => {
    if (window.innerWidth <= 1200) {
      e.preventDefault();
      setActiveSubMenu(activeSubMenu === name ? null : name);
    }
  };

  return (
    <div className={styles.navWrapper}>
      <div className={styles.burgerBtn} onClick={toggleMenu}>
        <span className={isMenuOpen ? styles.open : ''}></span>
        <span className={isMenuOpen ? styles.open : ''}></span>
        <span className={isMenuOpen ? styles.open : ''}></span>
      </div>

      <nav
        className={classNames(styles.nav, {
          [styles.active]: isMenuOpen,
          [styles.notLoggedIn]: !isLoggedIn,
        })}
      >
        <div className={styles.mobileLogo}>
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}blue-logo.png`}
            alt="blue_logo"
            onClick={() => navigate('/')}
          />
        </div>
        <ul>
          <li onClick={(e) => toggleSubMenu(e, 'nameIdeas')}>
            <span>NAME IDEAS</span>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
              alt="menu"
            />
            <ul className={activeSubMenu === 'nameIdeas' ? styles.showSub : ''}>
              <li>
                <a href="#">Beauty</a>
              </li>
              <li>
                <a href="#">Consulting</a>
              </li>
              <li>
                <a href="#">E-Commerce</a>
              </li>
              <li>
                <a href="#">Fashion & Clothing</a>
              </li>
              <li>
                <a href="#">Finance</a>
              </li>
              <li>
                <a href="#">Real Estate</a>
              </li>
              <li>
                <a href="#">Tech</a>
              </li>
              <li className={styles.last}>
                <a href="#">More Categories</a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/atom" className={styles.navLink}>
              <span>Atom</span>
            </Link>
          </li>

          <li onClick={(e) => toggleSubMenu(e, 'contests')}>
            <span>CONTESTS</span>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
              alt="menu"
            />
            <ul className={activeSubMenu === 'contests' ? styles.showSub : ''}>
              <li>
                <a href="#">HOW IT WORKS</a>
              </li>
              <li>
                <a href="#">PRICING</a>
              </li>
              <li>
                <a href="#">AGENCY SERVICE</a>
              </li>
              <li>
                <a href="#">ACTIVE CONTESTS</a>
              </li>
              <li>
                <a href="#">WINNERS</a>
              </li>
              <li>
                <a href="#">LEADERBOARD</a>
              </li>
              <li className={styles.last}>
                <a href="#">BECOME A CREATIVE</a>
              </li>
            </ul>
          </li>

          <li onClick={(e) => toggleSubMenu(e, 'ourWork')}>
            <span>Our Work</span>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
              alt="menu"
            />
            <ul className={activeSubMenu === 'ourWork' ? styles.showSub : ''}>
              <li>
                <a href="#">NAMES</a>
              </li>
              <li>
                <a href="#">TAGLINES</a>
              </li>
              <li>
                <a href="#">LOGOS</a>
              </li>
              <li className={styles.last}>
                <a href="#">TESTIMONIALS</a>
              </li>
            </ul>
          </li>

          <li onClick={(e) => toggleSubMenu(e, 'namesForSale')}>
            <span>Names For Sale</span>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
              alt="menu"
            />
            <ul
              className={activeSubMenu === 'namesForSale' ? styles.showSub : ''}
            >
              <li>
                <a href="#">POPULAR NAMES</a>
              </li>
              <li>
                <a href="#">SHORT NAMES</a>
              </li>
              <li>
                <a href="#">INTRIGUING NAMES</a>
              </li>
              <li>
                <a href="#">NAMES BY CATEGORY</a>
              </li>
              <li>
                <a href="#">VISUAL NAME SEARCH</a>
              </li>
              <li className={styles.last}>
                <a href="#">SELL YOUR DOMAINS</a>
              </li>
            </ul>
          </li>

          <li onClick={(e) => toggleSubMenu(e, 'blog')}>
            <span>Blog</span>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
              alt="menu"
            />
            <ul className={activeSubMenu === 'blog' ? styles.showSub : ''}>
              <li>
                <a href="#">ULTIMATE NAMING GUIDE</a>
              </li>
              <li>
                <a href="#">POETIC DEVICES IN BUSINESS NAMING</a>
              </li>
              <li>
                <a href="#">CROWDED BAR THEORY</a>
              </li>
              <li className={styles.last}>
                <a href="#">ALL ARTICLES</a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
