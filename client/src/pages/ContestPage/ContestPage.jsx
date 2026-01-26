import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import LightBox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import { goToExpandedDialog } from '../../store/slices/chatSlice';
import {
  getContestById,
  setOfferStatus,
  clearSetOfferStatusError,
  changeEditContest,
  changeContestViewMode,
  changeShowImage,
} from '../../store/slices/contestByIdSlice';
import Error from '../../components/Error/Error';
import TryAgain from '../../components/TryAgain/TryAgain';
import ContestSideBar from '../../components/ContestComponents/ContestSideBar/ContestSideBar';
import OfferBox from '../../components/OffersComponents/OfferBox/OfferBox';
import OfferForm from '../../components/OffersComponents/OfferForm/OfferForm';
import Brief from '../../components/Brief/Brief';
import Spinner from '../../components/Spinner/Spinner';
import CONSTANTS from '../../constants';
import styles from './ContestPage.module.sass';

const ContestPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const contestByIdStore = useSelector((state) => state.contestByIdStore);
  const userStore = useSelector((state) => state.userStore);
  const chatStore = useSelector((state) => state.chatStore);

  const {
    isShowOnFull,
    imagePath,
    error,
    isFetching,
    isBrief,
    contestData,
    offers,
    setOfferStatusError,
  } = contestByIdStore;

  const { role } = userStore.data;

  useEffect(() => {
    dispatch(getContestById({ contestId: id }));

    return () => {
      dispatch(changeEditContest(false));
    };
  }, [dispatch, id]);

  const needButtons = useCallback(
    (offerStatus) => {
      const contestCreatorId = contestData.User.id;
      const userId = userStore.data.id;
      const contestStatus = contestData.status;
      return (
        contestCreatorId === userId &&
        contestStatus === CONSTANTS.CONTEST_STATUS_ACTIVE &&
        offerStatus === CONSTANTS.OFFER_STATUS_PENDING
      );
    },
    [contestData, userStore.data.id]
  );

  const handleSetOfferStatus = (creatorId, offerId, command) => {
    dispatch(clearSetOfferStatusError());
    const { id, orderId, priority } = contestData;
    const obj = {
      command,
      offerId,
      creatorId,
      orderId,
      priority,
      contestId: id,
    };
    dispatch(setOfferStatus(obj));
  };

  const setOffersList = () => {
    if (offers.length === 0) {
      return (
        <div className={styles.notFound}>
          There is no suggestion at this moment
        </div>
      );
    }

    return offers.map((offer) => (
      <OfferBox
        data={offer}
        key={offer.id}
        needButtons={needButtons}
        setOfferStatus={handleSetOfferStatus}
        contestType={contestData.contestType}
        date={new Date()}
      />
    ));
  };

  const findConversationInfo = (interlocutorId) => {
    const { messagesPreview } = chatStore;
    const { id } = userStore.data;
    const participants = [id, interlocutorId];
    participants.sort(
      (participant1, participant2) => participant1 - participant2
    );

    for (let i = 0; i < messagesPreview.length; i++) {
      if (isEqual(participants, messagesPreview[i].participants)) {
        return {
          participants: messagesPreview[i].participants,
          _id: messagesPreview[i]._id,
          blackList: messagesPreview[i].blackList,
          favoriteList: messagesPreview[i].favoriteList,
        };
      }
    }
    return null;
  };

  const goChat = () => {
    const { User } = contestData;
    dispatch(
      goToExpandedDialog({
        interlocutor: User,
        conversationData: findConversationInfo(User.id),
      })
    );
  };

  return (
    <div>
      {isShowOnFull && (
        <LightBox
          mainSrc={`${CONSTANTS.publicURL}${imagePath}`}
          onCloseRequest={() =>
            dispatch(changeShowImage({ isShowOnFull: false, imagePath: null }))
          }
        />
      )}
      {error ? (
        <div className={styles.tryContainer}>
          <TryAgain
            getData={() => dispatch(getContestById({ contestId: id }))}
          />
        </div>
      ) : isFetching ? (
        <div className={styles.containerSpinner}>
          <Spinner />
        </div>
      ) : (
        <div className={styles.mainInfoContainer}>
          <div className={styles.infoContainer}>
            <div className={styles.buttonsContainer}>
              <span
                onClick={() => dispatch(changeContestViewMode(true))}
                className={classNames(styles.btn, {
                  [styles.activeBtn]: isBrief,
                })}
              >
                Brief
              </span>
              {role !== CONSTANTS.MODERATOR && (
                <span
                  onClick={() => dispatch(changeContestViewMode(false))}
                  className={classNames(styles.btn, {
                    [styles.activeBtn]: !isBrief,
                  })}
                >
                  Offer
                </span>
              )}
            </div>
            {isBrief ? (
              <Brief contestData={contestData} role={role} goChat={goChat} />
            ) : (
              <div className={styles.offersContainer}>
                {role === CONSTANTS.CREATOR &&
                  contestData.status === CONSTANTS.CONTEST_STATUS_ACTIVE && (
                    <OfferForm
                      contestType={contestData.contestType}
                      contestId={contestData.id}
                      customerId={contestData.User.id}
                      valid={true}
                    />
                  )}
                {setOfferStatusError && (
                  <Error
                    data={setOfferStatusError.data}
                    status={setOfferStatusError.status}
                    clearError={() => dispatch(clearSetOfferStatusError())}
                  />
                )}
                <div className={styles.offers}>{setOffersList()}</div>
              </div>
            )}
          </div>
          <div className={styles.sidebarWrapper}>
            <ContestSideBar
              contestData={contestData}
              totalEntries={offers.length}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestPage;
