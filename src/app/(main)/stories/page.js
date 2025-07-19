'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Tag } from 'antd';
import { FolderViewOutlined, PlusOutlined } from '@ant-design/icons';
import StoryModal from '@/components/layout/stories/StoryModal';
import AddStoryModal from '@/components/layout/stories/AddStoryModal';
import '@ant-design/v5-patch-for-react-19';

export default function StoriesPage() {
    const [stories, setStories] = useState([]);
    const [artifacts, setArtifacts] = useState([]); // 👈 Thêm state để lấy danh sách hiện vật
    const [detailVI, setDetailVI] = useState(null);
    const [detailEN, setDetailEN] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 👈 THÊM MISSING STATE
    const [loadingDetail, setLoadingDetail] = useState(false);

    const fetchStories = async () => {
        const res = await fetch('/api/stories');
        const data = await res.json();
        setStories(data);
    };

    const fetchArtifacts = async () => {
        const res = await fetch('/api/artifacts');
        const data = await res.json();
        setArtifacts(data);
    };

    useEffect(() => {
        fetchStories();
        fetchArtifacts(); // 👈 Gọi API hiện vật để lấy options
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
            title: 'Title',
            dataIndex: 'Title',
            key: 'title',
            align: 'center',
            render: (title) => <span>{title}</span>,
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
            render: (date) => new Date(date).toLocaleDateString(),
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
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold mb-4">Danh sách Stories</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Thêm mới
                </Button>
            </div>

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

            <AddStoryModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onRefresh={fetchStories}
                artifactOptions={artifacts.map((a) => ({
                    value: a.ArtifactId,
                    label: a.Name,
                }))}
            />
        </div>
    );
}
