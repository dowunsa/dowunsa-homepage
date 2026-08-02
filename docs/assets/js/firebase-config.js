/* ══ Firebase 설정 ══
   https://console.firebase.google.com 에서 프로젝트 생성 후,
   프로젝트 설정(⚙️) > 일반 > "내 앱" > 웹 앱 추가(</>) 하면 아래 값을 받을 수 있습니다.
   받은 값을 아래 그대로 채워 넣으면 예약폼/관리자 페이지가 전부 작동합니다.
   이 값들은 공개되어도 안전합니다 (Firebase 보안은 API 키가 아니라 Firestore 보안 규칙으로 관리됩니다). */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/* Firebase 콘솔 > 프로젝트 설정 > Cloud Messaging > 웹 푸시 인증서 에서 발급받는 키.
   admin-dashboard.html의 "알림 켜기" 기능(폰 푸시 알림)에만 필요합니다. */
const FIREBASE_VAPID_KEY = "YOUR_VAPID_KEY";

const FIREBASE_READY = firebaseConfig.apiKey !== "YOUR_API_KEY";

if (FIREBASE_READY && typeof firebase !== "undefined") {
  firebase.initializeApp(firebaseConfig);
}
