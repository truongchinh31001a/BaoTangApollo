'use client';

import { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '@/components/layout/Sidebar';
import HeaderApp from '@/components/layout/Header';

const { Sider, Content } = Layout;

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sider
        width={220}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        collapsedWidth={0}
        trigger={null}
        breakpoint="lg"
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          zIndex: 100,
        }}
      >
        <Sidebar />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 0 : 220, transition: 'all 0.2s' }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 150,
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <HeaderApp collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        <Content style={{ padding: '16px', minHeight: '100vh', background: '#f9f9f9' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
