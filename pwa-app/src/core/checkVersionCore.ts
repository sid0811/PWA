// utils/checkVersionCore.ts

import {getVersionForUpdate} from '../api/LoginAPICalls';
import {writeErrorLog} from '../utility/utils';

export type Pair = {
  isVersionUpdate: boolean;
  platfromUrl?: string;
};
interface CheckVersionParams {
  token: string;
  minVersion: number;
  callBack?: (pair:Pair) =>void
}

export const checkVersionCore = async ({
  token,
  minVersion,
  callBack
}: CheckVersionParams) => {
  try {
    const version = await getVersionForUpdate({authheader: token});
    console.log('Version', version);

    if (version && version >= minVersion) {
      // PWA: Always use web URL
      callBack?.({isVersionUpdate: true, platfromUrl: window.location.origin})
    }
    else{
      callBack?.({isVersionUpdate: false})
    }
  } catch (error) {
    writeErrorLog('checkVersionCore', error);
    console.log('Version check error →', error);
  }
};
