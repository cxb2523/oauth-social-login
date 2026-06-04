import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, loading, logout, updateProfile } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setFormData({
        displayName: user.displayName || user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      });
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <nav className="nav">
        <div className="nav-brand">OAuth2.0 Demo</div>
        <div className="nav-user">
          <img src={user.avatar} alt="avatar" className="nav-avatar" />
          <span>{user.displayName || user.username}</span>
          <button className="btn-secondary" onClick={logout}>退出登录</button>
        </div>
      </nav>
      <div className="profile-card">
        <div className="profile-header">
          <img src={user.avatar} alt="avatar" className="profile-avatar" />
          <div>
            <h2>{user.displayName || user.username}</h2>
            <p style={{ color: '#666' }}>{user.email}</p>
            <p style={{ color: '#999', fontSize: '14px' }}>
              通过 {user.provider === 'github' ? 'GitHub' : 'Google'} 登录
            </p>
          </div>
        </div>

        {!isEditing ? (
          <div>
            <div className="form-group">
              <label>个人简介</label>
              <p>{user.bio || '暂无简介'}</p>
            </div>
            <div className="form-group">
              <label>所在地</label>
              <p>{user.location || '未设置'}</p>
            </div>
            <div className="form-group">
              <label>个人网站</label>
              <p>{user.website || '未设置'}</p>
            </div>
            <button className="btn-primary" onClick={() => setIsEditing(true)}>
              编辑资料
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>显示名称</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>个人简介</label>
              <textarea
                rows="3"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>所在地</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>个人网站</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? '保存中...' : '保存修改'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              取消
            </button>
          </form>
        )}
      </div>
    </>
  );
}
