'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, Dropdown, Typography, Skeleton, message } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

export default function HeaderApp({ collapsed, setCollapsed }) {
    const router = useRouter();
    const { t } = useTranslation();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me', {
                    method: 'GET',
                    credentials: 'include', 
                });
                if (!res.ok) throw new Error('Unauthorized');
                const data = await res.json();
                setUser({
                    name: data.username,
                    avatarUrl: `https://ui-avatars.com/api/?name=${data.username}&background=random`,
                });
            } catch (err) {
                message.error(t('auth.session_expired') || 'Phiên đăng nhập hết hạn');
                router.push('/auth');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogoutClick = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (err) {
            console.error('Logout failed');
        } finally {
            router.push('/auth');
        }
    };


    const handleMenuClick = ({ key }) => {
        switch (key) {
            case 'profile':
                message.warning("This feature is not implemented yet");
                break;
            case 'settings':
                message.warning("This feature is not implemented yet");
                break;
            case 'logout':
                handleLogoutClick();
                break;
            default:
                break;
        }
    };

    const menu = {
        items: [
            {
                key: 'profile',
                icon: <UserOutlined />,
                label: t('profile'),
            },
            {
                key: 'settings',
                icon: <SettingOutlined />,
                label: t('settings'),
            },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: t('logout'),
            },
        ],
        onClick: handleMenuClick,
    };

    return (
        <header className="w-full px-6 py-4 bg-white shadow-sm flex justify-between items-center">
            <div
                className="text-xl cursor-pointer text-gray-700"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>

            <div className="flex items-center gap-3 pr-2">
                <div className="pr-3">
                    <LanguageSwitcher />
                </div>

                {loading ? (
                    <Skeleton.Button active size="small" shape="round" />
                ) : (
                    <>
                        <Text className="font-medium text-gray-800">{user?.name}</Text>
                        <Dropdown menu={menu} placement="bottomRight" trigger={['click']}>
                            <Avatar
                                src={user?.avatarUrl}
                                size="large"
                                className="cursor-pointer"
                            />
                        </Dropdown>
                    </>
                )}
            </div>
        </header>
    );
}
