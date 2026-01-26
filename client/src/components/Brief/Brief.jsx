import { useSelector, useDispatch } from 'react-redux';
import {
  updateContest,
  clearContestUpdationStore,
} from '../../store/slices/contestUpdationSlice';
import { changeEditContest as changeEditContestAction } from '../../store/slices/contestByIdSlice';
import ContestForm from '../ContestComponents/ContestForm/ContestForm';
import ContestInfo from '../ContestComponents/Contest/ContestInfo/ContestInfo';
import Error from '../Error/Error';
import styles from './Brief.module.sass';

const Brief = ({ contestData, role, goChat }) => {
  const dispatch = useDispatch();

  const { isEditContest } = useSelector((state) => state.contestByIdStore);
  const { error } = useSelector((state) => state.contestUpdationStore);
  const { id: userId } = useSelector((state) => state.userStore.data);

  const setNewContestData = (values) => {
    const data = new FormData();
    Object.keys(values).forEach((key) => {
      if (key !== 'file' && values[key]) {
        data.append(key, values[key]);
      }
    });

    if (values.file instanceof File) {
      data.append('file', values.file);
    }

    data.append('contestId', contestData.id);

    dispatch(updateContest(data));
  };

  const getContestObjInfo = () => {
    const {
      focusOfWork,
      industry,
      nameVenture,
      styleName,
      targetCustomer,
      title,
      brandStyle,
      typeOfName,
      typeOfTagline,
      originalFileName,
      contestType,
    } = contestData;

    const data = {
      focusOfWork,
      industry,
      nameVenture,
      styleName,
      targetCustomer,
      title,
      brandStyle,
      typeOfName,
      typeOfTagline,
      originalFileName,
      contestType,
    };

    const defaultData = {};
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        if (key === 'originalFileName') {
          defaultData.file = { name: data[key] };
        } else {
          defaultData[key] = data[key];
        }
      }
    });
    return defaultData;
  };

  const handleChangeEditMode = (data) => {
    dispatch(changeEditContestAction(data));
  };

  if (!isEditContest) {
    return (
      <ContestInfo
        userId={userId}
        contestData={contestData}
        changeEditContest={handleChangeEditMode}
        role={role}
        goChat={goChat}
      />
    );
  }

  return (
    <div className={styles.contestForm}>
      {error && (
        <Error
          data={error.data}
          status={error.status}
          clearError={() => dispatch(clearContestUpdationStore())}
        />
      )}
      <ContestForm
        contestType={contestData.contestType}
        defaultData={getContestObjInfo()}
        handleSubmit={setNewContestData}
      />
    </div>
  );
};

export default Brief;
