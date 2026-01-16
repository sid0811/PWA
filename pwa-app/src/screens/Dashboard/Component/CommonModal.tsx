import React, {useState} from 'react';
import {Colors} from '../../../theme/colors';
import Dropdown from '../../../components/Dropdown/Dropdown';
import {useGlobleAction} from '../../../redux/actionHooks/useGlobalAction';

// Web equivalent of responsive screen utilities
const wp = (percentage: number) => `${percentage}vw`;
const hp = (percentage: number) => `${percentage}vh`;

interface props {
  onPress: (val: boolean) => void;
  onConfirm: (isLocationOpen: boolean, selectedItem: any) => void;
  isModalOpen: boolean;
  isLocationOpen?: boolean;
  modalTitle?: string;
  dropdownTitle?: string;
  ddlabel: string;
  icon?: string;
  modalData?: any[];
}

function CommonModal(props: props) {
  const {
    isModalOpen,
    onPress,
    onConfirm,
    isLocationOpen,
    modalTitle,
    icon: _icon,
    dropdownTitle,
    ddlabel,
    modalData,
  } = props;

  const {isParentUser} = useGlobleAction();
  const [selectedAtten, setSelectedAtten] = useState<any>('');
  const [selectedArea, setSelectedArea] = useState<any>({});

  if (!isModalOpen) return null;

  // Styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalViewStyle: React.CSSProperties = {
    width: hp(50),
    minHeight: hp(45),
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
  };

  const modalTextStyle: React.CSSProperties = {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.PinkColor,
    fontSize: 16,
    marginTop: hp(2),
  };

  const iconContainerStyle: React.CSSProperties = {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: 40,
    color: Colors.mainBackground,
  };

  const iconShadowStyle: React.CSSProperties = {
    width: wp(14),
    height: hp(2),
    borderRadius: '50%',
    backgroundColor: Colors.DarkBrown,
    opacity: 0.1,
    marginTop: -10,
    transform: 'scaleX(2)',
  };

  const dropdownContainerStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: 20,
  };

  const headingTitleStyle: React.CSSProperties = {
    color: Colors.DarkBrown,
    fontWeight: 'bold',
    fontFamily: 'Proxima Nova, sans-serif',
    marginLeft: wp(1),
    marginRight: wp(1),
    fontSize: 12,
    marginBottom: 10,
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  };

  const confirmButtonStyle: React.CSSProperties = {
    backgroundColor: '#2FC36E',
    borderRadius: 24,
    width: 132,
    height: 40,
    border: 'none',
    cursor: 'pointer',
    marginBottom: hp(2),
  };

  const confirmTextStyle: React.CSSProperties = {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  };

  const cancelTextStyle: React.CSSProperties = {
    color: '#362828',
    fontWeight: 'bold',
    fontSize: 12,
    cursor: 'pointer',
    marginTop: hp(1),
    background: 'none',
    border: 'none',
  };

  const noDataTextStyle: React.CSSProperties = {
    color: Colors.iconRed,
    marginTop: hp(5),
    textAlign: 'center',
  };

  return (
    <div style={overlayStyle} onClick={() => onPress(false)}>
      <div style={modalViewStyle} onClick={(e) => e.stopPropagation()}>
        <span style={modalTextStyle}>{modalTitle}</span>

        <div style={iconContainerStyle}>
          <span style={iconStyle}>
            {isLocationOpen ? '📍' : '✋'}
          </span>
          <div style={iconShadowStyle} />
        </div>

        <div style={dropdownContainerStyle}>
          <span style={headingTitleStyle}>{dropdownTitle}</span>

          {isLocationOpen ? (
            isParentUser ? (
              <Dropdown
                CustomDDStyle={{width: wp(70)}}
                ddItemStyle={{width: wp(70)}}
                label={ddlabel}
                data={modalData || []}
                onPressItem={(val: any) =>
                  isLocationOpen ? setSelectedArea(val) : setSelectedAtten(val)
                }
                selectedValue={
                  isLocationOpen ? selectedArea?.Area : selectedAtten?.name
                }
              />
            ) : (
              <span style={noDataTextStyle}>
                No Data is Available for the Executive!
              </span>
            )
          ) : (
            <Dropdown
              CustomDDStyle={{width: wp(70)}}
              ddItemStyle={{width: wp(70)}}
              label={ddlabel}
              data={modalData || []}
              onPressItem={(val: any) =>
                isLocationOpen ? setSelectedArea(val) : setSelectedAtten(val)
              }
              selectedValue={
                isLocationOpen ? selectedArea?.Area : selectedAtten?.name
              }
            />
          )}
        </div>

        <div style={buttonContainerStyle}>
          <button
            style={confirmButtonStyle}
            onClick={() => {
              onConfirm(
                !!isLocationOpen,
                isLocationOpen ? selectedArea : selectedAtten?.name
              );
            }}
          >
            <span style={confirmTextStyle}>Confirm</span>
          </button>

          <button
            style={cancelTextStyle}
            onClick={() => onPress(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommonModal;
