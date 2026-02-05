# 🚀 Next.js 배포 가이드 (Vercel)

## 📋 준비물

1. **GitHub 계정** (이미 있음 ✅)
2. **Vercel 계정** (무료 - 지금 만들 예정)
3. **프로젝트 파일들** (제공됨 ✅)

---

## 🎯 Step 1: GitHub에 Next.js 프로젝트 업로드

### 방법 A: 새 저장소 만들기 (추천)

1. **GitHub.com 접속**
2. **"+" → "New repository"**
3. 설정:
   - Repository name: `housing-ai-nextjs`
   - Public 선택
   - **Create repository**

4. **파일 업로드:**
   - **Add file → Upload files**
   - 다운로드한 `nextjs` 폴더 안의 모든 파일 드래그
   - **Commit changes**

### 방법 B: 기존 저장소에 추가

```
seattle-housing-ai/
├── app.py (Streamlit - 기존)
├── nextjs/  (새로 추가!)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── next.config.js
```

---

## 🎯 Step 2: Vercel 계정 생성 및 연결

### 2-1. Vercel 가입

1. **https://vercel.com** 접속
2. **"Sign Up"** 클릭
3. **"Continue with GitHub"** 선택 (가장 쉬움!)
4. GitHub 계정으로 로그인
5. Vercel 권한 승인

### 2-2. 프로젝트 임포트

1. Vercel 대시보드에서 **"Add New..." → "Project"**
2. GitHub 저장소 목록에서 `housing-ai-nextjs` 찾기
3. **"Import"** 클릭

### 2-3. 프로젝트 설정

```
Framework Preset: Next.js (자동 감지됨)
Root Directory: ./ (기본값)
Build Command: next build (자동)
Output Directory: .next (자동)
Install Command: npm install (자동)
```

**아무것도 수정하지 말고 바로:**
4. **"Deploy"** 클릭!

---

## ⏱️ Step 3: 배포 대기 (2-3분)

배포 진행 상황:
```
✅ Building...
✅ Installing dependencies...
✅ Compiling pages...
✅ Optimizing production build...
✅ Deployed!
```

완료되면:
```
🎉 Your project is live!
https://housing-ai-nextjs.vercel.app
```

---

## 🌐 Step 4: 커스텀 도메인 연결 (선택사항)

### 본인 웹사이트에 통합하기

#### 옵션 A: 서브도메인
```
1. Vercel 대시보드 → Settings → Domains
2. "Add Domain" 클릭
3. 입력: housing.yourwebsite.com
4. DNS 설정 (Vercel이 안내해줌)

결과: https://housing.yourwebsite.com
```

#### 옵션 B: 서브경로 (iframe)
```html
<!-- 당신 웹사이트에 추가 -->
<iframe 
  src="https://housing-ai-nextjs.vercel.app"
  width="100%"
  height="1000px"
  frameborder="0"
></iframe>
```

#### 옵션 C: 완전 통합 (고급)
```
당신 웹사이트가 Next.js면:
1. housing-ai를 npm 패키지로 만들기
2. import해서 사용

또는 모놀리스 구조로 통합
```

---

## 🔄 Step 5: 자동 업데이트 설정

**Vercel의 마법:** GitHub에 push하면 자동 재배포! ✨

```bash
# 코드 수정 후
git add .
git commit -m "Update feature"
git push

# 1-2분 후 자동으로 배포됨!
```

**Vercel이 자동으로:**
- ✅ 변경사항 감지
- ✅ 빌드 시작
- ✅ 배포 완료
- ✅ 이전 버전 백업

---

## ⚡ 성능 최적화 (자동 적용됨)

Vercel이 자동으로 제공:
- ✅ 글로벌 CDN (전 세계 빠른 속도)
- ✅ 자동 SSL/HTTPS
- ✅ 이미지 최적화
- ✅ Edge Functions
- ✅ 무한 확장성

**결과:**
```
Streamlit: 3-5초 로딩
Next.js + Vercel: 0.5-1초 로딩 (5-10배 빠름!)
```

