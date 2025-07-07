'use client';
import { Tabs } from 'antd';

const tabItems = [
  { key: '1', label: <span className="text-base px-5">拼车</span> },
  { key: '2', label: <span className="text-base px-5">住宿</span> },
  { key: '3', label: <span className="text-base px-5">二手市场</span> },
];

export default function TabsBar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (key: string) => void;
}) {
  return (
    <div className="max-w-4xl mx-auto mt-4 sm:mt-8 px-2 flex justify-center">
      <div className="bg-white rounded-t-xl px-2 pt-2 pb-0.5 w-full flex justify-center">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="custom-tabs"
          moreIcon={null}
          tabBarGutter={16}
          centered
          renderTabBar={(props, DefaultTabBar) => (
            <DefaultTabBar {...props} className="!border-b-0 flex justify-center" />
          )}
        />
      </div>
    </div>
  );
}
