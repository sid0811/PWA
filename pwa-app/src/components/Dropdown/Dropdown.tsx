import React, {useRef, useState} from 'react';
import { FiChevronDown, FiChevronUp, FiCheck, FiMenu } from 'react-icons/fi';
import {Colors} from '../../theme/colors';
import {useGlobleAction} from '../../redux/actionHooks/useGlobalAction';

// Web equivalent of responsive screen utilities
const wp = (percentage: number) => `${percentage}vw`;
const hp = (percentage: number) => `${percentage}vh`;

interface DropDownProps {
  isDropDownOpen?: boolean;
  width?: string;
  mainStyle?: React.CSSProperties;
  data?: Array<any> | undefined;
  ddStyle?: React.CSSProperties;
  CustomDDStyle?: React.CSSProperties;
  ddItemStyle?: React.CSSProperties;
  ddSeparatorStyle?: React.CSSProperties;
  selectedTextStyle?: React.CSSProperties;
  selectedValue?: string;
  label: any;
  leftIcon?: boolean;
  title?: any;
  placeHolder?: any;
  onPressItem?: (data?: string | string[]) => void;
  isTitleShown?: boolean;
  selectedListIsScrollView?: boolean;
  isSearchable?: boolean; // for conditional search
  searchBoxStyle?: React.CSSProperties;
  isVoiceRecognitionActive?: boolean;
  multiSelect?: boolean; // New prop for multi-select
}
const Dropdown = (prop: DropDownProps) => {
  const {
    //isDropDownOpen = true,
    mainStyle,
    data = [],
    CustomDDStyle,
    ddSeparatorStyle: _ddSeparatorStyle,
    placeHolder = 'Select',
    ddItemStyle,
    selectedValue,
    label = 'title',
    selectedTextStyle,
    title,
    leftIcon,
    onPressItem,
    isTitleShown = true,
    selectedListIsScrollView: _selectedListIsScrollView = false,
    isSearchable = false,
    searchBoxStyle,
    isVoiceRecognitionActive: _isVoiceRecognitionActive = false,
    multiSelect = false, // New prop for multi-select
  } = prop;
  const {isDarkMode: _isDarkMode} = useGlobleAction();

  const [isDropDownOpen, seIsDropDownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const [parentwidth, setParentWidth] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Array<any>>( // State for multi-select items
    Array.isArray(selectedValue) ? selectedValue : [],
  );

  const chnageDdState = () => {
    seIsDropDownOpen(!isDropDownOpen);
    if (ref.current) {
      setParentWidth(ref.current.offsetWidth);
    }
  };

  const toggleSelection = (item: any) => {
    setSelectedItems(prevSelectedItems => {
      let updatedSelectedItems: any;

      if (multiSelect) {
        // Multi-select mode: add or remove the item based on its presence
        updatedSelectedItems = prevSelectedItems.some(
          i => i[label] === item[label],
        )
          ? prevSelectedItems.filter(i => i[label] !== item[label])
          : [...prevSelectedItems, item];

        // Use setTimeout to call onPressItem with the updated array in multi-select mode
        if (onPressItem) {
          setTimeout(() => onPressItem(updatedSelectedItems), 0);
        }
      } else {
        // Single selection mode: update selectedItems with a single item
        updatedSelectedItems = [item];
        chnageDdState(); // Close dropdown for single select

        // Call onPressItem with only the single selected item (not as an array)
        if (onPressItem) {
          setTimeout(() => onPressItem(item), 0);
        }
      }

      console.log('updatedSelectedItems -->', updatedSelectedItems);
      return updatedSelectedItems;
    });
  };

  const ListItem = ({item}: {item: any}) => {
    const isSelected = selectedItems.some(
      selected => selected[label] === item[label],
    );

    const itemContainerStyle: React.CSSProperties = {
      padding: 8,
      zIndex: 100,
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isSelected ? Colors.lightGray : 'transparent',
    };

    return (
      <div
        style={itemContainerStyle}
        onClick={() => toggleSelection(item)}>
        <span style={{color: Colors.black}}>{item[label] || 'Select'}</span>
        {multiSelect && isSelected && (
          <FiCheck size={18} color={Colors.primary} />
        )}
      </div>
    );
  };

  const dropDownContainerStyle: React.CSSProperties = {
    zIndex: 1,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: Colors.border,
    borderRadius: 12,
    width: wp(88),
    height: hp(7),
    paddingRight: wp(3),
    backgroundColor: Colors.white,
    paddingLeft: hp(2),
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    display: 'flex',
    cursor: 'pointer',
    ...CustomDDStyle,
  };

  const ddStyle: React.CSSProperties = {
    zIndex: 5,
    width: parentwidth || wp(88),
    height: 120,
    position: 'absolute',
    top: isSearchable ? 40 : 0,
    left: 23,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.border,
    borderRadius: 12,
    paddingLeft: hp(2),
    paddingRight: hp(2),
    overflowY: 'auto',
    ...ddItemStyle,
  };

  const searchInputStyle: React.CSSProperties = {
    position: 'absolute',
    width: parentwidth || wp(88),
    height: 40,
    left: 16,
    zIndex: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.border,
    paddingLeft: hp(2),
    paddingRight: hp(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '1%',
    marginLeft: '1.9%',
    ...searchBoxStyle,
  };

  const selectedTextStyleDefault: React.CSSProperties = {
    color: Colors.darkGray,
    alignSelf: 'center',
    marginLeft: 20,
    ...selectedTextStyle,
  };

  return (
    <div style={mainStyle}>
      {isTitleShown && <span style={{alignSelf: 'flex-start'}}>{title}</span>}
      <div
        style={dropDownContainerStyle}
        onClick={() => {
          chnageDdState();
        }}
        ref={ref}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {leftIcon ? (
              <FiMenu size={18} />
            ) : null}
            <span style={selectedTextStyleDefault}>
              {multiSelect
                ? selectedItems.length > 0
                  ? selectedItems.map(item => item[label]).join(', ')
                  : placeHolder
                : selectedValue || placeHolder}
            </span>
          </div>
          {isDropDownOpen ? (
            <FiChevronUp size={18} color={Colors.primary} />
          ) : (
            <FiChevronDown size={18} color={Colors.primary} />
          )}
        </div>
      </div>
      {!isDropDownOpen ? null : (
        <div style={{position: 'relative'}}>
          {isSearchable && ( // Conditionally render search input field
            <div style={searchInputStyle}>
              <input
                style={{flex: 0.9, border: 'none', outline: 'none'}}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          <div style={ddStyle}>
            {data
              .filter(item =>
                item[label]?.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              ?.map((item: any, index: any) => (
                <ListItem item={item} key={index} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
