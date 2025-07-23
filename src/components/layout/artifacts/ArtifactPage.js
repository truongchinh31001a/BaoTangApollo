'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { Table, Button, Tooltip } from 'antd';
import { FolderViewOutlined, PlusOutlined } from '@ant-design/icons';
import ArtifactModal from '@/components/layout/artifacts/ArtifactModal';
import AddArtifactModal from '@/components/layout/artifacts/AddArtifactModal';
import '@ant-design/v5-patch-for-react-19';

export default function ArtifactsPage() {
    const { t, i18n } = useTranslation();
    const searchParams = useSearchParams();

    const queryLang = searchParams.get('lang');
    const cookieLang = Cookies.get('lang');
    const lang = queryLang || cookieLang || 'vi';

    const [artifacts, setArtifacts] = useState([]);
    const [detailVI, setDetailVI] = useState(null);
    const [detailEN, setDetailEN] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        i18n.changeLanguage(lang);
        Cookies.set('lang', lang);
        fetchArtifacts();
    }, [lang]);

    const fetchArtifacts = async () => {
        try {
            const res = await fetch(`/api/artifacts?lang=${lang}`);
            const data = await res.json();
            setArtifacts(data);
        } catch (error) {
            console.error(t('artifacts.fetch_error'), error);
        }
    };

    const openModal = async (artifactId) => {
        setLoadingDetail(true);
        setIsModalOpen(true);
        try {
            const [viRes, enRes] = await Promise.all([
                fetch(`/api/artifacts/${artifactId}?lang=vi`),
                fetch(`/api/artifacts/${artifactId}?lang=en`),
            ]);

            setDetailVI(await viRes.json());
            setDetailEN(await enRes.json());
        } catch (error) {
            console.error(t('artifacts.detail_error'), error);
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
            title: t('artifacts.index'),
            key: 'index',
            render: (_, __, index) => index + 1,
            align: 'center',
            width: 60,
        },
        {
            title: t('artifacts.name'),
            dataIndex: 'Name',
            key: 'name',
            align: 'center',
        },
        {
            title: t('artifacts.image'),
            dataIndex: 'ImageUrl',
            key: 'image',
            align: 'center',
            width: 400,
            render: (url) => (
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            borderRadius: 4,
                            background: '#f5f5f5',
                        }}
                    >
                        <img
                            src={url}
                            alt="artifact"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                </div>
            ),
        },
        {
            title: t('artifacts.action'),
            key: 'action',
            width: 120,
            align: 'center',
            ellipsis: true,
            render: (_, record) => (
                <Tooltip title={t('artifacts.view')}>
                    <Button
                        icon={<FolderViewOutlined />}
                        onClick={() => openModal(record.ArtifactId)}
                    />
                </Tooltip>
            ),
        },
    ], [t]);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{t('artifacts.title')}</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    {t('artifacts.add_new')}
                </Button>
            </div>

            <Table
                bordered
                dataSource={artifacts}
                columns={columns}
                rowKey="ArtifactId"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 'max-content' }}
            />

            <ArtifactModal
                open={isModalOpen}
                onClose={closeModal}
                detailVI={detailVI}
                detailEN={detailEN}
                loading={loadingDetail}
                onRefresh={fetchArtifacts}
            />

            <AddArtifactModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onRefresh={fetchArtifacts}
            />
        </div>
    );
}
