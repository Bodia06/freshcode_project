import { useSelector } from 'react-redux';
import carouselConstants from '../../carouselConstants';
import SlideBar from '../../components/SlideBar/SlideBar';
import Spinner from '../../components/Spinner/Spinner';
import HeroSection from '../../components/HomeComponents/HeroSection/HeroSection';
import WhySquadhelp from '../../components/HomeComponents/WhySquadhelp/WhySquadhelp';
import SponsorsAndStats from '../../components/HomeComponents/SponsorsAndStats/SponsorsAndStats';
import HowItWorks from '../../components/HomeComponents/HowItWorks/HowItWorks';
import NamesForSale from '../../components/HomeComponents/NamesForSale/NamesForSale';
import Testimonials from '../../components/HomeComponents/Testimonials/Testimonials';
import styles from './Home.module.sass';

const Home = () => {
  const { isFetching } = useSelector((state) => state.userStore);

  return (
    <>
      {isFetching ? (
        <Spinner />
      ) : (
        <div className={styles.container}>
          <HeroSection />

          <div className={styles.greyContainer}>
            <SlideBar
              images={carouselConstants.mainSliderImages}
              carouselType={carouselConstants.MAIN_SLIDER}
            />
          </div>

          <WhySquadhelp />

          <SponsorsAndStats />

          <HowItWorks />

          <NamesForSale />

          <Testimonials />
        </div>
      )}
    </>
  );
};

export default Home;
