import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import {
  getContests as getContestsAction,
  clearContestsList,
  setNewCustomerFilter,
} from '../../../store/slices/contestsSlice';
import ContestsContainer from '../../ContestComponents/ContestsContainer/ContestsContainer';
import ContestBox from '../../ContestComponents/ContestBox/ContestBox';
import TryAgain from '../../TryAgain/TryAgain';
import CONSTANTS from '../../../constants';
import styles from './CustomerDashboard.module.sass';

const CustomerDashboard = ({ navigate }) => {
  const dispatch = useDispatch();

  const { contests, isFetching, error, haveMore, customerFilter } = useSelector(
    (state) => state.contestsList
  );

  const getContests = useCallback(() => {
    dispatch(clearContestsList());
    dispatch(
      getContestsAction({
        requestData: {
          limit: 8,
          contestStatus: customerFilter,
        },
        role: CONSTANTS.CUSTOMER,
      })
    );
  }, [dispatch, customerFilter]);

  const loadMore = (startFrom) => {
    dispatch(
      getContestsAction({
        requestData: {
          limit: 8,
          offset: startFrom,
          contestStatus: customerFilter,
        },
        role: CONSTANTS.CUSTOMER,
      })
    );
  };

  useEffect(() => {
    getContests();
  }, [getContests]);

  useEffect(() => {
    return () => {
      dispatch(clearContestsList());
    };
  }, [dispatch]);

  const goToExtended = (contest_id) => {
    navigate(`/contest/${contest_id}`);
  };

  const tryToGetContest = () => {
    getContests();
  };

  const newFilter = (filter) => {
    dispatch(setNewCustomerFilter(filter));
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.filterContainer}>
        {[
          { label: 'Active Contests', status: CONSTANTS.CONTEST_STATUS_ACTIVE },
          {
            label: 'Completed contests',
            status: CONSTANTS.CONTEST_STATUS_FINISHED,
          },
          {
            label: 'Inactive contests',
            status: CONSTANTS.CONTEST_STATUS_PENDING,
          },
        ].map((btn) => (
          <button
            key={btn.status}
            onClick={() => newFilter(btn.status)}
            className={classNames({
              [styles.activeFilter]: btn.status === customerFilter,
              [styles.filter]: btn.status !== customerFilter,
            })}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className={styles.contestsContainer}>
        {error ? (
          <TryAgain getData={tryToGetContest} />
        ) : (
          <ContestsContainer
            isFetching={isFetching}
            loadMore={loadMore}
            navigate={navigate}
            haveMore={haveMore}
          >
            {contests.map((contest) => (
              <ContestBox
                data={contest}
                key={contest.id}
                goToExtended={goToExtended}
              />
            ))}
          </ContestsContainer>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
