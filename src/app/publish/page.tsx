'use client';
import React, { useState } from 'react';
import NavBar from './components/NavBar';
import TabsBar from './components/TabsBar';

import RideshareList from './components/RideshareList';

import AccommodationList from './components/AccommodationList';

import SecondHandList from './components/SecondHandList';
import FloatingButton from './components/FloatingButton';


export default function PublishPage() {
  const [activeTab, setActiveTab] = useState('1');

  return (
    <div className="min-h-screen bg-[#eaf2ff]">
      <NavBar />
      <TabsBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* 拼车 */}
      {activeTab === '1' && (
        <RideshareList />
      )}
      {/* 住宿 */}
      {activeTab === '2' && (
        <>
        <AccommodationList />
        </>
      )}
      {/* 二手市场  */}
      {activeTab === '3' && (
        <>
          <SecondHandList />
        </>
      )}
      {/* 预留：activeTab === '3' 二手市场 */}
      <FloatingButton />
    </div>
  );
}
