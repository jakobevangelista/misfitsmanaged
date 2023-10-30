"use client";

import { send } from "process";
import { useEffect } from "react";

const NotificationButton = () => {
  async function sendNotification() {
    if (
      Notification.permission === "default" ||
      Notification.permission === "denied"
    ) {
      await Notification.requestPermission().then((perm) => {
        alert(perm);
      });
    }
    if (Notification.permission === "granted") {
      const registration = await navigator.serviceWorker.register(
        "serviceworker.js",
        {
          scope: "./",
        }
      );
      await Notification.requestPermission().then(async (perm) => {
        new Notification("work", {
          body: "hello my amigo",
          icon: "/croppedMisfitsLogo.png",
          tag: "test",
        });
        await registration.showNotification("hello", {
          body: "hello from the other side",
        });
        // alert(perm);
      });
    }
  }
  useEffect(() => {
    async function deeznuts() {
      await Notification.requestPermission().then((perm) => {
        new Notification("work", {
          body: "hello from the other side",
          icon: "/croppedMisfitsLogo.png",
        });
      });
    }
  }, []);

  function askPermission() {
    if (Notification.permission === "granted") {
      alert("granted");
    }
    void Notification.requestPermission().then((perm) => {
      new Notification("work", {
        body: "hello from the other side",
        icon: "/croppedMisfitsLogo.png",
      });
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
