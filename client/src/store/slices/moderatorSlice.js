import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';

export const getModerationOffers = createAsyncThunk(
  'moderator/getOffers',
  async (data, { rejectWithValue }) => {
    try {
      const { data: response } = await restController.getOffersForModeration(
        data
      );
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const changeOfferStatus = createAsyncThunk(
  'moderator/changeStatus',
  async ({ offerId, command }, { rejectWithValue }) => {
    try {
      const { data } = await restController.approveOfferByModerator({
        offerId,
        command,
      });
      return { offerId, status: data.status };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const moderatorSlice = createSlice({
  name: 'moderator',
  initialState: { isFetching: false, error: null, offers: [], count: 0 },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getModerationOffers.pending, state => {
      state.isFetching = true;
    });
    builder.addCase(getModerationOffers.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.offers = payload.offers;
      state.count = payload.count;
    });
    builder.addCase(changeOfferStatus.fulfilled, (state, { payload }) => {
      state.offers = state.offers.filter(offer => offer.id !== payload.offerId);
      state.count -= 1;
    });
  },
});

export default moderatorSlice.reducer;
