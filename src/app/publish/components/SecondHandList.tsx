"use client";
import { Card, Tag, Input, Pagination, Spin, Empty ,Space} from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs'
import ContactButton from './ContactButton'
const PAGE_SIZE = 5;

interface SecondHandItem {
  title?: string;
  location?: string;
  desc?: string;
  info?: string;
  tags?: string[] | string;
  price?: number;
  images?: string[];
  createdAt?: string;
  wechat?: string;
  name?: string;
}

// 时间格式化函数
const formatTime = (time: string | number | Date) => {
  if (!time) return '';
  try {
    const date = new Date(time);
    return dayjs(date).format('YYYY-MM-DD');
  } catch {
    return String(time);
  }
};

// 递归检查任意字段是否包含关键词
function matchAnyField(obj: unknown, kw: string): boolean {
  if (obj == null) return false;
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return String(obj).toLowerCase().includes(kw);
  }
  if (Array.isArray(obj)) {
    return obj.some((v) => matchAnyField(v, kw));
  }
  if (typeof obj === 'object') {
    return Object.values(obj).some((v) => matchAnyField(v, kw));
  }
  return false;
}

export default function SecondHandList() {
  const [list, setList] = useState<SecondHandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/publish/marketplace')
      .then((res) => res.json())
      .then((data) => {
        setList(Array.isArray(data) ? data.reverse() : []);
        setLoading(false);
      });
  }, []);

  // 筛选
  const filtered = list.filter((item) => {
    if (!keyword.trim()) return true;
    const kw = keyword.trim().toLowerCase();
    return matchAnyField(item, kw);
  });

  // 分页
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2">
            {/* 综合筛选表单 */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mt-2 mb-8 px-2">
        <Space direction="vertical" style={{ width: '100%' }} size="large">

            <Input
              placeholder="关键词筛选（任意字段）"
              size="large"
              value={keyword}
              onChange={e => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              className="w-full"
            />

        </Space>
      </div>
      {loading ? (
        <div className="flex justify-center py-10"><Spin /></div>
      ) : paged.length === 0 ? (
        <Empty description="暂无数据" />
      ) : (
        paged.map((item, idx) => (
          <Card key={item.createdAt || idx} className="rounded-xl shadow" style={{
            marginBottom: '10px',
          }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
              <div className="flex-1 w-full">
                <div className="font-semibold text-base sm:text-lg text-gray-900 mb-1">{item.title}</div>
                {item.name && <div className="text-xs text-gray-500 mb-1">发布人：{item.name}</div>}
                <div className="text-gray-500 text-sm mb-1">{item.info} <span className="ml-2 text-gray-400">{item.desc}</span></div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {item.price && <Tag color="green">${item.price}</Tag>}
                  {item.tags && String(item.tags).split(',').map((t: string) => <Tag key={t}>{t}</Tag>)}
                </div>
                <div className="flex items-center text-gray-500 text-xs mb-2">
                  <span className="mr-1">🕐</span>
                  <span>发布于 {formatTime(item.createdAt || '')}</span>
                </div>
                {/* 图片展示 */}
                {item.images && Array.isArray(item.images) && item.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {item.images.map((img: string, i: number) => (
                      <img key={i} src={img} alt="二手物品" className="w-32 h-28 object-cover rounded-lg border" />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-2 md:mt-0 md:ml-6 w-full sm:w-auto">
                {/* <Button icon={<span>🔗</span>} className="w-full sm:w-auto">分享</Button> */}
                <ContactButton wechat={item.wechat} desc={item.desc} />

              </div>
            </div>
          </Card>
        ))
      )}
      <div className="flex justify-center mt-6">
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
