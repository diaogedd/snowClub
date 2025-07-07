'use client';
import { useRouter } from 'next/navigation';
import { Button, Input, Form, Upload } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

export default function CreateMarketplacePage() {
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const normFile = (e: UploadFile[] | { fileList: UploadFile[] }) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFinish = async (values: Record<string, unknown>) => {
    const images = Array.isArray(values.images) ? (values.images as UploadFile[]).map((f) => f.response?.url || f.url).filter(Boolean) : [];
    const userInfo = Cookies.get('user_info') || '';
    const submitValues = { ...values, images, name: userInfo };
    try {
      await fetch('/api/publish/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitValues),
      });
      toast.success('发布成功');
      router.push('/publish');
    } catch {
      toast.error('发布失败');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa] px-2 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6 sm:p-10">
        <div className="flex  justify-between mb-6">
          <span className="ml-2 text-2xl font-bold">出售物品</span>
          <Button type="link" className="!p-0 !h-auto !text-blue-600" onClick={() => router.back()}>
            返回
          </Button>
        </div>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="商品标题" name="title" required>
            <Input placeholder="输入商品标题" className="h-12" />
          </Form.Item>
          <Form.Item label="商品描述" name="desc" required>
            <Input.TextArea placeholder="详细描述您的商品" rows={3} className="resize-none" />
          </Form.Item>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="价格 ($)" name="price" required>
              <Input placeholder="0.00" className="h-12" type="number" min={0} />
            </Form.Item>
            <Form.Item label="位置" name="location" required>
              <Input placeholder="输入位置" className="h-12" />
            </Form.Item>
          </div>
          <Form.Item label="标签" name="tags">
            <Input placeholder="例如：滑雪，单板，雪镜" className="h-12" />
            <div className="text-xs text-gray-400 mt-1">用逗号分隔标签</div>
          </Form.Item>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="联系电话" name="phone">
              <Input placeholder="输入电话号码" className="h-12" />
            </Form.Item>
            <Form.Item label="微信号" name="wechat">
              <Input placeholder="输入微信号" className="h-12" />
            </Form.Item>
          </div>
          <Form.Item label="商品照片 (0/5)" name="images" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              action="/api/publish/upload"
              listType="picture-card"
              maxCount={5}
              multiple
              onChange={({ fileList }) => setFileList(fileList)}
              fileList={fileList}
              className="w-full"
            >
              <div className="flex flex-col items-center justify-center">
                <CameraOutlined style={{ fontSize: 32, color: '#aaa' }} />
                <div className="mt-2 text-gray-500 text-xs">marketplace.photo.hint</div>
                <Button className="mt-2">选择照片</Button>
              </div>
            </Upload>
          </Form.Item>
      
          <Form.Item className="flex flex-row gap-4 mt-6">
            <Button
              className="w-1/2 !h-12 !bg-gray-100 !border-gray-100 text-base"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="w-1/2 !h-12 !bg-black !border-black text-base"
            >
              发布商品
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
