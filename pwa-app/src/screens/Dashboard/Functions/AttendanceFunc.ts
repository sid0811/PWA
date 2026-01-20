import {
  getMultiDistributorUserId,
  insertRecordInOrderMasterForShopCheckIn,
} from '../../../database/SqlDatabase';
import {
  COLLECTION_TYPE,
  getAppOrderId,
  getCurrentDate,
  getCurrentDateTime,
} from '../../../utility/utils';

export async function insertAttendance(
  selectedItem: string,
  userId: string | number,
  latitude: string | number,
  longitude: string | number,
  t: any,
  _defaultDistributorId?: string | number,
) {
  const datee = await getCurrentDateTime();
  const datee1 = await getCurrentDate();

  if (selectedItem.length === 0) {
    // PWA: Use window.alert instead of RN Alert
    window.alert(t('Alerts.AlertUpdateTile'));
  } else {
    const uids: any = await getMultiDistributorUserId();
    console.log("Shankar Gade",selectedItem,userId,uids);


    if (uids.length > 0) {
      const promises = uids.map(async (uid: any) => {
        const app_order_id = await getAppOrderId(uid.Userid);
        return insertRecordInOrderMasterForShopCheckIn(
          app_order_id,
          datee,
          '1',
          '0',
          latitude,
          longitude,
          '0',
          datee1,
          datee1,
          COLLECTION_TYPE.ATTENDANCE_IN,
          uid.Userid,
          '',
          'N',
          selectedItem,
          datee,
          '0',
          datee,
          '0',
          datee,
          datee,
          uid.Userid,
        );
      });
      await Promise.all(promises);
    } else {
      const app_order_id = await getAppOrderId(userId);
      await insertRecordInOrderMasterForShopCheckIn(
        app_order_id,
        datee,
        '1',
        '0',
        latitude,
        longitude,
        '0',
        datee1,
        datee1,
        COLLECTION_TYPE.ATTENDANCE_IN,
        userId,
        '',
        'N',
        selectedItem,
        datee,
        '0',
        datee,
        '0',
        datee,
        datee,
        userId,
      );
    }
  }
}

export async function onEndDAY(
  userId: string | number,
  latitude: string | number,
  longitude: string | number,
  _defaultDistributorId?: string | number,
) {
  const datee = await getCurrentDateTime();
  const datee1 = await getCurrentDate();
  const uids: any = await getMultiDistributorUserId();

  if (uids.length > 0) {
    const promises = uids.map(async (uid: any) => {
      console.log('sHANKAR gADE', uids);
      console.log('sHANKAR gADE1', uids.Userid);
      const app_order_id = await getAppOrderId(uid.Userid);
      return insertRecordInOrderMasterForShopCheckIn(
        app_order_id,
        datee,
        '1',
        '0',
        latitude,
        longitude,
        '0',
        datee1,
        datee1,
        COLLECTION_TYPE.ATTENDANCE_OUT,
        uid.Userid,
        '',
        'N',
        'User Day Ended',
        datee,
        '0',
        datee,
        '0',
        datee,
        datee,
        uid.Userid,
      );
    });
    await Promise.all(promises);
  } else {
    const app_order_id = await getAppOrderId(userId);
    await insertRecordInOrderMasterForShopCheckIn(
      app_order_id,
      datee,
      '1',
      '0',
      latitude,
      longitude,
      '0',
      datee1,
      datee1,
      COLLECTION_TYPE.ATTENDANCE_OUT,
      userId,
      '',
      'N',
      'User Day Ended',
      datee,
      '0',
      datee,
      '0',
      datee,
      datee,
      userId,
    );
  }
}
