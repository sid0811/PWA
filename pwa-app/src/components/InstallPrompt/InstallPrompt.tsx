import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {FiDownload, FiX, FiSmartphone} from 'react-icons/fi';
import {Colors} from '../../theme/colors';
import {usePWAInstall} from '../../hooks/usePWAInstall';

const InstallPrompt: React.FC = () => {
  const {t} = useTranslation();
  const {isInstalled, isInstallable, isIOS, promptInstall} = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isInstalled) {
      setIsVisible(false);
      return;
    }

    // Check if dismissed recently (within 7 days)
    const dismissedTime = localStorage.getItem('installPromptDismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Show if installable
    if (isInstallable) {
      // Small delay to not show immediately on page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isInstalled, isInstallable]);

  const handleInstall = async () => {
    await promptInstall();
    if (!isIOS) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  if (!isVisible || isInstalled) return null;

  // Styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    animation: 'slideUp 0.3s ease-out',
  };

  const bannerStyle: React.CSSProperties = {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: '20px',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  };

  const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const iconContainerStyle: React.CSSProperties = {
    width: 50,
    height: 50,
    backgroundColor: Colors.mainBackground,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.DarkBrown,
  };

  const subtitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 12,
    color: Colors.lightGray,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 1.5,
  };

  const benefitsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: 15,
    marginBottom: 20,
    flexWrap: 'wrap',
  };

  const benefitStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: '#555',
  };

  const benefitDotStyle: React.CSSProperties = {
    width: 6,
    height: 6,
    backgroundColor: Colors.mainBackground,
    borderRadius: '50%',
  };

  const buttonsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: 12,
  };

  const installButtonStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: Colors.mainBackground,
    color: Colors.white,
    border: 'none',
    borderRadius: 12,
    padding: '14px 20px',
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  };

  const laterButtonStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: '#f5f5f5',
    color: '#666',
    border: 'none',
    borderRadius: 12,
    padding: '14px 20px',
    fontSize: 16,
    fontWeight: '500',
    cursor: 'pointer',
  };

  // iOS-specific instructions
  const iosInstructionsStyle: React.CSSProperties = {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  };

  const iosStepStyle: React.CSSProperties = {
    fontSize: 13,
    color: '#E65100',
    marginBottom: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  return (
    <div style={overlayStyle}>
      <div style={bannerStyle}>
        <div style={headerStyle}>
          <div style={titleContainerStyle}>
            <div style={iconContainerStyle}>
              {isIOS ? (
                <FiSmartphone size={24} color={Colors.white} />
              ) : (
                <FiDownload size={24} color={Colors.white} />
              )}
            </div>
            <div>
              <h3 style={titleStyle}>
                {t('InstallPrompt.Title')}
              </h3>
              <p style={subtitleStyle}>
                {t('InstallPrompt.Subtitle')}
              </p>
            </div>
          </div>
          <button style={closeButtonStyle} onClick={handleDismiss}>
            <FiX size={24} color="#999" />
          </button>
        </div>

        {isIOS ? (
          <>
            <p style={descriptionStyle}>
              {t('InstallPrompt.IOSDescription') || 'To install this app on your iPhone/iPad, follow these steps:'}
            </p>
            <div style={iosInstructionsStyle}>
              <div style={iosStepStyle}>
                <span>1.</span>
                <span>{t('InstallPrompt.IOSStep1') || 'Tap the Share button (square with arrow up)'}</span>
              </div>
              <div style={iosStepStyle}>
                <span>2.</span>
                <span>{t('InstallPrompt.IOSStep2') || 'Scroll down and tap "Add to Home Screen"'}</span>
              </div>
              <div style={{...iosStepStyle, marginBottom: 0}}>
                <span>3.</span>
                <span>{t('InstallPrompt.IOSStep3') || 'Tap "Add" in the top right corner'}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <p style={descriptionStyle}>
              {t('InstallPrompt.Description')}
            </p>
            <div style={benefitsContainerStyle}>
              <div style={benefitStyle}>
                <div style={benefitDotStyle} />
                <span>{t('InstallPrompt.Benefit1')}</span>
              </div>
              <div style={benefitStyle}>
                <div style={benefitDotStyle} />
                <span>{t('InstallPrompt.Benefit2')}</span>
              </div>
              <div style={benefitStyle}>
                <div style={benefitDotStyle} />
                <span>{t('InstallPrompt.Benefit3')}</span>
              </div>
            </div>
          </>
        )}

        <div style={buttonsContainerStyle}>
          {isIOS ? (
            <button style={laterButtonStyle} onClick={handleDismiss}>
              {t('InstallPrompt.GotIt') || 'Got it!'}
            </button>
          ) : (
            <>
              <button style={installButtonStyle} onClick={handleInstall}>
                <FiDownload size={18} />
                {t('InstallPrompt.InstallButton')}
              </button>
              <button style={laterButtonStyle} onClick={handleDismiss}>
                {t('InstallPrompt.LaterButton')}
              </button>
            </>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InstallPrompt;
