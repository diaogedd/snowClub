'use client';
import { Button } from 'antd';

export default function FloatingButton() {
  return (
    <Button
      type="primary"
      shape="circle"
      size="large"
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        background: '#eb2f96',
        border: 'none',
        zIndex: 30,
        width: 48,
        height: 48,
        minWidth: 48,
        minHeight: 48,
      }}
    >
      <span className="text-base">中</span>
    </Button>
  );
}
