import {UserPreferenceKeys} from '../constants/asyncStorageKeys';
import cacheStorage from '../localstorage/secureStorage';
import {CODE_LIST} from '../constants/screenConstants';

export const versionChecking = (
  res: any,
  setClientBasedURL: any,
  setSavedApiVersionAction: (payload: string) => void,
  setSavedAppendedApiVersionAction: (payload: string) => void,
  showAlert: () => void,
  t: any,
) => {
  console.log('res?.data?.ApiURL, res?.data?.Message', res);

  cacheStorage.set(UserPreferenceKeys.BASE_URL, res?.data?.ApiURL);
  setClientBasedURL(res?.data?.ApiURL);
  setSavedApiVersionAction(res?.data?.ApiVersion ? res?.data?.ApiVersion : ''); //testing
  setSavedAppendedApiVersionAction(
    res?.data?.AppendVersion ? res?.data?.AppendVersion : '',
  ); //testing
  if (
    res?.data?.code &&
    res?.data?.code === CODE_LIST.VERSION_MISMATCH_FORCE_UPDATE
  ) {
    setSavedAppendedApiVersionAction('');
    showAlert(); // new ui for update instead of plan old alert TODO
    // PWA: Show alert for version mismatch
    const confirmUpdate = window.confirm(
      t?.('Alerts.AlertAuthUpdateTile') || 'Update Required' + '\n\n' +
      t?.('Alerts.AlertAuthUpdateMsg') || 'Please update the app to continue.'
    );
    if (confirmUpdate) {
      // PWA: Reload the page to get latest version
      window.location.reload();
    }
  }
};

export function stringToAscii(str: string) {
  let sumOfAllAscii = 0;
  for (let i = 0; i < str.length; i++) {
    sumOfAllAscii += str.charCodeAt(i);
  }
  return sumOfAllAscii;
}
