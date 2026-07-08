"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export interface AppItem {
  id: string;
  title: string;
  category: string;
  url: string;
  thumbnailUrl: string;
  description: string;
  isActive: boolean;
}

const CATEGORIES = ['전체', '수업', '학급운영', '업무', '기타'];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [appsData, setAppsData] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/apps')
      .then(res => res.json())
      .then(data => {
        setAppsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load apps", err);
        setLoading(false);
      });
  }, []);

  const filteredApps = appsData.filter(app => {
    if (!app.isActive) return false;
    if (activeCategory === '전체') return true;
    return app.category === activeCategory;
  });

  // 해시태그를 예쁘게 렌더링하기 위한 함수 (해시태그 띄어쓰기 지원)
  const renderDescription = (desc: string) => {
    // '#'을 기준으로 문자열을 나눕니다.
    const parts = desc.split('#');
    
    // 첫 번째 부분은 일반 설명글입니다.
    const normalText = parts[0].trim();
    
    // 두 번째 부분부터는 해시태그입니다. (각각 앞에 '#'을 다시 붙여줍니다)
    const hashtags = parts.slice(1).map(tag => '#' + tag.trim()).filter(tag => tag !== '#');

    return (
      <>
        {normalText && <p className={styles.cardDesc}>{normalText}</p>}
        {hashtags.length > 0 && (
          <div className={styles.hashtagContainer}>
            {hashtags.map((tag, index) => (
              <span key={index} className={styles.hashtag}>{tag}</span>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <header className={`${styles.header} animate-pop-in`}>
        <h1 className={styles.title}>바이브 웹앱 모음</h1>
        <p className={styles.subtitle}>선생님들의 학급 운영과 수업을 도와줄 유용한 앱들을 만나보세요 💕</p>
      </header>

      <nav className={`${styles.categoryNav} animate-pop-in delay-100`}>
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`${styles.categoryBtn} ${activeCategory === category ? styles.active : ''}`}
          >
            {category}
          </button>
        ))}
      </nav>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem' }}>앱 데이터를 불러오는 중입니다... 🧸</div>
      ) : (
        <div className={`${styles.grid} animate-pop-in delay-200`}>
          {filteredApps.map(app => (
            <article key={app.id} className={`glass glass-card ${styles.card}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardCategory}>{app.category}</span>
              </div>
              
              <div className={styles.iframeWrapper}>
                {app.thumbnailUrl ? (
                  <img src={app.thumbnailUrl} alt={app.title} className={styles.previewImage} />
                ) : (
                  <iframe src={app.url} className={styles.previewIframe} title={`${app.title} preview`} scrolling="no" tabIndex={-1} />
                )}
                {/* 오버레이를 추가하여 아이프레임 내 클릭을 방지합니다 */}
                <div className={styles.iframeOverlay}></div>
              </div>

              <h2 className={`${styles.cardTitle} cute-font`}>{app.title}</h2>
              {renderDescription(app.description)}
              <div className={styles.cardAction}>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.launchBtn}
                >
                  실행하기 ✨
                </a>
              </div>
            </article>
          ))}
          {filteredApps.length === 0 && (
            <div className="glass" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              해당 카테고리에 등록된 앱이 없습니다. 😥
            </div>
          )}
        </div>
      )}

      <footer className={`${styles.footer} animate-pop-in delay-300`}>
        <div className={styles.footerLinks}>
          <a href="/terms">이용약관</a>
          <a href="/privacy">개인정보처리방침</a>
          <a href="/admin" className={styles.adminBtn}>앱 관리 🔒</a>
        </div>
        <div className={styles.footerCredit}>
          우신중학교 | BY. LEE JIN YOUNG
        </div>
      </footer>
    </div>
  );
}
