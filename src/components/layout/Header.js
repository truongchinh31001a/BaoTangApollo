'use client';

import { Avatar, Dropdown, Typography } from 'antd';
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
    const user = {
        name: 'Hoạt Nguyễn',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
    };

    const handleLogoutClick = () => {
        router.push('/auth');
    };

    const handleMenuClick = ({ key }) => {
        switch (key) {
            case 'profile':
                router.push('/profile');
                break;
            case 'settings':
                router.push('/settings');
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

                <div className='pr-3'>
                    <LanguageSwitcher />
                </div>

                <Text className="font-medium text-gray-800">{user.name}</Text>
                <Dropdown menu={menu} placement="bottomRight" trigger={['click']}>
                    <Avatar
                        src={user.avatarUrl}
                        size="large"
                        className="cursor-pointer"
                    />
                </Dropdown>
            </div>
        </header>
    );
}
