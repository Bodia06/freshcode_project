import SlideBar from '../../SlideBar/SlideBar';
import carouselConstants from '../../../carouselConstants';
import styles from './Testimonials.module.sass';

const Testimonials = () => {
  return (
    <div className={styles.blueContainer}>
      <h2 className={styles.whiteUnderline}>What our customers say</h2>
      <SlideBar
        images={carouselConstants.feedbackSliderImages}
        carouselType={carouselConstants.FEEDBACK_SLIDER}
      />
    </div>
  );
};

export default Testimonials;
