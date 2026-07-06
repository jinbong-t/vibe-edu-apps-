import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem', background: 'var(--glass-bg)', borderRadius: '16px', backdropFilter: 'blur(12px)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>개인정보처리방침</h1>
      <p style={{ lineHeight: '1.6', marginBottom: '2rem' }}>
        지식샘터 웹앱 모음은 별도의 로그인을 요구하지 않으며, 최소한의 개인정보만을 수집합니다.<br/>
        (자세한 내용은 루트 폴더의 개인정보처리방침.md 파일을 참고하여 작성해 주세요.)
      </p>
      <Link href="/" style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--primary-color)', color: 'white', borderRadius: '8px' }}>
        메인으로 돌아가기
      </Link>
    </div>
  );
}
