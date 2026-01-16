import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {useLoginAction} from '../../redux/actionHooks/useLoginAction';
import {useGlobleAction} from '../../redux/actionHooks/useGlobalAction';
import {useAuthentication} from '../../hooks/useAuthentication';
import {createTables} from '../../database/SqlDatabase';
import {DATABASE_VERSION} from '../../utility/utils';

// Web equivalent of heightPercentageToDP and widthPercentageToDP
const hp = (percentage: number) => `${percentage}vh`;
const wp = (percentage: number) => `${percentage}vw`;

const SplashScreen = () => {
  const navigate = useNavigate();
  const {doAuth} = useAuthentication();
  const {enteredUserName, userPassword, deviceId, savedClientCode} =
    useLoginAction();
  const {isLoggedin, setIsSplashShown, geofenceGlobalSettingsAction: _geofenceGlobalSettingsAction} =
    useGlobleAction();
  const t = (key: string) => key; // PWA: Temporary placeholder for i18n

  useEffect(() => {
    console.log('🚀 handleNavigation start');
    const handleNavigation = async () => {
      console.log('🚀 handleNavigation in');

      var timeDealy = 2200;
      const timer = setTimeout(() => {
        if (isLoggedin) {
          checkAndMigrateDatabase();
          navigate('/dashboard', { replace: true });
        } else {
          setIsSplashShown?.(true);
          navigate('/login', { replace: true });
        }
      }, timeDealy);
      return () => clearTimeout(timer);
    };
    handleNavigation();
  }, []);

  const checkAndMigrateDatabase = async () => {
    try {
      // PWA: Create tables if not exists
      await createTables();
      console.log('PWA: Database tables created/verified');

      // Check if we need to re-authenticate (version upgrade)
      const storedVersion = localStorage.getItem('db_version');
      const currentVersion = storedVersion ? parseInt(storedVersion) : 0;

      if (currentVersion < DATABASE_VERSION) {
        console.log('PWA: Database version upgrade needed', currentVersion, '->', DATABASE_VERSION);
        doAuthentication();
        localStorage.setItem('db_version', String(DATABASE_VERSION));
      }
    } catch (error) {
      console.error('PWA: Error checking database:', error);
    }
  };

  const doAuthentication = async () => {
    doAuth({
      user: enteredUserName,
      password: userPassword,
      SCode: savedClientCode,
      deviceID: deviceId,
      FcmToken: '', // PWA: No FCM token in web
      t,
    });
  };

  console.log('I am Splash');

  const splashContainerStyle: React.CSSProperties = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    height: '100vh',
    width: '100vw',
  };

  const logoViewStyle: React.CSSProperties = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    height: hp(100),
    width: wp(100),
    backgroundImage: 'linear-gradient(to bottom, #FAF9F9, #E8E8E8)',
  };

  const logoContainerStyle: React.CSSProperties = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: hp(12),
    display: 'flex',
    flexDirection: 'column',
  };

  const logoStyle: React.CSSProperties = {
    width: hp(19.25),
    height: hp(23),
  };

  return (
    <div style={splashContainerStyle}>
      <div style={logoViewStyle}>
        <div style={logoContainerStyle}>
          <img
            style={logoStyle}
            src="/icons/icon-192x192.png"
            alt="Logo"
          />
          <span style={{color: 'black', marginTop: 10}}>
            Salesforce Automation App
          </span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
