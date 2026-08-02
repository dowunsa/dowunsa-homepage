const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

/**
 * reservations 컬렉션에 새 문서가 생기면(=새 예약 접수)
 * admin_tokens 컬렉션에 등록된 모든 기기(관리자 폰)로 푸시 알림을 보냅니다.
 * admin-dashboard.html에서 "🔔 알림 켜기" 버튼을 눌러야 토큰이 admin_tokens에 등록됩니다.
 */
exports.notifyNewReservation = onDocumentCreated("reservations/{reservationId}", async (event) => {
  const data = event.data.data();
  const db = getFirestore();

  const tokensSnap = await db.collection("admin_tokens").get();
  if (tokensSnap.empty) {
    console.log("등록된 알림 토큰이 없습니다. admin-dashboard.html에서 알림을 먼저 켜주세요.");
    return;
  }

  const tokens = tokensSnap.docs.map((doc) => doc.id);

  const message = {
    notification: {
      title: "새 예약 신청이 도착했습니다",
      body: `${data.name || "익명"} · ${data.program || "상담"}`,
    },
    webpush: {
      fcmOptions: { link: "/admin-dashboard.html" },
    },
    tokens,
  };

  try {
    const response = await getMessaging().sendEachForMulticast(message);
    console.log(`알림 전송 완료: 성공 ${response.successCount} / 실패 ${response.failureCount}`);

    // 만료되거나 무효화된 토큰은 정리
    const staleTokens = [];
    response.responses.forEach((res, i) => {
      if (!res.success) staleTokens.push(tokens[i]);
    });
    await Promise.all(staleTokens.map((t) => db.collection("admin_tokens").doc(t).delete()));
  } catch (err) {
    console.error("알림 전송 실패:", err);
  }
});
