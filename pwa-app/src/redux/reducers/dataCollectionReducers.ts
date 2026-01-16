import {createSlice} from '@reduxjs/toolkit';
import {reducerName} from '../../constants/reduxConstants';

// Helper function to format date like moment
const formatDate = (date: Date = new Date()): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

type INITIALSTATE = {
  dataCollectionType: string;
  fromDateDC: string;
  toDateDC: string;
};

const INITIAL_STATE: INITIALSTATE = {
  dataCollectionType: '1',
  fromDateDC: formatDate(),
  toDateDC: formatDate(),
};

const DataCollectionSlice = createSlice({
  name: reducerName.DATA_COLLECTION_REDUCER,
  initialState: INITIAL_STATE,
  reducers: {
    setCollectionType: (state, action) => {
      state.dataCollectionType = action.payload;
    },

    setDataCollFromDate: (state, action) => {
      state.fromDateDC = action.payload;
    },
    setDataCollToDate: (state, action) => {
      state.toDateDC = action.payload;
    },

    resetDataCollections: state => {
      state.dataCollectionType = '1';
      state.fromDateDC = formatDate();
      state.toDateDC = formatDate();
    },
  },
});

// destructure actions and reducer from the slice (or you can access as orderSlice.actions)
const {actions, reducer} = DataCollectionSlice;

// export individual action creator functions
export const {
  setCollectionType,
  setDataCollFromDate,
  setDataCollToDate,
  resetDataCollections,
} = actions;

export default reducer;
