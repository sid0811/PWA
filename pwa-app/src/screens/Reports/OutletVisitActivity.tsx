import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import moment from 'moment';
import {FiChevronRight} from 'react-icons/fi';

import {Loader} from '../../components';
import ReportHeader from '../../components/ReportHeader/ReportHeader';
import {checkorderbookeddetails} from '../../database/SqlDatabase';
import {useLoginAction} from '../../redux/actionHooks/useLoginAction';
import {Colors} from '../../theme/colors';

interface ActivityItem {
  from_date: string;
  ActivityStart: string;
  ActivityEnd: string;
  collection_type: number;
  Item: string;
  quantity_one: string;
  quantity_two: string;
  small_Unit: string;
  large_Unit: string;
  Amount: string;
}

const OutletVisitActivity: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {userId} = useLoginAction();

  const {Party, entity_id} = (location.state as any) || {};

  const [dataOrder, setDataOrder] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number[]>([]);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    if (!entity_id || !userId) return;

    setIsLoading(true);
    try {
      const data = await checkorderbookeddetails(entity_id, userId);

      if (data) {
        setDataOrder(data);
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique dates
  const uniqueDates = [...new Set(dataOrder.map((e) => e.from_date))];

  const getActivityTypeLabel = (type: number): string => {
    switch (type) {
      case 0: return 'ORDER BOOKED';
      case 1: return 'DATA COLLECTED';
      case 2: return 'DATA COLLECTED';
      case 3: return 'IMAGE TAKEN';
      case 4: return 'CHECK IN';
      case 5: return 'Asset Verified';
      case 6: return 'ACTIVITY DONE';
      case 7: return 'COLLECTION';
      case 8: return 'USER DAY STARTED';
      case 9: return 'USER DAY END';
      default: return '';
    }
  };

  const toggleExpand = (index: number) => {
    if (openIndex.includes(index)) {
      setOpenIndex([]);
    } else {
      setOpenIndex([index]);
    }
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#F5F5F5',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  };

  const partyNameStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Proxima Nova, sans-serif',
    textAlign: 'center',
    marginBottom: 16,
  };

  const dateCardStyle: React.CSSProperties = {
    backgroundColor: Colors.white,
    border: '1px solid #00000029',
    borderRadius: 4,
    marginBottom: 12,
    marginLeft: 20,
    marginRight: 20,
    overflow: 'hidden',
  };

  const dateHeaderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    cursor: 'pointer',
  };

  const dateTextStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#362828',
    fontFamily: 'Proxima Nova, sans-serif',
    flex: 2.5,
  };

  const viewActivityTextStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3955CB',
    fontFamily: 'Proxima Nova, sans-serif',
    marginRight: 8,
  };

  const activityItemStyle: React.CSSProperties = {
    borderTop: '1px solid #00000029',
    padding: '10px 16px',
    backgroundColor: Colors.white,
  };

  const activityRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  };

  const timeTextStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const activityTypeStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3955CB',
    fontFamily: 'Proxima Nova, sans-serif',
    marginLeft: 20,
  };

  const orderDetailsStyle: React.CSSProperties = {
    marginTop: 10,
    fontSize: 13,
    color: '#000',
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
  };

  const noDataStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    color: Colors.TexthintColor,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const renderActivityItem = (item: ActivityItem, index: number) => {
    const quantity1 = parseFloat(item.quantity_one || '0');
    const quantity2 = parseFloat(item.quantity_two || '0');
    const smallUnit = parseFloat(item.small_Unit || '0');
    const largeUnit = parseFloat(item.large_Unit || '0');

    return (
      <div key={index} style={activityItemStyle}>
        <div style={activityRowStyle}>
          <span style={timeTextStyle}>
            {moment(item.ActivityStart).format('hh:mm A')}
          </span>
          <span style={activityTypeStyle}>
            {getActivityTypeLabel(item.collection_type)}
          </span>
        </div>

        {item.collection_type === 0 && (
          <div style={orderDetailsStyle}>
            <div>
              <span style={labelStyle}>Product: </span>
              <span>{item.Item}</span>
            </div>
            <div style={{marginTop: 5}}>
              <span style={labelStyle}>Quantity (Cs): </span>
              <span>{quantity1} </span>
              <span style={labelStyle}>Quantity (Btl): </span>
              <span>{quantity2} </span>
              <span style={labelStyle}>Free (Cs): </span>
              <span>{largeUnit}</span>
            </div>
            <div style={{marginTop: 5}}>
              <span style={labelStyle}>Free (Btl): </span>
              <span>{smallUnit} </span>
              <span style={labelStyle}>Value: </span>
              <span>{item.Amount}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCheckoutItem = (item: ActivityItem, index: number) => {
    if (item.collection_type !== 4) return null;

    return (
      <div key={`checkout-${index}`} style={activityItemStyle}>
        <div style={activityRowStyle}>
          <span style={timeTextStyle}>
            {moment(item.ActivityEnd).format('hh:mm A')}
          </span>
          <span style={activityTypeStyle}>CHECK OUT</span>
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <Loader visible={isLoading || uniqueDates.length === 0} />

      <ReportHeader title="Outlet Visit Activities" onBack={() => navigate(-1)} />

      <div style={contentStyle}>
        {/* Party Name */}
        <div style={partyNameStyle}>{Party || 'N/A'}</div>

        {/* Activity Cards by Date */}
        {uniqueDates.map((dateItem, index) => (
          <div key={index} style={dateCardStyle}>
            <div style={dateHeaderStyle} onClick={() => toggleExpand(index)}>
              <span style={dateTextStyle}>{dateItem}</span>
              <span style={viewActivityTextStyle}>View Activities</span>
              <FiChevronRight size={16} color="#000" />
            </div>

            {openIndex.includes(index) && (
              <div>
                {dataOrder
                  .filter((item) => item.from_date === dateItem)
                  .map((item, idx) => renderActivityItem(item, idx))}
                {dataOrder
                  .filter((item) => item.from_date === dateItem)
                  .map((item, idx) => renderCheckoutItem(item, idx))}
              </div>
            )}
          </div>
        ))}

        {/* No Data */}
        {!isLoading && uniqueDates.length === 0 && (
          <div style={noDataStyle}>No activity data available</div>
        )}
      </div>
    </div>
  );
};

export default OutletVisitActivity;
