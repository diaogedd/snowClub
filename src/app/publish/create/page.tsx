'use client';
import { useRouter } from 'next/navigation';
import { Button, DatePicker, Input, Select, Checkbox, Form } from 'antd';
import { toast } from 'react-hot-toast';

const { Option } = Select;

export default function CreateRidesharePage() {
  const router = useRouter();

  interface RideshareFormValues {
    departTime?: string;
    from?: string;
    to?: string;
    seats?: string;
    phone?: string;
    wechat?: string;
    isSeeking?: boolean;
    tag?: string;
  }

  const onFinish = async (values: RideshareFormValues) => {
    try {
      await fetch('/api/publish/rideshare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      toast.success('发布成功');
      router.push('/publish');
    } catch {
      toast.error('发布失败');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaf2ff] px-2 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6 sm:p-10">
        <div className="flex items-center mb-6">
          <Button type="link" className="!p-0 !h-auto !text-blue-600" onClick={() => router.back()}>&lt; 返回</Button>
          <span className="ml-2 text-2xl font-bold">发布车位</span>
        </div>
        <Form layout="vertical" onFinish={onFinish} initialValues={{ seats: '4人' }}>
          <Form.Item label="出发时间" name="departTime" required>
            <DatePicker showTime format="YYYY/MM/DD HH:mm" className="w-full h-12" placeholder="MM/DD/YYYY HH:mm" />
          </Form.Item>
          <Form.Item label="出发地" name="from" required>
            <Input placeholder="出发地" className="h-12" />
          </Form.Item>
          <Form.Item label="目的地" name="to" required>
            <Input placeholder="目的地" className="h-12" />
          </Form.Item>
          <Form.Item label="剩余位置" name="seats" required>
            <Select className="h-12">
              <Option value="1人">1人</Option>
              <Option value="2人">2人</Option>
              <Option value="3人">3人</Option>
              <Option value="4人">4人</Option>
              <Option value="5人">5人</Option>
              <Option value="6人">6人</Option>
            </Select>
          </Form.Item>
          <Form.Item label="联系电话" name="phone" required>
            <Input placeholder="联系电话" className="h-12" />
          </Form.Item>
          <Form.Item label="微信号" name="wechat">
            <Input placeholder="微信号" className="h-12" />
          </Form.Item>
          <Form.Item name="isSeeking" valuePropName="checked">
            <Checkbox>我是求车坑</Checkbox>
          </Form.Item>
          <Form.Item label="常用目的地标签" name="tag">
            <Select placeholder="选择相关雪山（可选）" className="h-12">
              <Option value="Falls Creek">Falls Creek</Option>
              <Option value="Mt Buller">Mt Buller</Option>
              <Option value="Mt Hotham">Mt Hotham</Option>
            </Select>
          </Form.Item>
          <Form.Item label="行程说明（不超过50字）" name="desc">
            <Input.TextArea placeholder="行程说明（不超过50字）" maxLength={50} rows={3} className="resize-none" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full !h-12 !bg-black !border-black text-base">发布</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
