import React, {useState} from 'react';
import {FiMenu, FiMapPin, FiRefreshCw} from 'react-icons/fi';
import moment from 'moment';

import {Colors} from '../../../theme/colors';
import {useLoginAction} from '../../../redux/actionHooks/useLoginAction';
import {useGlobleAction} from '../../../redux/actionHooks/useGlobalAction';
import {useDashAction} from '../../../redux/actionHooks/useDashAction';
import CommonModal from './CommonModal';
import Loader from '../../../components/Loader/Loader';
import {
  attendanceList,
  writeActivityLog,
  getCurrentDateTime,
  getCurrentDate,
} from '../../../utility/utils';
import {insertAttendance, insertuses_log} from '../../../database/SqlDatabase';

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

  const {userName, userId} = useLoginAction();
  const {
    isMultiDivision,
    isParentUser,
    AttendanceOptions,
    setSyncFlag,
    syncFlag,
  } = useGlobleAction();
  const {
    UserDetails,
    setIsAttDone,
    setIsAttendOut,
  } = useDashAction();

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationModal, setIsLocationModal] = useState(false);
  const [locationArea, _setLocationArea] = useState([]);

  const onLocationIconPress = async () => {
    setIsLocationModal(true);
    if (isParentUser) {
      setModalVisible(true);
      // PWA: Fetch location area data from API
      // getOnlineParentAreaData().then(setLocationArea);
    }
  };

  const onAttendanceIconPress = async () => {
    writeActivityLog(`Attendance Pressed`);
    if (!AttendanceMarked) {
      setIsLocationModal(false);
      setModalVisible(true);
    } else if (AttendanceEnd && AttendanceMarked) {
      const confirmEnd = window.confirm(
        'End Your Day?\n\nAre you sure you want to end your day?'
      );
      if (confirmEnd) {
        await doEndDay();
      }
    } else {
      alert('You have already ended your work day.');
    }
  };

  /**
   * Mark attendance and insert into database
   */
  const doInsertAttendance = async (selectedItem: string) => {
    setIsLoading(true);
    try {
      const currentDate = await getCurrentDate();
      const currentDateTime = await getCurrentDateTime();

      // Get current location if available
      let latitude: number | null = null;
      let longitude: number | null = null;

      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            });
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch (geoError) {
          console.log('Geolocation error:', geoError);
        }
      }

      // Insert attendance record
      await insertAttendance(
        userId,
        'IN',
        currentDate,
        moment().format('HH:mm:ss'),
        latitude,
        longitude,
        selectedItem, // Remark (attendance type like "Local Market")
        0 // Not day end
      );

      // Log the activity
      await insertuses_log(userId, `Attendance Marked: ${selectedItem}`, currentDateTime);

      // Update redux state
      setIsAttDone?.(true);

      // Trigger sync
      setSyncFlag?.(!syncFlag);

      writeActivityLog(`Attendance Marked: ${selectedItem}`);
      alert(`Attendance marked successfully!\nType: ${selectedItem}`);
    } catch (error) {
      console.error('Error marking attendance:', error);
      writeActivityLog(`Attendance Error: ${error}`);
      alert('Failed to mark attendance. Please try again.');
    } finally {
      setModalVisible(false);
      setIsLoading(false);
    }
  };

  /**
   * End day attendance
   */
  const doEndDay = async () => {
    setIsLoading(true);
    try {
      const currentDate = await getCurrentDate();
      const currentDateTime = await getCurrentDateTime();

      // Get current location if available
      let latitude: number | null = null;
      let longitude: number | null = null;

      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            });
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch (geoError) {
          console.log('Geolocation error:', geoError);
        }
      }

      // Insert attendance out record
      await insertAttendance(
        userId,
        'OUT',
        currentDate,
        moment().format('HH:mm:ss'),
        latitude,
        longitude,
        'Day End',
        1 // Is day end
      );

      // Log the activity
      await insertuses_log(userId, 'Attendance Out - Day Ended', currentDateTime);

      // Update redux state
      setIsAttendOut?.(true);

      // Trigger sync
      setSyncFlag?.(!syncFlag);

      writeActivityLog('Day Ended');
      alert('Day ended successfully!');
    } catch (error) {
      console.error('Error ending day:', error);
      writeActivityLog(`Day End Error: ${error}`);
      alert('Failed to end day. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const insertArea = async (selectedItem: any) => {
    console.log('Area selected:', selectedItem);
    setModalVisible(false);
    // PWA: Handle area change - will implement with full area functionality
    alert(`Area selected: ${selectedItem?.Area || selectedItem}`);
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
      <Loader visible={isLoading} />
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
              title="Mark Attendance"
            >
              {getAttendanceIcon()}
            </button>

            {/* Sync Icon */}
            <button
              style={iconButtonStyle}
              onClick={() => {
                setSyncFlag?.(!syncFlag);
                alert('Sync triggered');
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
            Hello, {userName || 'User'}
          </span>

          <div style={{display: 'flex', flexDirection: 'row', ...subTextStyle}}>
            <span>Last Sync: </span>
            <span style={highlightTextStyle}>{lastSync || 'Never'}</span>
          </div>

          {UserDetails?.Attendance_at && (
            <div style={{display: 'flex', flexDirection: 'row', ...subTextStyle, marginTop: 5}}>
              <span>Attendance: </span>
              <span style={highlightTextStyle}>{UserDetails.Attendance_at}</span>
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
          onPress={(val: boolean) => setModalVisible(val)}
          onConfirm={(isLocOpen: boolean, selectedItem: any) => {
            isLocOpen ? insertArea(selectedItem) : doInsertAttendance(selectedItem);
          }}
          modalTitle={isLocationModal ? 'Confirm Location' : 'Mark Attendance'}
          dropdownTitle={isLocationModal ? 'Choose Area' : 'Start Your Day'}
        />
      </div>
    </>
  );
}

export default TopCard;
