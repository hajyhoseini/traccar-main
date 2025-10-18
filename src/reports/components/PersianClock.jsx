import React, { useState, useEffect } from 'react';

const PersianClock = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // تنظیم تایم‌زون به ایران (IRST, UTC+3:30)
      const options = {
        timeZone: 'Asia/Tehran',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat('fa-IR', options).format(now);
      const dateString = new Intl.DateTimeFormat('fa-IR', {
        dateStyle: 'full',
        timeZone: 'Asia/Tehran',
      }).format(now);
      setCurrentTime(`${dateString} ${timeString}`);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000); // به‌روزرسانی هر ثانیه

    return () => clearInterval(intervalId); // پاکسازی interval هنگام unmount
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #fef9f0, #f0f4f8)',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        height: '350px',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Vazir, Arial, sans-serif',
        fontSize: '1.2rem',
        color: '#333',
        textAlign: 'center',
      }}
    >
      <h3>ساعت و تاریخ تهران</h3>
      <div>{currentTime}</div>
    </div>
  );
};

export default PersianClock;