'use client';

import React, { useState } from 'react';
import {
    Modal,
    Image,
    Tabs,
    Button,
    Space,
    message,
    Form,
    Input,
} from 'antd';

export default function ArtifactModal({
    open,
    onClose,
    detailVI,
    detailEN,
    loading,
    onRefresh,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const artifactId = detailVI?.ArtifactId;

    const handleEdit = () => {
        setEditName(detailVI?.Name || '');
        setEditDescription(detailVI?.Description || '');
        setIsEditing(true);
    };

    const handleSave = async () => {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/artifacts/${artifactId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Name: editName,
                    Description: editDescription,
                    lang: 'vi',
                }),
            });

            if (!res.ok) throw new Error('Lỗi khi cập nhật');
            message.success('Cập nhật thành công');
            setIsEditing(false);
            onRefresh?.();
        } catch (err) {
            message.error('Cập nhật thất bại');
        }
        setSubmitting(false);
    };

    const handleDelete = async () => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa hiện vật này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const res = await fetch(`/api/artifacts/${artifactId}`, {
                        method: 'DELETE',
                    });
                    if (!res.ok) throw new Error('Xóa thất bại');
                    message.success('Đã xóa hiện vật');
                    onClose();
                    onRefresh?.();
                } catch (err) {
                    message.error('Lỗi khi xóa hiện vật');
                }
            },
        });
    };

    const renderVITab = () => {
        if (isEditing) {
            return (
                <Form layout="vertical">
                    <Form.Item label="Tên">
                        <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Mô tả">
                        <Input.TextArea
                            rows={4}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            );
        }

        return detailVI ? (
            <>
                <Image
                    src={detailVI.ImageUrl}
                    alt={detailVI.Name}
                    width="100%"
                    className="mb-3"
                />
                <p><strong>Tên:</strong> {detailVI.Name}</p>
                <p><strong>Mô tả:</strong> {detailVI.Description}</p>
                <video src={detailVI.VideoUrl} controls className="w-full mt-3" />
                <audio src={detailVI.AudioUrl} controls className="w-full mt-3" />
            </>
        ) : (
            <p>Không có dữ liệu</p>
        );
    };

    const renderENTab = () => {
        return detailEN ? (
            <>
                <Image
                    src={detailEN.ImageUrl}
                    alt={detailEN.Name}
                    width="100%"
                    className="mb-3"
                />
                <p><strong>Name:</strong> {detailEN.Name}</p>
                <p><strong>Description:</strong> {detailEN.Description}</p>
                <video src={detailEN.VideoUrl} controls className="w-full mt-3" />
                <audio src={detailEN.AudioUrl} controls className="w-full mt-3" />
            </>
        ) : (
            <p>No data available</p>
        );
    };

    const items = [
        { key: 'vi', label: 'Tiếng Việt', children: renderVITab() },
        { key: 'en', label: 'English', children: renderENTab() },
    ];

    return (
        <Modal
            title="Chi tiết hiện vật"
            open={open}
            onCancel={() => {
                setIsEditing(false);
                onClose();
            }}
            footer={
                <Space>
                    {isEditing ? (
                        <>
                            <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                            <Button
                                type="primary"
                                loading={submitting}
                                onClick={handleSave}
                            >
                                Lưu
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleEdit}>Sửa</Button>
                            <Button danger onClick={handleDelete}>Xóa</Button>
                        </>
                    )}
                    <Button onClick={onClose}>Đóng</Button>
                </Space>
            }
            width={700}
        >
            {loading || !detailVI || !detailEN ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <Tabs items={items} />
            )}
        </Modal>
    );
}
