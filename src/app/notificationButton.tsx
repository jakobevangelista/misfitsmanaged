"use client";

const NotificationButton = () => {
  function sendNotification() {
    if (
      Notification.permission === "default" ||
      Notification.permission === "denied"
    ) {
      //   await Notification.requestPermission().then((perm) => {
      //     alert(perm);
      //   });
    }
    if (Notification.permission === "granted") {
      new Notification("work", {
        body: "hello from the other side",
        icon: "/croppedMisfitsLogo.png",
      });
    }
  }

  async function askPermission() {
    await Notification.requestPermission().then((perm) => {
      alert(perm);
    });
  }
  //   if (!(typeof window === undefined)) {
  //     if (!("Notification" in window)) {
  //       return <div>Browser does not support notifications</div>;
  //     }
  //   }

  return (
    <>
      <button className="mb-12 ml-12" onClick={sendNotification}>
        Send Notification
      </button>
      <div>
        <button onClick={askPermission}> Ask for permission</button>
      </div>
    </>
  );
};

export default NotificationButton;
