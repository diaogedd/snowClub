'use client';
import { Card, Button, Input, Pagination, Spin, Empty, Select, DatePicker, Checkbox, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import ContactButton from './ContactButton';

const { Option } = Select;
const PAGE_SIZE = 5;

interface RideshareItem {
  from?: string;
  to?: string;
  tag?: string;
  date?: string;
  sortOrder?: string;
  onlySeeking?: boolean;
  keyword?: string;
  departTime?: string;
  isSeeking?: boolean;
  seats?: string;
  desc?: string;
  createdAt?: string;
  wechat?: string;
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

export default function RideshareList() {
  const [list, setList] = useState<RideshareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  // 筛选状态
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    tag: '',
    date: null,
    sortOrder: 'desc',
    onlySeeking: false,
    keyword: ''
  });

  useEffect(() => {
    setLoading(true);
    fetch('/api/publish/rideshare')
      .then((res) => res.json())
      .then((data) => {
        setList(Array.isArray(data) ? data.reverse() : []);
        setLoading(false);
      });
  }, []);

  // 综合筛选函数
  const filtered = list.filter((item) => {
    // 关键词筛选
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const fromMatch = item.from && item.from.toLowerCase().includes(keyword);
      const toMatch = item.to && item.to.toLowerCase().includes(keyword);
      const descMatch = item.desc && item.desc.toLowerCase().includes(keyword);
      if (!fromMatch && !toMatch && !descMatch) return false;
    }

    // 出发地筛选
    if (filters.from && item.from && !item.from.toLowerCase().includes(filters.from.toLowerCase())) {
      return false;
    }

    // 目的地筛选
    if (filters.to && item.to && !item.to.toLowerCase().includes(filters.to.toLowerCase())) {
      return false;
    }

    // 标签筛选
    if (filters.tag && item.tag !== filters.tag) {
      return false;
    }

    // 日期筛选
    if (filters.date && item.departTime) {
      const itemDate = dayjs(item.departTime || '');
      const filterDate = dayjs(filters.date || '');
      if (!itemDate.isSame(filterDate, 'day')) {
        return false;
      }
    }

    // 只看求车信息筛选
    if (filters.onlySeeking && !item.isSeeking) {
      return false;
    }

    return true;
  });

  // 排序
  const sorted = [...filtered].sort((a, b) => {
    if (filters.sortOrder === 'asc') {
      return new Date(a.departTime || '').getTime() - new Date(b.departTime || '').getTime();
    } else {
      return new Date(b.departTime || '').getTime() - new Date(a.departTime || '').getTime();
    }
  });

  // 分页
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      from: '',
      to: '',
      tag: '',
      date: null,
      sortOrder: 'desc',
      onlySeeking: false,
      keyword: ''
    });
    setPage(1);
  };

  // 应用筛选
  const applyFilters = () => {
    setPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2">
      {/* 筛选表单 */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mt-2 mb-8">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
            <Input 
              placeholder="出发地" 
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              style={{ width: '100%' }} 
            />
            <Input 
              placeholder="目的地" 
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              style={{ width: '100%' }} 
            />
            <Select 
              placeholder="选择相关雪山（可选）" 
              value={filters.tag}
              onChange={(value) => setFilters({ ...filters, tag: value })}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="Falls Creek">Falls Creek</Option>
              <Option value="Mt Buller">Mt Buller</Option>
              <Option value="Mt Hotham">Mt Hotham</Option>
            </Select>
            <DatePicker 
              placeholder="选择日期" 
              value={filters.date}
              onChange={(date) => setFilters({ ...filters, date })}
              style={{ width: '100%' }} 
            />
            <Select 
              value={filters.sortOrder}
              onChange={(value) => setFilters({ ...filters, sortOrder: value })}
              style={{ width: '100%' }}
            >
              <Option value="desc">时间从远到近</Option>
              <Option value="asc">时间从近到远</Option>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
            <Checkbox 
              checked={filters.onlySeeking}
              onChange={(e) => setFilters({ ...filters, onlySeeking: e.target.checked })}
              className="mr-2"
            >
              只看求车信息
            </Checkbox>
            <div className="flex gap-2 sm:ml-auto w-full sm:w-auto">
              <Button onClick={resetFilters} className="w-full sm:w-auto">
                重置
              </Button>
              <Button type="primary" onClick={applyFilters} className="w-full sm:w-auto">
                筛选
              </Button>
            </div>
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
          <Card key={item.createdAt || idx} style={{
            marginBottom: '10px',
          }} className="rounded-xl mb-2 shadow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-1 sm:gap-2">
                  <span className="font-semibold text-base sm:text-lg text-gray-900">{item.from}</span>
                  <span className="mx-1 sm:mx-2 text-gray-400">→</span>
                  <span className="font-semibold text-base sm:text-lg text-gray-900">{item.to}</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">{item.isSeeking ? '求车坑' : '有车坑'}</span>
                  <span className="text-gray-500 text-xs">{item.seats}</span>
                </div>
                <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-1">
                  <span className="mr-1">🕐</span>
                  {formatTime(item.departTime || '')}
                  <span className="ml-2 text-gray-400">•</span>
                  <span className="ml-2">{formatTime(item.createdAt || '')}</span>
                </div>
                <div className="flex items-center text-green-700 text-xs"><span className="mr-1">📍</span>{item.tag}</div>
                <div className="text-gray-400 text-xs mt-1">{item.desc}</div>
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
          total={sorted.length}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
