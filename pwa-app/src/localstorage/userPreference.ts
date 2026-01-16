import moment from 'moment';
import cacheStorage from './secureStorage';
import { writeErrorLog } from '../utility/utils';

const expiryInMinutes = 5;

const storeCache = async (key: string, value: any) => {
  try {
    const item = {
      value,
      timestamp: Date.now(),
    };
    // console.log('stored cccahee--->', item);
    cacheStorage.set(key, item);
  } catch (error) {
    writeErrorLog('storeCache', error);
    console.log('error set cache-->', error);
  }
};

const getCache = async (key: string) => {
  try {
    const value = await cacheStorage.getObject(key);
    const item = JSON.parse(value);

    if (!item) return null;

    const now = moment(Date.now());
    const storedTime = moment(item.timestamp);
    const isExpired = now.diff(storedTime, 'minutes') > expiryInMinutes;

    if (isExpired) {
      await cacheStorage.remove(key);
      return null;
    }

    return item.value;
  } catch (error) {
    writeErrorLog('getCache', error);
    console.log('error get cache-->', error);
  }
};

export default {
  storeCache,
  getCache,
};
