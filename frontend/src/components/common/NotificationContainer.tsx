import React from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import { useUIStore } from '@/store';

export const NotificationContainer: React.FC = () => {
  const notifications = useUIStore((s) => s.notifications);
  const removeNotification = useUIStore((s) => s.removeNotification);
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        maxWidth: 400,
      }}
    >
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={5000}
          onClose={() => removeNotification(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            severity={notification.type}
            onClose={() => removeNotification(notification.id)}
            sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: 280,
              '& .MuiAlert-message': {
                fontWeight: 500,
              },
            }}
          >
            <strong>{notification.title}</strong>
            {notification.message && (
              <div style={{ marginTop: 4 }}>{notification.message}</div>
            )}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};
