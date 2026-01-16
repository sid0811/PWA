import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalAction } from './redux/actionHooks/useGlobalAction';
import Routes from './navigation/Routes';
import { useNetInfo } from './hooks/useNetInfo';
import './styles/App.css';

function App() {
  const { isDarkMode } = useGlobalAction();
  const { isNetConnected } = useNetInfo();
  const location = useLocation();

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Log route changes (equivalent to navigation tracking in RN)
  useEffect(() => {
    console.log('Route changed:', location.pathname);
  }, [location]);

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
      {!isNetConnected && (
        <div className="offline-banner">
          You are currently offline
        </div>
      )}
      <Routes />
    </div>
  );
}

export default App;
