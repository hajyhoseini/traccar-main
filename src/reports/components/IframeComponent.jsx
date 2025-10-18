import React from 'react';

const IframeComponent = () => {
  // گرفتن آدرس فعلی و ساخت آدرس Traccar به صورت پویا
  const currentOrigin = window.location.origin;
  const traccarPort = 8082; // پورت پیش‌فرض Traccar، اگه متفاوته تغییر بده
  const traccarUrl = `${currentOrigin.split(':')[0]}:${traccarPort}`; // فقط پروتکل و هاست + پورت

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd' , display:"block" }}>
      <iframe
        src={traccarUrl}
        style={{ height: '100%', width: '100%', border: 'none' , display:"block" }}
        title="Traccar Dashboard"
      />
    </div>
  );
};

export default IframeComponent;