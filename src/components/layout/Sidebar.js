'use client';

import React from 'react';
import { Menu } from 'antd';
import {
  PieChartOutlined,
  BarChartOutlined,
  UserOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const items = [
  {
    key: '1',
    icon: <PieChartOutlined />,
    label: <Link href="/">Dashboard</Link>,
  },
  {
    key: '2',
    icon: <BarChartOutlined />,
    label: <Link href="/analytics">Analytics</Link>,
  },
  {
    key: 'manage',
    icon: <AppstoreOutlined />,
    label: 'Manage',
    children: [
      { key: 'tickets', label: <Link href="/tickets">Tickets</Link> },
      { key: 'artifacts', label: <Link href="/artifacts">Artifacts</Link> },
      {
        key: 'artifact-locations',
        label: <Link href="/artifact-locations">Artifact Locations</Link>,
      },
      { key: 'stories', label: <Link href="/stories">Stories</Link> },
      { key: 'map-zones', label: <Link href="/map-zones">Map Zones</Link> },
    ],
  },
  {
    key: '4',
    icon: <UserOutlined />,
    label: <Link href="/admins">Admins</Link>,
  },
];

const Sidebar = () => {
  return (
    <>
      <div
        style={{
          padding: '16px',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#000',
        }}
      >
        Museum Admin
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        items={items}
        style={{
          background: '#fff',
          color: '#000',
          borderRight: 'none',
        }}
        rootClassName="custom-sidebar-menu"
      />
    </>
  );
};

export default Sidebar;
