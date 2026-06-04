import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { accessToken, refreshToken, error } = router.query;

    if (error) {
      console.error('Authentication error:', error);
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    if (accessToken && refreshToken) {
      Cookies.set('accessToken', accessToken, { expires: 1 });
      Cookies.set('refreshToken', refreshToken, { expires: 7 });
      router.push('/profile');
    }
  }, [router.query]);

  return (
    <div className="callback-container">
      <div className="spinner"></div>
      <h2>正在处理登录...</h2>
      <p>请稍候，正在完成认证</p>
    </div>
  );
}
