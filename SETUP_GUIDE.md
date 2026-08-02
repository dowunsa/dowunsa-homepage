# 도운사 웹사이트 — 남은 설정 가이드

코딩 없이 화면만 보고 따라 하실 수 있도록 정리했습니다. 순서대로 진행해주세요.
막히는 부분이 있으면 캡처해서 저에게 보여주시면 이어서 도와드립니다.

---

## 1. GitHub에 올리고 배포하기

1. github.com에서 새 저장소(Repository) 생성 — 이름 예: `dowunsa-site`, **Public**으로 생성 (무료 Pages 배포에 필요)
2. 저에게 "저장소 만들었어, 주소는 https://github.com/아이디/dowunsa-site 야" 라고 알려주시면 제가 push까지 해드립니다.
3. 저장소 생성 후 GitHub 저장소 화면에서 **Settings → Pages**로 이동
   - Source: `Deploy from a branch`
   - Branch: `main` / 폴더: `/docs` 선택 후 저장
   - Custom domain 칸에 `dowunsa.com` 입력 (이미 `docs/CNAME` 파일에 넣어뒀습니다)
4. 가비아 → 도메인 관리 → DNS 설정에서 아래 레코드 추가
   | 타입 | 호스트 | 값 |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | 아이디.github.io |
5. DNS는 반영까지 몇 분~몇 시간 걸릴 수 있습니다. 반영되면 GitHub Pages 설정 화면에서 **Enforce HTTPS** 체크박스를 켜주세요.

---

## 2. Firebase 설정값 받아오기

Firebase 콘솔(console.firebase.google.com)에서 이미 만드신 프로젝트로 들어가서:

1. **빌드 → Firestore Database → 데이터베이스 만들기**
   - 프로덕션 모드로 시작, 위치는 `asia-northeast3 (서울)` 추천
2. **빌드 → Authentication → 시작하기**
   - 로그인 방법 탭에서 **이메일/비밀번호** 사용 설정
   - 사용자 탭에서 **사용자 추가** → 관리자 페이지 로그인용 이메일/비밀번호 직접 등록 (이게 대표님의 admin-login.html 로그인 계정이 됩니다)
3. **프로젝트 설정(⚙️) → 일반** 탭 맨 아래 "내 앱"에서 웹 아이콘(`</>`) 클릭 → 앱 닉네임 아무거나 입력 → 등록
   - 화면에 나오는 `firebaseConfig = {...}` 값을 통째로 복사해서 저에게 붙여넣어주세요
4. **프로젝트 설정 → Cloud Messaging** 탭 → "웹 구성" → "웹 푸시 인증서" → **키 쌍 생성** → 나오는 키 값도 복사해서 알려주세요

이 두 가지(firebaseConfig, VAPID 키)만 주시면 제가 `docs/assets/js/firebase-config.js`에 넣고 바로 작동하게 만들어드립니다.

---

## 3. 제가 터미널에서 배포할 것들 (값 받은 후 진행)

값을 주시면 제가 아래 작업을 진행합니다 (참고용, 직접 안 하셔도 됩니다):
- Firestore 보안 규칙 배포 (`firestore.rules` — 예약 저장은 누구나, 열람/수정은 로그인한 관리자만 가능하도록 이미 작성해둠)
- 푸시 알림용 Cloud Function 배포 (`functions/index.js`)

이 단계는 **Firebase 로그인**이 필요한데, 로그인은 브라우저로 대표님 본인이 진행하셔야 합니다. 제가 안내드리면 터미널에 `firebase login` 명령을 실행 → 뜨는 구글 로그인 화면에서 로그인해주시면 됩니다.

---

## 4. 관리자 페이지 사용법

- **dowunsa.com/admin-login.html** → 2번에서 만든 이메일/비밀번호로 로그인
- **dowunsa.com/admin-dashboard.html** → 예약 신청 목록이 실시간으로 뜹니다
  - 각 카드의 "사주 보기"를 누르면 생년월일/태어난 시간으로 사주팔자 8칸이 바로 계산됩니다
  - "완료 처리"로 처리된 예약을 구분할 수 있습니다
  - 우측 상단 "🔔 알림 켜기"를 (폰 브라우저에서) 한 번 눌러두면 이후 새 예약이 올 때마다 폰에 알림이 옵니다
- **dowunsa.com/admin-saju.html** — 예약과 상관없이 생년월일만 넣어 사주를 계산해보고 싶을 때 쓰는 단독 계산기

⚠️ 이 관리자 페이지들은 검색엔진에 노출되지 않지만, 링크를 아무에게나 공유하지 마세요. 로그인해야 실제 예약 목록을 볼 수 있습니다.

---

## 5. 아직 넣어야 하는 파일

- `docs/assets/audio/ambient.mp3` — about.html 배경음악 (README.txt에 무료 음원 추천 링크 있음)
- `docs/assets/images/profile.jpg`, `gut.jpg`, `jakdu.jpg`, `chundo.jpg`, `gallery-1.jpg~gallery-8.jpg` — 실제 사진
  (파일 넣고 "사진/음악 반영해줘"라고 말씀하시면 확인해드립니다)

---

## 참고: 지금 무엇이 이미 되어있나요

- 예약폼 제출 → Firestore에 저장 (Firebase 설정 전까지는 "전송 실패" 안내만 뜹니다, 정상입니다)
- 사주팔자 계산은 **태양력 절기 근사값** 기반 참고용입니다. 실제 상담 전 정식 만세력으로 한 번 더 확인해주세요.
- 카카오톡 오픈채팅(https://open.kakao.com/o/sWJt3TGi), 유튜브, 인스타그램 링크 전부 연결 완료
- 앱 아이콘/파비콘 = 업로드해주신 로고 이미지로 적용 완료
- PWA로 설치 가능 (모바일 브라우저에서 "홈 화면에 추가")
