'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Image } from 'antd';
import { FolderViewOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next'; // ✅ Import i18n
import ArtifactModal from '@/components/layout/artifacts/ArtifactModal';
import AddArtifactModal from '@/components/layout/artifacts/AddArtifactModal';
import '@ant-design/v5-patch-for-react-19';

export default function ArtifactsPage() {
    const { t, i18n } = useTranslation(); // ✅ Hook i18n

    const [artifacts, setArtifacts] = useState([]);
    const [detailVI, setDetailVI] = useState(null);
    const [detailEN, setDetailEN] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const fetchArtifacts = async () => {
        try {
            const lang = i18n.language || 'vi'; // fallback nếu undefined
            const res = await fetch(`/api/artifacts?lang=${lang}`);
            const data = await res.json();
            setArtifacts(data);
        } catch (error) {
            console.error(t('artifacts.fetch_error'), error);
        }
    };

    useEffect(() => {
        fetchArtifacts();
    }, []);

    const openModal = async (artifactId) => {
        setLoadingDetail(true);
        setIsModalOpen(true);
        try {
            const lang = i18n.language || 'vi';
            const [viRes, enRes] = await Promise.all([
                fetch(`/api/artifacts/${artifactId}?lang=vi`),
                fetch(`/api/artifacts/${artifactId}?lang=en`),
            ]);

            const viData = await viRes.json();
            const enData = await enRes.json();

            setDetailVI(viData);
            setDetailEN(enData);
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

    const columns = [
        {
            title: t('artifacts.index'),
            key: 'index',
            render: (_, __, index) => index + 1,
            align: 'center',
            width: 70,
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
            render: (url) => <Image width={80} src={url} />,
            align: 'center',
        },
        {
            title: t('artifacts.action'),
            key: 'action',
            render: (_, record) => (
                <Button
                    icon={<FolderViewOutlined />}
                    onClick={() => openModal(record.ArtifactId)}
                />
            ),
            align: 'center',
        },
    ];

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
                dataSource={artifacts}
                columns={columns}
                rowKey="ArtifactId"
                pagination={{ pageSize: 5 }}
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
