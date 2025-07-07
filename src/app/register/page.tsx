'use client';
import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        // 注册成功后自动登录
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const loginData = await loginRes.json();
        if (loginData.success) {
          toast.success('注册并自动登录成功');
          router.push('/');
        } else {
          toast.success('注册成功，请手动登录');
          router.push('/login');
        }
      } else {
        toast.error(data.message || '注册失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa] px-2">
      <Card
        className="w-full max-w-sm sm:max-w-md md:max-w-lg shadow-lg !p-4 sm:!p-6"
        title={<div className="text-center font-bold text-lg">注册</div>}
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
          onClick={handleRegister}
          disabled={!username || !password}
          className="!h-12"
        >
          注册
        </Button>
        <div className="mt-4 text-center">
          已有账号？{' '}
          <a href="/login" className="text-blue-600">
            登录
          </a>
        </div>
      </Card>
    </div>
  );
}
