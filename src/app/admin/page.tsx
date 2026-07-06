"use client";

import { useState, useEffect } from 'react';

const CATEGORIES = ['전체', '수업', '학급운영', '업무', '기타'];

export default function AdminPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: '학급운영',
    url: '',
    description: '',
  });
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const loadApps = () => {
    fetch('/api/apps')
      .then(res => res.json())
      .then(data => setApps(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (app: any) => {
    setIsEditing(true);
    setFormData({
      id: app.id,
      title: app.title,
      category: app.category,
      url: app.url,
      description: app.description,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ id: '', title: '', category: '학급운영', url: '', description: '' });
  };

  const handleDelete = async (id: string) => {
    const inputPwd = prompt('정말 삭제하시겠습니까?\n삭제하려면 관리자 비밀번호를 입력해 주세요.', '');
    
    if (inputPwd === null) return; // 취소 누름
    if (inputPwd !== '1234') {
      setMessage('❌ 비밀번호가 틀렸습니다!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const res = await fetch(`/api/apps/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage('✅ 삭제되었습니다!');
        loadApps();
      } else {
        setMessage(`❌ 삭제에 실패했습니다: ${data.details || data.error || res.statusText}`);
      }
    } catch (err: any) {
      setMessage(`❌ 오류가 발생했습니다: ${err.message}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== '1234') {
      setMessage('❌ 비밀번호가 틀렸습니다!');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      let res;
      if (isEditing) {
        res = await fetch(`/api/apps/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        res = await fetch('/api/apps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(isEditing ? '✅ 성공적으로 수정되었습니다!' : '✅ 성공적으로 등록되었습니다!');
        setFormData({ id: '', title: '', category: '학급운영', url: '', description: '' });
        setIsEditing(false);
        loadApps();
      } else {
        const errDetail = data.details || data.error || res.statusText || '알 수 없는 오류';
        setMessage(`❌ 저장에 실패했습니다. (${res.status}) → ${errDetail}`);
      }
    } catch (err: any) {
      setMessage(`❌ 네트워크 오류: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem' }} className="glass animate-pop-in">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem', background: 'linear-gradient(270deg, #ff9a9e, #a1c4fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="cute-font">
        앱 관리자 모드 🛠️
      </h1>
      
      {message && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1.5rem', 
          borderRadius: '8px', 
          background: message.includes('✅') ? '#e6fffa' : '#fff5f5',
          color: message.includes('✅') ? '#319795' : '#e53e3e',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.5)', padding: '2rem', borderRadius: '16px', marginBottom: '3rem' }}>
        <h2 className="cute-font" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          {isEditing ? '✏️ 앱 수정하기' : '✨ 새 앱 등록하기'}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>관리자 비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력 (기본: 1234)"
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ffb3b6' }}
            />
            <small style={{ color: 'var(--text-secondary)' }}>* 삭제 시에도 이 비밀번호가 필요합니다.</small>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>앱 이름</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="예) 단어 시험 타이머"
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>카테고리</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
            >
              {CATEGORIES.filter(c => c !== '전체').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>앱 링크 URL</label>
            <input 
              type="url" 
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://..."
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>앱 설명 및 해시태그</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="예) #타이머 #수업 깔끔한 타이머 앱입니다."
              required
              rows={4}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ 
                flex: 1,
                padding: '1rem', 
                background: isEditing ? '#a1c4fd' : 'var(--primary-color)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '16px',
                fontSize: '1.2rem',
                fontFamily: 'Jua, sans-serif',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              {isSubmitting ? '저장 중...' : (isEditing ? '수정 완료' : '등록하기 ✨')}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  padding: '1rem 2rem',
                  background: 'white',
                  color: 'var(--text-secondary)',
                  border: '2px solid #ccc',
                  borderRadius: '16px',
                  fontFamily: 'Jua, sans-serif',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="cute-font" style={{ marginBottom: '1rem', fontSize: '1.5rem', textAlign: 'center' }}>
        등록된 앱 목록 ({apps.length}개)
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {apps.map(app => (
          <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.7)', borderRadius: '12px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: '#ffdde1', color: '#ff758c', borderRadius: '4px', marginRight: '0.5rem' }}>{app.category}</span>
              <strong>{app.title}</strong>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleEditClick(app)} style={{ padding: '0.5rem 1rem', background: '#a1c4fd', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>수정</button>
              <button onClick={() => handleDelete(app.id)} style={{ padding: '0.5rem 1rem', background: '#fc8181', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>삭제</button>
            </div>
          </div>
        ))}
        {apps.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>등록된 앱이 없습니다.</div>}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <a href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>메인 화면으로 돌아가기</a>
      </div>
    </div>
  );
}
