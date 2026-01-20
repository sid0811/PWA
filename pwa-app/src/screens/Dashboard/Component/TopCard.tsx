import React, {useState} from 'react';
import {FiMenu, FiMapPin, FiRefreshCw} from 'react-icons/fi';
import {useTranslation} from 'react-i18next';

import {Colors} from '../../../theme/colors';
import {useLoginAction} from '../../../redux/actionHooks/useLoginAction';
import {useGlobleAction} from '../../../redux/actionHooks/useGlobalAction';
import {useDashAction} from '../../../redux/actionHooks/useDashAction';
import CommonModal from './CommonModal';
import Loader from '../../../components/Loader/Loader';
import {
  attendanceList,
  writeActivityLog,
  writeErrorLog,
} from '../../../utility/utils';
import {getOnlineParentAreaData} from '../../../database/SqlDatabase';
import {insertAttendance, onEndDAY} from '../Functions/AttendanceFunc';
import useLocation from '../../../hooks/useLocation';

// Web equivalent of responsive screen utilities
const wp = (percentage: number) => `${percentage}vw`;
const hp = (percentage: number) => `${percentage}vh`;

interface props {
  navigation?: any;
  onMenuPress?: () => void;
  multiDivData?: any;
  isDataSynced?: boolean;
  lastSync?: string;
  SelectedDivison?: any;
  AttendanceMarked?: boolean;
  AttendanceEnd?: boolean;
  AttendanceDayEnd?: any;
  defaultDistributorId?: string | number;
}

