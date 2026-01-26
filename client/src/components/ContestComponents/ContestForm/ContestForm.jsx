import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Formik } from 'formik';
import { getDataForContest } from '../../../store/slices/dataForContestSlice';
import Spinner from '../../Spinner/Spinner';
import FormInput from '../../InputComponents/FormInput/FormInput';
import SelectInput from '../../InputComponents/SelectInput/SelectInput';
import FieldFileInput from '../../InputComponents/FieldFileInput/FieldFileInput';
import FormTextArea from '../../InputComponents/FormTextArea/FormTextArea';
import TryAgain from '../../TryAgain/TryAgain';
import Schems from '../../../utils/validators/validationSchems';
import OptionalSelects from '../../InputComponents/OptionalSelects/OptionalSelects';
import ContestButtonGroup from '../../ContestComponents/ContestButtonGroup/ContestButtonGroup';
import CONSTANTS from '../../../constants';
import styles from './ContestForm.module.sass';

const variableOptions = {
  [CONSTANTS.NAME_CONTEST]: {
    styleName: '',
    typeOfName: '',
  },
  [CONSTANTS.LOGO_CONTEST]: {
    nameVenture: '',
    brandStyle: '',
  },
  [CONSTANTS.TAGLINE_CONTEST]: {
    nameVenture: '',
    typeOfTagline: '',
  },
};

const ContestForm = (props) => {
  const {
    contestType,
    handleSubmit,
    formRef,
    defaultData,
    isEditContest: isEditProp,
  } = props;

  const dispatch = useDispatch();

  const { isFetching, error, data } = useSelector(
    (state) => state.dataForContest
  );
  const { isEditContest: isEditFromStore } = useSelector(
    (state) => state.contestByIdStore
  );

  const isEdit = isEditProp ?? isEditFromStore;

  const getPreference = useCallback(() => {
    switch (contestType) {
      case CONSTANTS.NAME_CONTEST:
        dispatch(
          getDataForContest({
            characteristic1: 'nameStyle',
            characteristic2: 'typeOfName',
          })
        );
        break;
      case CONSTANTS.TAGLINE_CONTEST:
        dispatch(getDataForContest({ characteristic1: 'typeOfTagline' }));
        break;
      case CONSTANTS.LOGO_CONTEST:
        dispatch(getDataForContest({ characteristic1: 'brandStyle' }));
        break;
      default:
        break;
    }
  }, [contestType, dispatch]);

  useEffect(() => {
    getPreference();
  }, [getPreference]);

  if (error) {
    return <TryAgain getData={getPreference} />;
  }

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <div className={styles.formContainer}>
      <Formik
        initialValues={{
          title: '',
          industry: '',
          focusOfWork: '',
          targetCustomer: '',
          file: '',
          domainOption: 'yes_variations',
          extensionOption: 'no_other_ext',
          ...variableOptions[contestType],
          ...defaultData,
        }}
        onSubmit={handleSubmit}
        validationSchema={Schems.ContestSchem}
        innerRef={formRef}
        enableReinitialize
      >
        {(formikProps) => (
          <Form>
            <div className={styles.inputContainer}>
              <span className={styles.inputHeader}>Title of contest</span>
              <FormInput
                name="title"
                type="text"
                label="Title"
                classes={{
                  container: styles.componentInputContainer,
                  input: styles.input,
                  warning: styles.warning,
                }}
              />
            </div>

            <div className={styles.inputContainer}>
              <SelectInput
                name="industry"
                classes={{
                  inputContainer: styles.selectInputContainer,
                  inputHeader: styles.selectHeader,
                  selectInput: styles.select,
                  warning: styles.warning,
                }}
                header="Describe industry associated with your venture"
                optionsArray={data.industry}
              />
            </div>

            <div className={styles.inputContainer}>
              <span className={styles.inputHeader}>
                What does your company / business do?
              </span>
              <FormTextArea
                name="focusOfWork"
                type="text"
                label="e.g. We're an online lifestyle brand..."
                classes={{
                  container: styles.componentInputContainer,
                  inputStyle: styles.textArea,
                  warning: styles.warning,
                }}
              />
            </div>

            <div className={styles.inputContainer}>
              <span className={styles.inputHeader}>
                Tell us about your customers
              </span>
              <FormTextArea
                name="targetCustomer"
                type="text"
                label="customers"
                classes={{
                  container: styles.componentInputContainer,
                  inputStyle: styles.textArea,
                  warning: styles.warning,
                }}
              />
            </div>

            <OptionalSelects
              contestType={contestType}
              dataForContest={{ data }}
            />

            <div className={styles.inputContainer}>
              {contestType === CONSTANTS.NAME_CONTEST && (
                <ContestButtonGroup
                  setFieldValue={formikProps.setFieldValue}
                  values={formikProps.values}
                />
              )}
            </div>

            <FieldFileInput
              name="file"
              classes={{
                fileUploadContainer: styles.fileUploadContainer,
                labelClass: styles.label,
                fileNameClass: styles.fileName,
                fileInput: styles.fileInput,
                warning: styles.warning,
              }}
              type="file"
            />

            {isEdit && (
              <button type="submit" className={styles.changeData}>
                Set Data
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContestForm;
