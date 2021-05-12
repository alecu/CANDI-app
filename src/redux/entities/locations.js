import { createSelector, createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call


// Create entity slice of the store
const slice = createSlice({
  name: "locations",
	initialState: {
    list: [],
    loading: false,
    loaded: false,
    lastFetch: null,
    failedAttempts: 0,
  },
  // Reducers - Events
  reducers: {
    locationsRequested: (locations, action) => {
      console.log(`${action.type} Dispatched...`)
      locations.loading = true;
    },
    locationsReceived: (locations, action) => {
      console.log(`${action.type} Dispatched...`);
      locations.list = action.payload;
      locations.loading = false;
      locations.lastFetch = Date.now();
      locations.loaded = true;
    },
    locationsRequestFailed: (locations, action) => {
      console.log(`${action.type} Dispatched`);
      locations.failedAttempts++;
      locations.loading = false;
    },
    locationAdded: (locations, action) => {
      console.log(`${action.type} Dispatched`)
      locations.list.push(action.payload);
    },
    locationDeleted: (locations, action) => {
      console.log(`${action.type} Dispatched`)
      const index = locations.list.findIndex(el => el._id === action.payload._id);
      locations.list.splice(index, 1);
    },
    locationUpdated: (locations, action) => {
      console.log(`${action.type} Dispatched`)
      const index = locations.list.findIndex(el => el._id === action.payload._id);
      locations.list[index] = action.payload;
    }
  }
});

// Action Export
export const {
  locationAdded,
  locationDeleted,
  locationsReceived,
  locationsRequested,
  locationsRequestFailed,
  locationUpdated
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/locations`;

// Selector
export const getMyLocation = createSelector(
  state => state.locations.list,
  state => state.auth.user,
  (locations, user) => locations.find(
    char => char.username === user.username
  )
);

// locations Loader into state
export const loadLocations = payload => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      data: payload,
      onStart:locationsRequested.type,
      onSuccess: locationsReceived.type,
      onError:locationsRequestFailed.type
    })
  );
};