function TopCard(props: props) {
  const {
    onMenuPress,
    multiDivData: _multiDivData,
    SelectedDivison: _SelectedDivison,
    isDataSynced,
    lastSync,
    AttendanceMarked,
    AttendanceEnd,
    AttendanceDayEnd,
  } = props;
  const {t} = useTranslation();
  const {latitude, longitude} = useLocation();

  const {userName, userId} = useLoginAction();

  const {
    isMultiDivision,
    setParentEnabled,
    setSyncFlag,
    syncFlag,
    isParentUser,
    setSelectedAreaID,
    isLogWritingEnabled,
    AttendanceOptions,
  } = useGlobleAction();
  const {UserDetails} = useDashAction();
  const [updateAttendanceUi, setUpdateAttendanceUi] = useState(0);

  const [locationArea, setLocationArea] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [isLocationModal, setIsLocationModal] = useState(false);

  const onLocationIconPress = async () => {
    setIsLocationModal(true);
    isParentUser && setModalVisible(true);

    getOnlineParentAreaData()
      .then((data: any) => {
        setLocationArea(data);
      })
      .catch(err => {
        writeErrorLog('getOnlineParentAreaData', err);
      });
  };

  const onAttendanceIconPress = async () => {
    isLogWritingEnabled && writeActivityLog(`Attendance Marked`);
    if (!AttendanceMarked) {
      setIsLocationModal(false);
      setModalVisible(true);
    } else if (AttendanceEnd && AttendanceMarked) {
      const confirmEnd = window.confirm(
        `${t('Alerts.AlertEndYourDayTitle')}\n\n${t('Alerts.AlertEndYourDayMsg')}`
      );
      if (confirmEnd) {
        await onEndDAY(userId, latitude, longitude);
        isLogWritingEnabled && writeActivityLog(`Attendance Out`);

        // Sync attendance
        setIsloading(true);
        try {
          var increment = updateAttendanceUi + 1;
          console.log('increment---', increment);
          setUpdateAttendanceUi(increment);
          setSyncFlag?.(!syncFlag);
        } finally {
          setIsloading(false);
        }
      }
    } else {
      alert(t('Alerts.AlertYouAlreadtEndedYourWorkDay'));
    }
  };

  async function doInsertAttendance(selectedItem: string) {
    await insertAttendance(selectedItem, userId, latitude, longitude, t);
    setModalVisible(false);

    // Sync attendance
    setIsloading(true);
    try {
      var increment = updateAttendanceUi + 1;
      console.log('increment11---', increment);
      setUpdateAttendanceUi(increment);
      setSyncFlag?.(!syncFlag);
    } finally {
      setIsloading(false);
    }
  }

  const insertArea = async (selectedItem: any) => {
    setParentEnabled?.(false);
    setModalVisible(false);
    await setSelectedAreaID?.(selectedItem?.AreaId);

    // Trigger sync and get data
    setIsloading(true);
    try {
      setSyncFlag?.(!syncFlag);
    } finally {
      setIsloading(false);
    }
    setModalVisible(false);
    setSyncFlag?.(!syncFlag);
  };

  // Styles
  const topContainerStyle: React.CSSProperties = {
    height: 'auto',
    backgroundColor: Colors.mainBackground,
    padding: '10px',
    borderBottomLeftRadius: isMultiDivision ? 0 : 35,
    borderBottomRightRadius: isMultiDivision ? 0 : 35,
    paddingBottom: isMultiDivision ? 10 : 25,
  };

  const iconContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(0.8),
  };

  const iconGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '15px',
  };

  const iconButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
  };

  const greetingStyle: React.CSSProperties = {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: wp(1.6),
  };

  const subTextStyle: React.CSSProperties = {
    color: Colors.lightGray,
    fontSize: 12,
    marginTop: hp(0.8),
    marginLeft: wp(1.6),
  };

  const highlightTextStyle: React.CSSProperties = {
    color: Colors.white,
  };

  // Attendance icon based on state
  const getAttendanceIcon = () => {
    if (AttendanceDayEnd?.length > 0) {
      return <span style={{fontSize: 24}}>✓</span>; // Day ended
    } else if (AttendanceMarked) {
      return <span style={{fontSize: 24, color: '#4CAF50'}}>●</span>; // Marked
    }
    return <span style={{fontSize: 24, color: '#FF9800'}}>○</span>; // Not marked
  };

  return (
    <>
      <Loader visible={isloading} />
      <div style={topContainerStyle}>
        <div style={iconContainerStyle}>
          <button
            style={iconButtonStyle}
            onClick={onMenuPress}
          >
            <FiMenu size={24} color={Colors.white} />
          </button>

          <div style={iconGroupStyle}>
            {/* Attendance Icon */}
            <button
              style={iconButtonStyle}
              onClick={onAttendanceIconPress}
              title={t('Dashboard.MarkAttendance')}
            >
              {getAttendanceIcon()}
            </button>

            {/* Sync Icon */}
            <button
              style={iconButtonStyle}
              onClick={() => {
                setSyncFlag?.(!syncFlag);
              }}
              title="Sync Status"
            >
              <FiRefreshCw
                size={22}
                color={isDataSynced ? '#4CAF50' : '#F44336'}
              />
            </button>

            {/* Location Icon */}
            <button
              style={iconButtonStyle}
              onClick={onLocationIconPress}
              title="Location"
            >
              <FiMapPin size={22} color={Colors.white} />
            </button>
          </div>
        </div>

        <div style={{marginLeft: wp(1.6)}}>
          <span style={greetingStyle}>
            {t('Common.Hello')}, {userName || 'User'}
          </span>

          <div style={{display: 'flex', flexDirection: 'row', ...subTextStyle}}>
            <span>{t('Dashboard.LastSync')}, </span>
            <span style={highlightTextStyle}>{lastSync || 'Never'}</span>
          </div>

          {updateAttendanceUi !== undefined && (
            <div style={{display: 'flex', flexDirection: 'row', ...subTextStyle, marginTop: 5}}>
              <span>{t('Dashboard.Attendance')}, </span>
              <span style={highlightTextStyle}>{UserDetails?.Attendance_at}</span>
            </div>
          )}
        </div>

        <CommonModal
          isModalOpen={modalVisible}
          isLocationOpen={isLocationModal}
          modalData={
            isLocationModal
              ? locationArea
              : AttendanceOptions?.length > 0
              ? AttendanceOptions
              : attendanceList
          }
          ddlabel={isLocationModal ? 'Area' : 'name'}
          onPress={(val: boolean) => {
            setModalVisible(val);
          }}
          onConfirm={(isLocOpen: boolean, selectedItem: any) => {
            isLocOpen
              ? insertArea(selectedItem)
              : doInsertAttendance(selectedItem);
          }}
          modalTitle={
            isLocationModal
              ? t('Dashboard.ConfirmLoc')
              : t('Dashboard.MarkAttendance')
          }
          dropdownTitle={
            isLocationModal
              ? t('Dashboard.ChooseArea')
              : t('Dashboard.StartDay')
          }
        />
      </div>
    </>
  );
}

export default TopCard;
