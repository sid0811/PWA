import {createSlice} from '@reduxjs/toolkit';
import {reducerName} from '../../constants/reduxConstants';

// Web equivalent of RN Location types
interface Location {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

type GeoPosition = Location;

type INITIALSTATE = {
  isBGLocationGranted: boolean;
  isLocationGranted: boolean;
  globalLocation: Location | GeoPosition;
};

const INITIAL_STATE: INITIALSTATE = {
  isLocationGranted: true,
  globalLocation: {} as Location | GeoPosition,
  isBGLocationGranted: false,
};

const globalSlice = createSlice({
  name: reducerName.LOCATION_REDUCER,
  initialState: INITIAL_STATE,
  reducers: {
    setIsLocationGrant: (state, action) => {
      state.isLocationGranted = action.payload;
    },
    setGlobalLocationUser: (state, action) => {
      state.globalLocation = action.payload;
    },
    setIsBGLocGranted: (state, action) => {
      state.isBGLocationGranted = action.payload;
    },
  },
});

// destructure actions and reducer from the slice (or you can access as globalSlice.actions)
const {actions, reducer} = globalSlice;

// export individual action creator functions
export const {setIsLocationGrant, setGlobalLocationUser, setIsBGLocGranted} =
  actions;

export default reducer;
