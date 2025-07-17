'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Tag } from 'antd';
import { FolderViewOutlined } from '@ant-design/icons';
import StoryModal from '@/components/layout/stories/StoryModal';
import '@ant-design/v5-patch-for-react-19';

export default function StoriesPage() {
    const [stories, setStories] = useState([]);
    const [detailVI, setDetailVI] = useState(null);
    const [detailEN, setDetailEN] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const fetchStories = async () => {
        const res = await fetch('/api/stories');
        const data = await res.json();
        setStories(data);
    };

    useEffect(() => {
        fetchStories();
    }, []);

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

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => index + 1,
            align: 'center',
            width: 70,
        },
        {
            title: 'IsGlobal',
            dataIndex: 'IsGlobal',
            key: 'isGlobal',
            align: 'center',
            render: (val) => (val ? <Tag color="green">TRUE</Tag> : <Tag color="red">FALSE</Tag>),
        },
        {
            title: 'Ảnh',
            dataIndex: 'ImageUrl',
            key: 'image',
            align: 'center',
            render: (url) =>
                url ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={url} alt="story" width={80} />
                    </div>
                ) : (
                    <i>Không có</i>
                ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'CreatedAt',
            key: 'created',
            align: 'center',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Button
                    icon={<FolderViewOutlined />}
                    onClick={() => openModal(record.StoryId)}
                />
            ),
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Danh sách Stories</h1>
            <Table
                dataSource={stories}
                columns={columns}
                rowKey="StoryId"
                pagination={{ pageSize: 5 }}
            />

            <StoryModal
                open={isModalOpen}
                onClose={closeModal}
                detailVI={detailVI}
                detailEN={detailEN}
                loading={loadingDetail}
                onRefresh={fetchStories}
            />
        </div>
    );
}
