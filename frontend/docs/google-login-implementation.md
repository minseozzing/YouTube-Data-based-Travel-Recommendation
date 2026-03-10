# Google 로그인 (YouTube 연동) 프론트엔드 구현 가이드

이 문서는 백엔드의 OAuth2 설정에 맞춰 React 프론트엔드에서 Google 로그인을 구현하는 방법을 설명합니다. 특히 유튜브 데이터를 가져오기 위해 필요한 '인가 코드(Authorization Code)' 흐름과 'Refresh Token' 획득을 위한 설정을 포함합니다.

## 1. 현재 백엔드 구성 확인

백엔드는 이미 다음과 같이 설정되어 있습니다:
- **Scope**: `profile`, `email`, `https://www.googleapis.com/auth/youtube.readonly`
- **Access Type**: `offline` (Refresh Token 발급용)
- **Prompt**: `consent` (매번 동의 창을 띄워 Refresh Token을 확실히 받기 위함)
- **성공 시 리다이렉트**: `http://localhost:3000/oauth/callback?code={INTERNAL_UUID}`

---

## 2. 구현 방식 선택

### 방식 A: 백엔드 리다이렉트 (가장 단순함)
백엔드에 설정된 Google 로그인 시작 엔드포인트로 `window.location.href`를 이동시키는 방식입니다. 별도의 라이브러리 없이 구현 가능하며, 백엔드 설정과 가장 잘 맞습니다.

**구현 순서:**
1. 로그인 버튼 클릭 시 백엔드 로그인 URL로 이동.
2. 콜백 페이지(`http://localhost:3000/oauth/callback`)에서 쿼리 파라미터 `code` 추출.
3. 백엔드의 `/api/auth/exchange` API 호출하여 JWT 토큰 획득.

### 방식 B: `@react-oauth/google` 라이브러리 사용 (팝업 방식)
사용자 경험이 더 좋고(페이지 전환 없음), Google에서 제공하는 공식 스타일의 버튼을 사용할 수 있습니다. 단, 백엔드에 Google 인가 코드를 직접 전달하여 처리하는 로직이 추가로 필요할 수 있습니다.

---

## 3. 상세 구현 (방식 A 기준)

### 3.1 로그인 버튼 컴포넌트
```tsx
const GoogleLoginButton = () => {
  const handleLogin = () => {
    // 백엔드의 OAuth2 시작 엔드포인트로 리다이렉트
    // (현재 AuthController.java에 /api/auth/google/login-url 엔드포인트가 정의되어 있음)
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <button onClick={handleLogin}>
      Google로 로그인하기 (YouTube 연동)
    </button>
  );
};
```

### 3.2 콜백 페이지 (`/oauth/callback`)
이 페이지는 Google 로그인이 완료된 후 백엔드가 `FRONT_CALLBACK_URL`로 리다이렉트시킬 때 보여집니다.

```tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      // 백엔드에 내부 코드(UUID)를 전달하여 JWT로 교환
      axios.post('http://localhost:8080/api/auth/exchange', { code })
        .then(res => {
          const { accessToken, member } = res.data;
          
          // 1. JWT 저장
          localStorage.setItem('accessToken', accessToken);
          
          // 2. 유저 정보 저장 (Context나 상태관리 라이브러리)
          console.log('로그인 성공:', member);
          
          // 3. 메인 페이지로 이동
          navigate('/');
        })
        .catch(err => {
          console.error('로그인 실패:', err);
          navigate('/login');
        });
    }
  }, [searchParams, navigate]);

  return <div>로그인 처리 중입니다...</div>;
};
```

---

## 4. `@react-oauth/google`을 사용한 인가 코드 흐름 (참고)

만약 팝업 방식을 사용하고 싶다면, `flow: 'auth-code'` 설정을 사용해야 합니다.

```tsx
import { useGoogleLogin } from '@react-oauth/google';

const GoogleLoginPopup = () => {
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log('Google Code:', codeResponse.code);
      
      // 주의: 이 code는 Google의 인가 코드입니다.
      // 현재 백엔드의 /api/auth/exchange는 백엔드가 생성한 UUID를 기대하므로,
      // Google code를 받아 처리하는 별도의 백엔드 엔드포인트가 필요합니다.
      await axios.post('http://localhost:8080/api/auth/google-code', {
        code: codeResponse.code
      });
    },
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  });

  return <button onClick={() => login()}>Google 로그인 (팝업)</button>;
};
```

## 5. 핵심 포인트 (YouTube 연동을 위해)

1. **Refresh Token 확보**: 백엔드 `SecurityConfig`에서 `access_type=offline`과 `prompt=consent`가 설정되어 있는지 확인하세요 (이미 설정됨). 이를 통해 백엔드는 사용자가 로그오프 상태일 때도 유튜브 데이터를 동기화할 수 있는 `Refresh Token`을 얻게 됩니다.
2. **권한(Scope)**: `https://www.googleapis.com/auth/youtube.readonly` 권한이 반드시 포함되어야 합니다.
3. **토큰 교환**: 프론트엔드는 단순히 로그인을 하는 것을 넘어, 백엔드가 Google API를 직접 호출할 수 있도록 **백엔드 주도의 OAuth2 흐름**을 타는 것이 가장 안전하고 효율적입니다.

현재 구현된 백엔드 구조는 **방식 A**에 최적화되어 있으므로, `window.location.href`를 통한 리다이렉트 방식을 권장합니다.
