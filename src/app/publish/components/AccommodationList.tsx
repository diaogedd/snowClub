"use client";
import { Card, Button, Tag, Input, Pagination, Spin, Empty, Select, DatePicker, Checkbox, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import ContactButton from './ContactButton'
import Image from 'next/image';

const { Option } = Select;
const PAGE_SIZE = 5;

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

// 格式化日期范围
const formatDateRange = (startDate: string | number | Date, endDate: string | number | Date) => {
  if (!startDate || !endDate) return '';
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return `${startDate} - ${endDate}`;
    }
    const startStr = start.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    const endStr = end.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    return `${startStr} - ${endStr}`;
  } catch {
    return `${startDate} - ${endDate}`;
  }
};

interface AccommodationFilters {
  location: string;
  type: string;
  date: Date | null;
  onlyNeedAccommodation: boolean;
  keyword: string;
}

interface AccommodationItem {
  title?: string;
  location?: string;
  type?: string;
  price?: number;
  unit?: string;
  needAccommodation?: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  desc?: string;
  images?: string[];
  wechat?: string;
  name?: string;
}

export default function AccommodationFilterList() {
  const [list, setList] = useState<AccommodationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  // 所有筛选条件
  const [filters, setFilters] = useState<AccommodationFilters>({
    location: '',
    type: '',
    date: null,
    onlyNeedAccommodation: false,
    keyword: '',
  });

  useEffect(() => {
    setLoading(true);
    fetch('/api/publish/accommodation')
      .then((res) => res.json())
      .then((data) => {
        setList(Array.isArray(data) ? data.reverse() : []);
        setLoading(false);
      });
  }, []);

  // 综合筛选
  const filtered = list.filter((item) => {
    // 关键词筛选
    if (filters.keyword) {
      const keyword = filters.keyword;
      const titleMatch = item.title && item.title.includes(keyword);
      const locationMatch = item.location && item.location.includes(keyword);
      const descMatch = item.desc && item.desc.includes(keyword);
      if (!titleMatch && !locationMatch && !descMatch) return false;
    }
    // 位置筛选
    if (filters.location && item.location && !item.location.includes(filters.location)) {
      return false;
    }
    // 类型筛选
    if (filters.type && item.type !== filters.type) {
      return false;
    }
    // 入住日期筛选
    if (filters.date && item.startDate) {
      const itemDate = new Date(item.startDate);
      const filterDate = new Date(filters.date);
      if (
        itemDate.getFullYear() !== filterDate.getFullYear() ||
        itemDate.getMonth() !== filterDate.getMonth() ||
        itemDate.getDate() !== filterDate.getDate()
      ) {
        return false;
      }
    }
    // 只看需要住宿
    if (filters.onlyNeedAccommodation && !item.needAccommodation) {
      return false;
    }
    return true;
  });

  // 分页
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      location: '',
      type: '',
      date: null,
      onlyNeedAccommodation: false,
      keyword: '',
    });
    setPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2">
      {/* 综合筛选表单 */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mt-2 mb-8 px-2">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
            <Input
              placeholder="位置"
              value={filters.location}
              onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
              style={{ width: '100%' }}
            />
            <Select
              placeholder="住宿类型"
              value={filters.type || undefined}
              onChange={(value) => setFilters(f => ({ ...f, type: value }))}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="bed">床位</Option>
              <Option value="room">房间</Option>
              <Option value="whole">整租</Option>
            </Select>
            <DatePicker
              placeholder="入住日期"
              value={filters.date ? dayjs(filters.date) : null}
              onChange={(date) => setFilters(f => ({ ...f, date: date ? date.toDate() : null }))}
              style={{ width: '100%' }}
            />
            <div>
            <Checkbox
              checked={filters.onlyNeedAccommodation}
              onChange={(e) => setFilters(f => ({ ...f, onlyNeedAccommodation: e.target.checked }))}
            >
              只看需要住宿
            </Checkbox>
            </div>
           
          </div>
          <div className="flex gap-2 justify-end">
            <Button onClick={resetFilters} className="w-full sm:w-auto">重置</Button>
          </div>
        </Space>
      </div>
      {/* 列表内容 */}
      {loading ? (
        <div className="flex justify-center py-10"><Spin /></div>
      ) : paged.length === 0 ? (
        <Empty description="暂无数据" />
      ) : (
        paged.map((item, idx) => (
          <Card key={item.createdAt || idx} className="rounded-xl shadow" style={{ marginBottom: '10px' }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
              <div className="flex-1 w-full">
                <div className="font-semibold text-base sm:text-lg text-gray-900 mb-2">{item.title}</div>
                {item.name && <div className="text-xs text-gray-500 mb-1">发布人：{item.name}</div>}
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {item.type && <Tag color="blue">{item.type}</Tag>}
                  {item.price && <Tag color="green">${item.price} {item.unit}</Tag>}
                  {item.needAccommodation && <Tag color="orange">需要住宿</Tag>}
                </div>
                <div className="flex items-center text-gray-700 text-xs sm:text-sm mb-1">
                  <span className="mr-1">📍</span>{item.location}
                </div>
                <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-1">
                  <span className="mr-1">🗓️</span>
                  <span>{formatDateRange(item.startDate || '', item.endDate || '')}</span>
                  <span className="ml-2 text-gray-400">•</span>
                  <span className="ml-2">{formatTime(item.createdAt || '')}</span>
                </div>
                <div className="text-gray-400 text-xs mt-1">{item.desc}</div>
                {/* 图片展示 */}
                {item.images && Array.isArray(item.images) && item.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 mt-2">
                    {item.images.map((img, i) => (
                      <Image key={i} src={img} alt="住宿图片" width={128} height={112} className="w-32 h-28 object-cover rounded-lg border" />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-row sm:flex-col gap-2 mt-2 sm:mt-0 md:ml-6 w-full sm:w-auto">
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
