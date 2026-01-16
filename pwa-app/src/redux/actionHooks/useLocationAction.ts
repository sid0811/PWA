import {useDispatch} from 'react-redux';
import {
  setGlobalLocationUser,
  setIsBGLocGranted,
  setIsLocationGrant,
} from '../reducers/locationReducers';
import {useAppSelector} from '../store';

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

type Function = {
  globalLocation?: Location | GeoPosition;
  setGlobalLocation?: (val: Location | GeoPosition) => void;
  isBGLocationGranted?: boolean;
  setIsBGLocationGranted?: (val: boolean) => void;
  isLocationGranted?: boolean;
  setIsLocationGranted?: any;
};

/**
 *
 * @param dispatch is function
 * @param data payload data to sent to reducer
 */
export const useLocationAction = (): Function => {
  const dispatch = useDispatch();
  const setGlobalLocation = (payload: Location | GeoPosition) => {
    dispatch(setGlobalLocationUser(payload));
  };
  const setIsBGLocationGranted = (payload: boolean) => {
    dispatch(setIsBGLocGranted(payload));
  };
  const setIsLocationGranted = (payload: boolean) => {
    dispatch(setIsLocationGrant(payload));
  };

  const isLocationGranted = useAppSelector(
    state => state.locationReducer.isLocationGranted,
  );
  const globalLocation = useAppSelector(
    state => state.locationReducer.globalLocation,
  );
  const isBGLocationGranted = useAppSelector(
    state => state.locationReducer.isBGLocationGranted,
  );

  return {
    isLocationGranted,
    setIsLocationGranted,
    globalLocation,
    setGlobalLocation,
    isBGLocationGranted,
    setIsBGLocationGranted,
  };
};

export type LocationAction = ReturnType<typeof useLocationAction>;
