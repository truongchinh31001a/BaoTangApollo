'use client';

import React, { useState } from 'react';
import {
    Modal,
    Descriptions,
    Image,
    Button,
    Space,
    Form,
    Input,
    InputNumber,
    message,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    SaveOutlined,
    RollbackOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { AlignCenter } from 'lucide-react';

export default function MapZoneModal({ open, onClose, data, onRefresh }) {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    if (!data) return null;

    const handleEditClick = () => {
        form.setFieldsValue({
            Name: data.Name,
            Floor: data.Floor,
            MapImageUrl: data.MapImageUrl,
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const res = await fetch(`/api/map-zones/${data.ZoneId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Cập nhật thất bại');
            message.success('Cập nhật thành công!');
            setIsEditing(false);
            onRefresh?.();
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi cập nhật');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/map-zones/${data.ZoneId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Xoá thất bại');
            message.success('Đã xoá khu vực thành công!');
            onClose();
            onRefresh?.();
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi xoá');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = () => {
        Modal.confirm({
            title: 'Xác nhận xoá khu vực',
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có chắc chắn muốn xoá "${data.Name}" không?`,
            okText: 'Xoá',
            okType: 'danger',
            cancelText: 'Huỷ',
            onOk: handleDelete,
        });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title="Chi tiết Map Zone"
            footer={
                isEditing ? (
                    <Space>
                        <Button icon={<RollbackOutlined />} onClick={handleCancelEdit}>
                            Huỷ
                        </Button>
                        <Button
                            icon={<SaveOutlined />}
                            type="primary"
                            loading={loading}
                            onClick={handleSave}
                        >
                            Lưu
                        </Button>
                    </Space>
                ) : (
                    <Space>
                        <Button icon={<EditOutlined />} onClick={handleEditClick}>
                            Sửa
                        </Button>
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            loading={loading}
                            onClick={confirmDelete}
                        >
                            Xoá
                        </Button>
                    </Space>
                )
            }
        >
            {isEditing ? (
                <Form layout="vertical" form={form}>
                    <Form.Item
                        label="Tên khu"
                        name="Name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khu' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tầng"
                        name="Floor"
                        rules={[{ required: true, message: 'Vui lòng nhập số tầng' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="URL ảnh bản đồ"
                        name="MapImageUrl"
                        rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            ) : (
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Ảnh bản đồ">
                        <Image src={data.MapImageUrl} width={200} style={{alignItems: 'center'}} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên khu">{data.Name}</Descriptions.Item>
                    <Descriptions.Item label="Tầng">{data.Floor}</Descriptions.Item>
                </Descriptions>
            )}
        </Modal>
    );
}
