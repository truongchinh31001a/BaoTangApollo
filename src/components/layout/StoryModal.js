'use client';

import React from 'react';
import { Modal, Tabs, Image } from 'antd';

export default function StoryModal({ open, onClose, detailVI, detailEN, loading }) {
    const renderLangTab = (data, lang) => {
        if (!data) return <p>Không có dữ liệu</p>;
        return (
            <>
                {data.ImageUrl && <Image src={data.ImageUrl} width="100%" className="mb-3" />}
                <p><strong>Title:</strong> {data.Title}</p>
                <p><strong>Content:</strong></p>
                <div className="border p-2 bg-gray-50 rounded whitespace-pre-line">{data.Content}</div>
                {data.AudioUrl && (
                    <audio src={data.AudioUrl} controls className="w-full mt-3" />
                )}
            </>
        );
    };

    const items = [
        {
            key: 'vi',
            label: 'Tiếng Việt',
            children: renderLangTab(detailVI, 'vi'),
        },
        {
            key: 'en',
            label: 'English',
            children: renderLangTab(detailEN, 'en'),
        },
    ];

    return (
        <Modal
            title="Chi tiết Story"
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            {loading ? <p>Đang tải...</p> : <Tabs items={items} />}
        </Modal>
    );
}
