'use client';

import React from 'react';
import { Menu } from 'antd';
import {
  PieChartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t } = useTranslation();

  const items = [
    {
      key: 'dashboard',
      icon: <PieChartOutlined />,
      label: <Link href="/">{t('sidebar.dashboard')}</Link>,
    },
    {
      key: 'manage',
      icon: <AppstoreOutlined />,
      label: t('sidebar.manage'),
      children: [
        {
          key: 'tickets',
          label: <Link href="/tickets">{t('sidebar.tickets')}</Link>,
        },
        {
          key: 'artifacts',
          label: <Link href="/artifacts">{t('sidebar.artifacts')}</Link>,
        },
        {
          key: 'artifact-locations',
          label: (
            <Link href="/artifact-locations">
              {t('sidebar.artifact_locations')}
            </Link>
          ),
        },
        {
          key: 'stories',
          label: <Link href="/stories">{t('sidebar.stories')}</Link>,
        },
        {
          key: 'map-zones',
          label: <Link href="/map-zones">{t('sidebar.map_zones')}</Link>,
        },
      ],
    },
  ];

  return (
    <>
      <div className="flex justify-center p-4">
        <Image
          src="/logo/logo.jpg"
          alt="Museum Logo"
          width={120}
          height={60}
          style={{ objectFit: 'contain' }}
        />
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={['dashboard']}
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
