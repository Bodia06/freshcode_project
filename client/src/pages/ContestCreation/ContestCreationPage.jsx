import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveFile } from '../../utils/fileCashe';
import { saveContestToStore } from '../../store/slices/contestCreationSlice';
import ContestForm from '../../components/ContestComponents/ContestForm/ContestForm';
import BackButton from '../../components/Buttons/BackButton/BackButton';
import NextButton from '../../components/Buttons/NextButton/NextButton';
import ProgressBar from '../../components/ContestComponents/ProgressBar/ProgressBar';
import styles from './ContestCreationPage.module.sass';

const ContestCreationPage = ({ contestType, title }) => {
  const formRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { contests } = useSelector((state) => state.contestCreationStore);
  const { bundle } = useSelector((state) => state.bundleStore);

  useEffect(() => {
    if (!bundle) {
      navigate('/startContest', { replace: true });
    }
  }, [bundle, navigate]);

  const contestData = contests[contestType]
    ? contests[contestType]
    : { contestType };

  const handleSubmit = (values) => {
    if (values.file) {
      saveFile(contestType, values.file);
    }

    const { file, ...serializableInfo } = values;
    serializableInfo.haveFile = !!file;

    dispatch(
      saveContestToStore({
        type: contestType,
        info: serializableInfo,
      })
    );

    const nextStep = bundle[contestType];
    const route =
      nextStep === 'payment' ? '/payment' : `/startContest/${nextStep}Contest`;

    navigate(route);
  };

  const submitForm = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  if (!bundle) return null;

  return (
    <div className={styles.mainContainer}>
      <header className={styles.startContestHeader}>
        <div className={styles.startContestInfo}>
          <h2>{title}</h2>
          <span>
            Tell us a bit more about your business as well as your preferences
            so that creatives get a better idea about what you are looking for
          </span>
        </div>
        <ProgressBar currentStep={2} />
      </header>

      <section className={styles.container}>
        <div className={styles.formContainer}>
          <ContestForm
            contestType={contestType}
            handleSubmit={handleSubmit}
            formRef={formRef}
            defaultData={contestData}
          />
        </div>
      </section>

      <footer className={styles.footerButtonsContainer}>
        <div className={styles.lastContainer}>
          <div className={styles.buttonsContainer}>
            <BackButton />
            <NextButton submit={submitForm} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContestCreationPage;
