import {useLoginAction} from '../redux/actionHooks/useLoginAction';
import {useGlobleAction} from '../redux/actionHooks/useGlobalAction';
// import {useTranslation} from 'react-i18next'; // PWA: i18n to be added
import {getDataCore} from '../core/getDataCore';

export const useGetData = () => {
  // const {t} = useTranslation(); // PWA: i18n to be added
  const t = (key: string) => key; // PWA: Temporary placeholder
  const {enteredUserName, userPassword, savedClientCode, deviceId, userId} =
    useLoginAction();
  const globalActions = useGlobleAction();

  const doGetData = async (params: {
    isFromScreen: boolean;
    loaderState?: (flag: boolean) => void;
    isAreaIdChanged?: boolean;
    changedAreaId?: string;
    onComplete?: () => void; // ✅ Add optional completion callback
  }) => {
    const {onComplete, ...otherParams} = params;

    await getDataCore({
      ...otherParams,
      enteredUserName,
      userPassword,
      savedClientCode,
      deviceId,
      userId,
      globalActions,
      showSuccessAlert: msg => {
        // PWA: Use window.alert instead of RN Alert
        alert(t('Alerts.AlertUseGetDataMsg') || msg);
        // ✅ Call completion callback if provided
        onComplete?.();
      },
    });
  };

  return {doGetData};
};
