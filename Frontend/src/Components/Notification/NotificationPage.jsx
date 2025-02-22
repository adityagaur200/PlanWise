import React, { useState } from 'react';
import NotificationBar from './NotificationBar';
import MessagePage from './MessagePage';

const NotificationPage = () => {
    const [showMessage, setShowMessage] = useState(false);

    const handleClick = () => {
        setShowMessage(true);
    };

    const handleClose = () => {
        setShowMessage(false);
    };

    return (
        <div onClick={!showMessage ? handleClick : undefined}>
            {showMessage ? <MessagePage onClose={handleClose} /> : (
                <>
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                    <NotificationBar />
                </>
            )}
        </div>
    );
};

export default NotificationPage;
