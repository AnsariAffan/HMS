// import React, { useEffect } from 'react';
// import { Modal } from 'antd';

// const SuccessfullPopUp = () => {
//   const [modal, contextHolder] = Modal.useModal();

//   const countDown = () => {
//     let secondsToGo = 1;
//     const instance = modal.success({
//       title: 'Patient Added Successfully',
//       okButtonProps: { // Set okButtonProps to null to hide the OK button
//         style: { display: 'none' },
//       },
//     });
//     const timer = setInterval(() => {
//       secondsToGo -= 1;
//     }, 1000);
//     setTimeout(() => {
//       clearInterval(timer);
//       instance.destroy();
//     }, secondsToGo * 1000);
//   };

//   useEffect(() => {
//     countDown(); // Call countDown when component mounts
//   }, []); // Empty dependency array ensures this effect runs only once after the initial render

//   return (
//     <>
//       {contextHolder}
//     </>
//   );
// };

// export default SuccessfullPopUp;


import React from 'react';
import { Button, notification, Space } from 'antd';
const SuccessfullPopUp = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
  };
  return (
    <>
      {contextHolder}
      <Space>
        <Button onClick={() => openNotificationWithIcon('success')}>Success</Button>
      
      </Space>
    </>
  );
};
export default SuccessfullPopUp;


