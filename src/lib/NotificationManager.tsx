import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/Store';
import logo from '../assets/logo.png';

interface NotificationManagerProps {
  children: React.ReactNode;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ children }) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);
  const [focused, setFocused] = useState<boolean>(document.hasFocus());
  const { selectedChat } = useSelector((state: RootState) => state.chat);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  // Track when the window loses/gains focus
  useEffect(() => {
    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Show notification for new messages when window is not focused
  useEffect(() => {
    // Create a function to handle new messages and notifications
    const handleNotification = (event: CustomEvent) => {
      const { message, sender, chatId, chatType } = event.detail;

      // Don't show notifications for the current chat when focused
      if (focused && selectedChat?._id === chatId) {
        return;
      }

      // Show notification if permission granted
      if (notificationPermission === 'granted') {
        // Create notification
        const notification = new Notification(sender, {
          body: message,
          icon: logo,
          tag: `chat-${chatId}`,
          silent: false
        });

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          // Custom event to navigate to the chat
          window.dispatchEvent(new CustomEvent('notification:navigate', {
            detail: { chatId, chatType }
          }));
          notification.close();
        };

        // Auto close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);
      }
    };

    // Listen for custom notification events
    window.addEventListener('new:message:notification', handleNotification as EventListener);

    return () => {
      window.removeEventListener('new:message:notification', handleNotification as EventListener);
    };
  }, [focused, selectedChat, notificationPermission]);

  // Show permission request button if needed
  if (notificationPermission === 'default') {
    return (
      <div>
        {children}
        <div className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg z-50">
          <p className="mb-2">Enable notifications to stay updated with new messages</p>
          <button
            onClick={requestNotificationPermission}
            className="px-4 py-2 bg-white text-primary rounded hover:bg-gray-100"
          >
            Enable Notifications
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default NotificationManager;