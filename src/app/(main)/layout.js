'use client';

import { useState } from 'react';
import { Layout } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import Sidebar from '@/components/layout/Sidebar';

const { Sider, Header, Content } = Layout;

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sider
        width={220}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
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
        <Header
          style={{
            padding: '0 16px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined
              style={{ fontSize: 18 }}
              onClick={() => setCollapsed(false)}
            />
          ) : (
            <MenuFoldOutlined
              style={{ fontSize: 18 }}
              onClick={() => setCollapsed(true)}
            />
          )}
          <span style={{ marginLeft: 12, fontWeight: 500 }}>Museum Admin</span>
        </Header>

        <Content style={{ padding: '16px', minHeight: '100vh', background: '#f9f9f9' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