---

## 🆚 Streamlit vs Next.js 비교

| 항목 | Streamlit | Next.js + Vercel |
|------|-----------|------------------|
| 로딩 속도 | 3-5초 | 0.5-1초 ⭐⭐⭐⭐⭐ |
| Cold start | 10초+ | 없음 ⭐⭐⭐⭐⭐ |
| 커스터마이징 | 제한적 | 완전 자유 ⭐⭐⭐⭐⭐ |
| 모바일 | 보통 | 완벽 ⭐⭐⭐⭐⭐ |
| SEO | 안됨 | 완벽 ⭐⭐⭐⭐⭐ |
| 도메인 통합 | 어려움 | 쉬움 ⭐⭐⭐⭐⭐ |
| 비용 | 무료 | 무료 ⭐⭐⭐⭐⭐ |

---

## 🔧 문제 해결

### 문제 1: 빌드 실패
```
에러: "Module not found"

해결:
1. Vercel 대시보드 → Settings → General
2. Node.js Version: 18.x 선택
3. Redeploy
```

### 문제 2: 데이터 로딩 실패
```
에러: "Failed to fetch market_cache.json"

해결:
1. GitHub 저장소 Public인지 확인
2. 파일 경로 확인:
   https://raw.githubusercontent.com/YOUR_USERNAME/seattle-housing-ai/main/market_cache.json
```

### 문제 3: 화면이 안 보임
```
문제: 검은 화면만 보임

해결:
1. 브라우저 콘솔 열기 (F12)
2. 에러 메시지 확인
3. 대부분 데이터 로딩 이슈
```

---

## 🎨 커스터마이징

### 색상 변경
```javascript
// app/layout.js
const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B',  // 빨간색으로 변경
    },
  },
});
```

### 로고 추가
```javascript
// components/Calculator.js
import Image from 'next/image';

<Image src="/logo.png" width={100} height={50} />
```

### Google Analytics 추가
```javascript
// app/layout.js
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />
```

---

## 📊 모니터링

### Vercel Analytics (무료)
```
Vercel 대시보드 → Analytics

볼 수 있는 것:
- 방문자 수
- 페이지 로딩 속도
- 에러 발생률
- 지역별 트래픽
```

### 실시간 로그
```
Vercel 대시보드 → Deployments → [최신 배포] → Runtime Logs

실시간으로:
- API 호출 확인
- 에러 추적
- 성능 모니터링
```

---

## 🚀 고급 기능

### A/B 테스팅
```
Vercel Edge Middleware로:
- 50% 사용자에게 버전 A
- 50% 사용자에게 버전 B
- 어느 것이 더 나은지 자동 분석
```

### 지역별 최적화
```
Edge Functions:
- 한국 사용자 → 서울 서버
- 미국 사용자 → 뉴욕 서버
- 자동 최적화!
```

---

## ✅ 완료 체크리스트

- [ ] GitHub에 프로젝트 업로드 완료
- [ ] Vercel 계정 생성 완료
- [ ] 프로젝트 임포트 완료
- [ ] 첫 배포 성공 (URL 확인)
- [ ] 웹사이트 정상 작동 확인
- [ ] 계산기 테스트 완료
- [ ] 모바일에서 확인 완료
- [ ] (선택) 커스텀 도메인 연결

---

## 🎉 다음 단계

1. **Streamlit과 병행 운영**
   - Streamlit: 기존 사용자용
   - Next.js: 신규 사용자용
   - 점진적으로 마이그레이션

2. **기능 추가**
   - 저장/공유 기능
   - PDF 리포트 생성
   - 이메일 알림

3. **마케팅**
   - SEO 최적화 (Next.js는 자동!)
   - 소셜 미디어 공유
   - 백링크 구축

---

**축하합니다! 🎊**

이제 초고속 부동산 분석 플랫폼이 완성되었습니다!

URL: https://housing-ai-nextjs.vercel.app
