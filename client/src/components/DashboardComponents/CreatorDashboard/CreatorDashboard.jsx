import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import {
  getContests,
  clearContestsList,
  setNewCreatorFilter,
} from '../../../store/slices/contestsSlice';
import { getDataForContest } from '../../../store/slices/dataForContestSlice';
import ContestsContainer from '../../ContestComponents/ContestsContainer/ContestsContainer';
import ContestBox from '../../ContestComponents/ContestBox/ContestBox';
import TryAgain from '../../TryAgain/TryAgain';
import CONSTANTS from '../../../constants';
import styles from './CreatorDashboard.module.sass';

const types = [
  '',
  'name,tagline,logo',
  'name',
  'tagline',
  'logo',
  'name,tagline',
  'logo,tagline',
  'name,logo',
];

const CreatorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const { contests, error, haveMore, creatorFilter, isFetching } = useSelector(
    (state) => state.contestsList
  );
  const { data: dataForContest, isFetching: industryFetching } = useSelector(
    (state) => state.dataForContest
  );

  const [localContestId, setLocalContestId] = useState(
    creatorFilter.contestId || ''
  );

  const filterRef = useRef(creatorFilter);
  useEffect(() => {
    filterRef.current = creatorFilter;
  }, [creatorFilter]);

  useEffect(() => {
    dispatch(getDataForContest());
  }, [dispatch]);

  useEffect(() => {
    const queryParams = queryString.parse(search);

    const filterFromUrl = {
      typeIndex: parseInt(queryParams.typeIndex, 10) || 0,
      contestId: queryParams.contestId || '',
      industry: queryParams.industry || '',
      awardSort: queryParams.awardSort || 'asc',
      ownEntries: queryParams.ownEntries === 'true',
    };

    if (!isEqual(filterFromUrl, creatorFilter)) {
      dispatch(setNewCreatorFilter(filterFromUrl));
      dispatch(clearContestsList());
      dispatch(
        getContests({
          requestData: { limit: 8, offset: 0, ...filterFromUrl },
          role: CONSTANTS.CREATOR,
        })
      );
      setLocalContestId(filterFromUrl.contestId);
    }
  }, [search, dispatch]);

  const updateUrl = useCallback(
    (updatedParams) => {
      const cleanParams = {};
      Object.keys(updatedParams).forEach((key) => {
        const val = updatedParams[key];
        if (
          val !== '' &&
          val !== null &&
          val !== undefined &&
          val !== 0 &&
          val !== false &&
          val !== 'false'
        ) {
          cleanParams[key] = val;
        }
      });

      const newSearch = queryString.stringify(cleanParams);
      const currentSearch = search.replace('?', '');

      if (newSearch !== currentSearch) {
        navigate(`${pathname}${newSearch ? `?${newSearch}` : ''}`, {
          replace: true,
        });
      }
    },
    [navigate, pathname, search]
  );

  const changePredicate = (name, value) => {
    const newFilters = {
      ...filterRef.current,
      [name]: value,
    };
    updateUrl(newFilters);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localContestId !== filterRef.current.contestId) {
        changePredicate('contestId', localContestId);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localContestId]);

  const loadMore = (startFrom) => {
    dispatch(
      getContests({
        requestData: { limit: 8, offset: startFrom, ...creatorFilter },
        role: CONSTANTS.CREATOR,
      })
    );
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.filterContainer}>
        <span className={styles.headerFilter}>Filter Results</span>
        <div className={styles.inputsContainer}>
          <div
            onClick={() =>
              changePredicate('ownEntries', !creatorFilter.ownEntries)
            }
            className={classNames(styles.myEntries, {
              [styles.activeMyEntries]: creatorFilter.ownEntries,
            })}
          >
            My Entries
          </div>

          <div className={styles.inputContainer}>
            <span>By contest type</span>
            <select
              onChange={({ target }) =>
                changePredicate('typeIndex', types.indexOf(target.value))
              }
              value={types[creatorFilter.typeIndex] || ''}
              className={styles.input}
            >
              {types.map((el, i) => (
                <option key={i} value={el}>
                  {el === '' ? 'All Contest Types' : el}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputContainer}>
            <span>By contest ID</span>
            <input
              type="text"
              onChange={({ target }) => setLocalContestId(target.value)}
              value={localContestId}
              className={styles.input}
              placeholder="Enter ID..."
            />
          </div>

          {!industryFetching && dataForContest && (
            <div className={styles.inputContainer}>
              <span>By industry</span>
              <select
                onChange={({ target }) =>
                  changePredicate('industry', target.value)
                }
                value={creatorFilter.industry || ''}
                className={styles.input}
              >
                <option value="">Choose industry</option>
                {dataForContest.industry.map((ind, i) => (
                  <option key={i} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.inputContainer}>
            <span>By amount award</span>
            <select
              onChange={({ target }) =>
                changePredicate('awardSort', target.value)
              }
              value={creatorFilter.awardSort}
              className={styles.input}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className={styles.messageContainer}>
          <TryAgain
            getData={() =>
              dispatch(
                getContests({
                  requestData: { limit: 8, offset: 0, ...creatorFilter },
                  role: CONSTANTS.CREATOR,
                })
              )
            }
          />
        </div>
      ) : (
        <ContestsContainer
          isFetching={isFetching}
          loadMore={loadMore}
          haveMore={haveMore}
        >
          {contests.map((contest) => (
            <ContestBox
              data={contest}
              key={contest.id}
              goToExtended={(id) => navigate(`/contest/${id}`)}
            />
          ))}
        </ContestsContainer>
      )}
    </div>
  );
};

export default CreatorDashboard;
