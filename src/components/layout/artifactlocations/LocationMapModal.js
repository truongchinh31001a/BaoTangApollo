'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, message } from 'antd';

export default function ArtifactLocationModal({ open, onClose, data, onRefresh }) {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [pos, setPos] = useState({ x: data?.PosX, y: data?.PosY });
    const [originalPos, setOriginalPos] = useState({ x: data?.PosX, y: data?.PosY });

    useEffect(() => {
        if (data?.PosX && data?.PosY) {
            setPos({ x: data.PosX, y: data.PosY });
            setOriginalPos({ x: data.PosX, y: data.PosY });
            setIsEditing(false);
        }
    }, [data]);

    const handleMapClick = (e) => {
        if (!isEditing) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        setPos({
            x: parseFloat(offsetX.toFixed(2)),
            y: parseFloat(offsetY.toFixed(2)),
        });
    };

    const handleStartEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setPos(originalPos);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/artifact-locations/${data.ArtifactId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ posX: pos.x, posY: pos.y }),
            });
            if (!res.ok) throw new Error('Cập nhật thất bại');
            message.success('Đã cập nhật vị trí');
            onRefresh?.();
            onClose();
        } catch (err) {
            message.error('Không thể cập nhật vị trí');
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };

    const handleDeleteArtifact = async () => {
        Modal.confirm({
            title: 'Xác nhận xoá hiện vật?',
            content: 'Thao tác này sẽ xoá toàn bộ hiện vật khỏi hệ thống!',
            okText: 'Xoá',
            okButtonProps: { danger: true },
            cancelText: 'Huỷ',
            onOk: async () => {
                try {
                    setLoading(true);
                    const res = await fetch(`/api/artifacts/${data.ArtifactId}`, {
                        method: 'DELETE',
                    });
                    if (!res.ok) throw new Error('Xoá thất bại');
                    message.success('Đã xoá hiện vật');
                    onRefresh?.();
                    onClose();
                } catch (err) {
                    message.error('Không thể xoá hiện vật');
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    return (
        <Modal
            open={open}
            onCancel={() => {
                setIsEditing(false);
                onClose();
            }}
            title={data?.ArtifactName || 'Vị trí hiện vật'}
            footer={
                isEditing
                    ? [
                          <Button key="cancel" onClick={handleCancelEdit}>
                              Huỷ
                          </Button>,
                          <Button key="save" type="primary" loading={loading} onClick={handleSave}>
                              Lưu
                          </Button>,
                      ]
                    : [
                          <Button key="edit" type="primary" onClick={handleStartEdit}>
                              Sửa vị trí
                          </Button>,
                          <Button key="delete" danger loading={loading} onClick={handleDeleteArtifact}>
                              Xoá hiện vật
                          </Button>,
                      ]
            }
            centered
            width={800}
        >
            {data?.MapImageUrl && (
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '56.25%',
                        backgroundImage: `url(${data.MapImageUrl})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        cursor: isEditing ? 'crosshair' : 'default',
                    }}
                    onClick={handleMapClick}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: pos.y,
                            left: pos.x,
                            width: 14,
                            height: 14,
                            backgroundColor: isEditing ? 'orange' : 'red',
                            borderRadius: '50%',
                            border: '2px solid white',
                            transform: 'translate(-50%, -50%)',
                        }}
                        title={`Toạ độ: (${pos.x}, ${pos.y})`}
                    />
                </div>
            )}
        </Modal>
    );
}
