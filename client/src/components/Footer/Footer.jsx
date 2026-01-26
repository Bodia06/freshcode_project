import CONSTANTS from '../../constants';
import styles from './Footer.module.sass';

const Footer = () => {
  const renderTopFooterItems = (item) => (
    <div key={item.title}>
      <h4>{item.title}</h4>
      {item.items.map((i) => (
        <a key={i} href="https://google.com">
          {i}
        </a>
      ))}
    </div>
  );

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerTop}>
        <div>
          {CONSTANTS.FooterItems.map((item) => renderTopFooterItems(item))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
