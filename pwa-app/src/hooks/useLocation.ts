import {useState, useEffect} from 'react';
import {useGlobleAction} from '../redux/actionHooks/useGlobalAction';
import {writeErrorLog} from '../utility/utils';
import {useLocationAction} from '../redux/actionHooks/useLocationAction';

const useLocation = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [error, setError] = useState('');
  const {geofenceGlobalSettingsAction} = useGlobleAction();
  const {setIsLocationGranted, isBGLocationGranted} = useLocationAction();

  useEffect(() => {
    const getCurrentLocation = async () => {
      if (
        isBGLocationGranted ||
        !geofenceGlobalSettingsAction?.IsGeoFencingEnabled
      ) {
        // geo fence setting is disabled then use this hook for other feature exection else if geofence is on till alert is not accepted block user to use.
        try {
          // Check if geolocation is supported
          if (!('geolocation' in navigator)) {
            setError('Geolocation is not supported by this browser');
            setIsLocationGranted(false);
            return;
          }

          navigator.geolocation.getCurrentPosition(
            position => {
              console.log('----------getCurrentPosition -->', position.coords);
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);
              setIsLocationGranted(true);
            },
            error => {
              // console.log('error on getting gelocation -->', error);

              // Location provider not available (error.code === 2). when users' device location is off
              if (error.code === 2) {
                // PWA: Show alert for location disabled
                alert(
                  'Location Disabled\n\nLocation services are currently disabled. This feature requires location access. Please enable it in your device settings.'
                );
              }
              setError(error.message);
              setIsLocationGranted(false);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        } catch (error) {
          writeErrorLog('getCurrentLocation', error);
          setError('An error occurred while fetching location');
        }
      }
    };
    getCurrentLocation();
  }, [isBGLocationGranted]);

  return {latitude, longitude, error};
};

export default useLocation;
