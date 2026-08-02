/* 앱(브라우저 탭)이 꺼져있거나 백그라운드일 때도 푸시 알림을 받기 위한 전용 서비스워커.
   Firebase Cloud Messaging 규칙상 파일명이 반드시 firebase-messaging-sw.js 여야 하고,
   사이트 루트(docs/)에 있어야 합니다. */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");
importScripts("assets/js/firebase-config.js");

if (typeof FIREBASE_READY !== "undefined" && FIREBASE_READY) {
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || "도운사 알림";
    const options = {
      body: payload.notification?.body || "",
      icon: "assets/images/icon.svg",
    };
    self.registration.showNotification(title, options);
  });
}
