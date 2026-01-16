import React, {useEffect, useState} from 'react';
import AppTextInput from '../../components/TextInput/TextInput';
import AppButton from '../../components/Button/Button';
import {Colors} from '../../theme/colors';
import {VERSION_DETAIL} from '../../constants/screenConstants';
import {useNavigate} from 'react-router-dom';

import {useLoginAction} from '../../redux/actionHooks/useLoginAction';
import Loader from '../../components/Loader/Loader';
import {useGlobleAction} from '../../redux/actionHooks/useGlobalAction';
import {useAuthentication} from '../../hooks/useAuthentication';
import {useNetInfo} from '../../hooks/useNetInfo';
import {LOGIN_BOX, writeActivityLog} from '../../utility/utils';
import {createTables} from '../../database/SqlDatabase';

// Web equivalent of heightPercentageToDP and widthPercentageToDP
const wp = (percentage: number) => `${percentage}vw`;
const hp = (percentage: number) => `${percentage}vh`;

interface props {
  navigation?: any;
}

function Login(_props: props) {
  const navigate = useNavigate();
  const {enteredUserName, userPassword, savedClientCode} = useLoginAction();
  const {setIsSplashShown} = useGlobleAction();
  const {doAuth} = useAuthentication();
  const {isNetConnected} = useNetInfo();

  const [user, setUser] = useState(enteredUserName);
  const [password, setPassword] = useState(userPassword);
  const [SCode, setScode] = useState(savedClientCode);
  const [loading, setLoading] = useState(false);
  const t = (key: string) => key; // PWA: Temporary placeholder for i18n

  useEffect(() => {
    setIsSplashShown?.(true);
  }, []);

  // PWA: Generate device ID for web
  const getDeviceID = async (): Promise<string> => {
    // Try to get existing device ID from localStorage
    let deviceId = localStorage.getItem('pwa_device_id');
    if (!deviceId) {
      // Generate a unique device ID for this browser
      deviceId = 'PWA_' + Math.random().toString(36).substring(2, 15) +
                 Math.random().toString(36).substring(2, 15) +
                 '_' + Date.now();
      localStorage.setItem('pwa_device_id', deviceId);
    }
    return deviceId;
  };

  const verifyLogin = async () => {
    if (isNetConnected) {
      writeActivityLog(`Logged In`);
      const deviceID = await getDeviceID();
      const FcmToken = ''; // PWA: FCM token not available in web, use empty string
      createTables();
      doAuth({
        user,
        password,
        SCode,
        deviceID,
        FcmToken,
        navigation: { navigate }, // PWA: Pass navigate function
        loaderState: (val: boolean) => {
          setLoading(val);
        },
        isLoginScreen: false, // PWA: Set to false to ensure data is inserted on login
        t,
      });
    } else {
      alert('No Internet Connection\n\nPlease check your internet connection and try again.');
    }
  };

  const mainContainerStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: Colors.loginBackgrnd,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const containerFormStyle: React.CSSProperties = {
    alignItems: 'center',
    marginTop: hp(7),
    display: 'flex',
    flexDirection: 'column',
  };

  const forgetTextStyle: React.CSSProperties = {
    color: Colors.buttonPrimary,
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: hp(3),
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
  };

  const logoStyle: React.CSSProperties = {
    width: hp(19.25),
    height: hp(23),
  };

  return (
    <>
      <Loader visible={loading} />
      <div style={mainContainerStyle}>
        {/* Logo */}
        <div style={logoContainerStyle}>
          <img
            src="/icons/icon-192x192.png"
            alt="Logo"
            style={logoStyle}
          />
        </div>

        <div style={containerFormStyle}>
          <AppTextInput
            height={LOGIN_BOX.Height}
            width={LOGIN_BOX.Width}
            marginVertical={hp(1.5)}
            placeholder="User"
            value={user}
            onChangeText={(txt: string) => setUser(txt)}
          />
          <AppTextInput
            height={LOGIN_BOX.Height}
            width={LOGIN_BOX.Width}
            marginVertical={hp(1.5)}
            placeholder="Password"
            value={password}
            isPassword={true}
            onChangeText={(txt: string) => setPassword(txt)}
          />
          <AppTextInput
            height={LOGIN_BOX.Height}
            width={LOGIN_BOX.Width}
            marginVertical={hp(1.5)}
            placeholder="Security Code"
            value={SCode}
            onChangeText={(txt: string) => setScode(txt)}
          />

          <AppButton
            title="Login"
            onPress={() => {
              verifyLogin();
            }}
            style={{marginTop: LOGIN_BOX.Height}}
            height={LOGIN_BOX.Height}
            width={LOGIN_BOX.Width}
          />

          <span style={forgetTextStyle}>
            Forgot User Id/ Password?
          </span>
          <div
            style={{
              alignSelf: 'flex-end',
              marginRight: wp(6),
            }}>
            <span style={forgetTextStyle}>{VERSION_DETAIL}</span>
          </div>
        </div>
        <div style={{paddingBottom: hp(12)}} />
      </div>
    </>
  );
}

export default Login;
