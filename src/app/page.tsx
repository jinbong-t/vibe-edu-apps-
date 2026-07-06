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

  // 해시태그를 예쁘게 렌더링하기 위한 함수
  const renderDescription = (desc: string) => {
    const words = desc.split(' ');
    const hashtags = words.filter(word => word.startsWith('#'));
    const normalText = words.filter(word => !word.startsWith('#')).join(' ');

    return (
      <>
        <p className={styles.cardDesc}>{normalText}</p>
        <div className={styles.hashtagContainer}>
          {hashtags.map((tag, index) => (
            <span key={index} className={styles.hashtag}>{tag}</span>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <header className={`${styles.header} animate-pop-in`}>
        <h1 className={styles.title}>지식샘터 웹앱 모음</h1>
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
