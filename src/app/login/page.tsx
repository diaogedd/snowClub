'use client';
import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('登录成功');
        router.back();
      } else {
        toast.error(data.message || '登录失败');
      }
    } catch (e) {
      toast.error('网络错误'+e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa] px-2">
      <Card
        className="w-full max-w-sm sm:max-w-md md:max-w-lg shadow-lg !p-4 sm:!p-6"
        title={<div className="text-center font-bold text-lg">登录</div>}
      >
        <div className="mb-4">
          <Input
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="large"
            autoFocus
          />
        </div>
        <div className="mb-4">
          <Input.Password
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="large"
          />
        </div>
        <Button
          type="primary"
          block
          size="large"
          loading={loading}
          onClick={handleLogin}
          disabled={!username || !password}
          className="!h-12"
        >
          登录
        </Button>
        <div className="mt-4 text-center">
          没有账号？{' '}
          <a href="/register" className="text-blue-600">
            注册
          </a>
        </div>
      </Card>
    </div>
  );
}
