'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { Table, Button, Tooltip } from 'antd';
import { FolderViewOutlined, PlusOutlined } from '@ant-design/icons';
import StoryModal from '@/components/layout/stories/StoryModal';
import AddStoryModal from '@/components/layout/stories/AddStoryModal';
import '@ant-design/v5-patch-for-react-19';

export default function StoriesPage() {
    const { t, i18n } = useTranslation();
    const searchParams = useSearchParams();

    const queryLang = searchParams.get('lang');
    const cookieLang = Cookies.get('lang');
    const lang = queryLang || cookieLang || 'vi';

    const [stories, setStories] = useState([]);
    const [artifacts, setArtifacts] = useState([]);
    const [detailVI, setDetailVI] = useState(null);
    const [detailEN, setDetailEN] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        i18n.changeLanguage(lang);
        Cookies.set('lang', lang);
        fetchStories();
        fetchArtifacts();
    }, [lang]);

    const fetchStories = async () => {
        const res = await fetch(`/api/stories?lang=${lang}`);
        const data = await res.json();
        setStories(data);
    };

    const fetchArtifacts = async () => {
        const res = await fetch(`/api/artifacts?lang=${lang}`);
        const data = await res.json();
        setArtifacts(data);
    };

    const openModal = async (storyId) => {
        setLoadingDetail(true);
        setIsModalOpen(true);
        try {
            const [viRes, enRes] = await Promise.all([
                fetch(`/api/stories/${storyId}?lang=vi`),
                fetch(`/api/stories/${storyId}?lang=en`),
            ]);
            setDetailVI(await viRes.json());
            setDetailEN(await enRes.json());
        } catch (err) {
            console.error('Lỗi lấy chi tiết story:', err);
        }
        setLoadingDetail(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setDetailVI(null);
        setDetailEN(null);
    };

    const columns = useMemo(() => [
        {
            title: t('stories.index'),
            key: 'index',
            render: (_, __, index) => index + 1,
            align: 'center',
            width: 60,
        },
        {
            title: t('stories.name'),
            dataIndex: 'Title',
            key: 'title',
            align: 'center',
        },
        {
            title: t('stories.image'),
            dataIndex: 'ImageUrl',
            key: 'image',
            align: 'center',
            width: 400,
            render: (url) =>
                url ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={url} alt="story" width={80} />
                    </div>
                ) : (
                    <i>{t('common.no_data')}</i>
                ),
        },
        {
            title: t('stories.created_at'),
            dataIndex: 'CreatedAt',
            key: 'created',
            align: 'center',
            width: 200,
            render: (date) =>
                new Date(date).toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }),
        },
        {
            title: t('stories.action'),
            key: 'action',
            align: 'center',
            width: 120,
            ellipsis: true,
            render: (_, record) => (
                <Tooltip title={t('stories.view')}>
                    <Button
                        icon={<FolderViewOutlined />}
                        onClick={() => openModal(record.StoryId)}
                    />
                </Tooltip>
            ),
        },
    ], [t, lang]);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold mb-4">{t('stories.title')}</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    {t('stories.add_new')}
                </Button>
            </div>

            <Table
                bordered
                dataSource={stories}
                columns={columns}
                rowKey="StoryId"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 'max-content' }}
            />

            <StoryModal
                open={isModalOpen}
                onClose={closeModal}
                detailVI={detailVI}
                detailEN={detailEN}
                loading={loadingDetail}
                onRefresh={fetchStories}
            />

            {isAddModalOpen && (
                <AddStoryModal
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onRefresh={fetchStories}
                    artifactOptions={artifacts.map((a) => ({
                        value: a.ArtifactId,
                        label: a.Name,
                    }))}
                />
            )}
        </div>
    );
}
