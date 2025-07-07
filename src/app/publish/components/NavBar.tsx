'use client';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function NavBar() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState('');
  
  useEffect(() => {
    setUserInfo(Cookies.get('user_info') || '');
  }, []);
  const checkLoginAndPush = (url: string) => {
    
    if (!userInfo || userInfo === 'undefined') {
      toast('请先登录');
      router.push('/login');
    } else {
      router.push(url);
    }
  };

  let username = '';
  try {
    username = userInfo ? JSON.parse(userInfo).username || '' : '';
  } catch {
    username = '';
  }

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-20">
      <div className="w-full mx-auto flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 px-2 sm:px-4 py-2 sm:py-0 gap-2 sm:gap-0">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-blue-700">Snowhite</span>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
          <Button
            type="default"
            icon={<span>🚗</span>}
            className="font-semibold !px-3 !py-1 !rounded-lg !border-none !bg-black !text-white hover:!bg-gray-900 w-full sm:w-auto"
            onClick={() => checkLoginAndPush('/publish/create')}
          >
            发布行程
          </Button>
          <Button
            type="primary"
            icon={<span>🏠</span>}
            className="font-semibold !px-3 !py-1 !rounded-lg w-full sm:w-auto"
            style={{ background: '#1677ff', borderColor: '#1677ff' }}
            onClick={() => checkLoginAndPush('/publish/create-accommodation')}
          >
            发布住宿
          </Button>
          <Button
            type="primary"
            icon={<span>🛒</span>}
            className="font-semibold !px-3 !py-1 !rounded-lg w-full sm:w-auto"
            style={{ background: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => checkLoginAndPush('/publish/create-marketplace')}
          >
            出售物品
          </Button>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          {/* <span className="flex items-center text-xs border px-2 py-0.5 rounded text-blue-700 border-blue-200 bg-blue-50">
            <span className="mr-1">🇨🇳</span>中文
          </span> */}
          {
            username && <span className="text-gray-700 text-sm">欢迎, {username}</span>
          }
          
          {/* 登录 */}
           <Button type="primary" onClick={()=>router.push('/login')}>登录</Button>  
          {/* <Button type="default" size="small" className="!rounded">
            个人中心
          </Button> */}
        </div>
      </div>
    </header>
  );
}
