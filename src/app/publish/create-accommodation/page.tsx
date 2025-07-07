'use client';
import { useRouter } from 'next/navigation';
import { Button, DatePicker, Input, Select, Checkbox, Form, Upload } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const { Option } = Select;

export default function CreateAccommodationPage() {
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
      await fetch('/api/publish/accommodation', {
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
        <div className="flex items-center mb-6">
          <Button type="link" className="!p-0 !h-auto !text-blue-600" onClick={() => router.back()}>&lt; 返回</Button>
          <span className="ml-2 text-2xl font-bold">发布住宿</span>
        </div>
        <Form layout="vertical" onFinish={onFinish} initialValues={{ unit: '每晚' }}>
          <Form.Item label="标题" name="title" required>
            <Input placeholder="住宿标题" className="h-12" />
          </Form.Item>
          <Form.Item label="描述" name="desc" required>
            <Input.TextArea placeholder="描述您的住宿" rows={3} className="resize-none" />
          </Form.Item>
          <Form.Item label="位置" name="location" required>
            <Input placeholder="位置" className="h-12" />
          </Form.Item>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="住宿类型" name="type" required>
              <Select placeholder="选择住宿类型" className="h-12">
                <Option value="bed">床位</Option>
                <Option value="room">房间</Option>
                <Option value="whole">整租</Option>
              </Select>
            </Form.Item>
            <Form.Item label="可住人数" name="capacity" required>
              <Input placeholder="可住人数" className="h-12" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="价格" name="price" required>
              <Input placeholder="价格" className="h-12" />
            </Form.Item>
            <Form.Item label="计价单位" name="unit" required>
              <Select className="h-12">
                <Option value="每晚">每晚</Option>
                <Option value="每周">每周</Option>
                <Option value="每月">每月</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="可用开始时间" name="startDate" required>
              <DatePicker className="w-full h-12" placeholder="年/月/日" />
            </Form.Item>
            <Form.Item label="可用结束时间" name="endDate" required>
              <DatePicker className="w-full h-12" placeholder="年/月/日" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="联系电话（可选）" name="phone">
              <Input placeholder="电话号码（可选）" className="h-12" />
            </Form.Item>
            <Form.Item label="微信号" name="wechat">
              <Input placeholder="微信号（可选）" className="h-12" />
            </Form.Item>
          </div>
          <Form.Item label="标签" name="tags">
            <Input placeholder="输入标签（用逗号分隔）" className="h-12" />
          </Form.Item>
          <Form.Item name="needAccommodation" valuePropName="checked">
            <Checkbox>需要住宿</Checkbox>
          </Form.Item>
          <Form.Item label="照片 (0/10)" name="images" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              action="/api/publish/upload"
              listType="picture-card"
              maxCount={10}
              multiple
              onChange={({ fileList }) => setFileList(fileList)}
              fileList={fileList}
              className="w-full"
            >
              <div className="flex flex-col items-center justify-center">
                <CameraOutlined style={{ fontSize: 32, color: '#aaa' }} />
                <div className="mt-2 text-gray-500 text-xs">您可以上传最多10张照片来展示您的住宿</div>
                <Button className="mt-2">选择照片</Button>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item className="flex flex-row gap-4 mt-6">
            <Button className="w-1/2 !h-12 !bg-gray-100 !border-gray-100 text-base" onClick={() => router.back()}>取消</Button>
            <Button type="primary" htmlType="submit" className="w-1/2 !h-12 !bg-black !border-black text-base">提交</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
