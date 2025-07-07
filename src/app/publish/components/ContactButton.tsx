import { Button, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ContactButtonProps {
  wechat?: string;
  desc?: string;
}

const ContactButton: React.FC<ContactButtonProps> = ({ wechat, desc }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  // 检查登录状态
  const checkLogin = () => {
    const userInfo = Cookies.get('user_info');
    return !!userInfo && userInfo !== 'undefined';
  };

  const handleClick = () => {
    const loggedIn = checkLogin();
    if (loggedIn) {
      setModalOpen(true);
    } else {
      toast('请先登录');
      router.push('/login');
    }
  };

  return (
    <>
      <Button className="w-full sm:w-auto" onClick={handleClick}>
        联系方式
      </Button>
      <Modal
        open={modalOpen}
        title="联系方式"
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        okText="知道了"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div>
          <div>微信：{wechat || '未提供'}</div>
          <div>备注：{desc || '无'}</div>
        </div>
      </Modal>
    </>
  );
};

export default ContactButton; 