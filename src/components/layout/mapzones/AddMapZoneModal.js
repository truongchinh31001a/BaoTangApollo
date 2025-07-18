'use client';

import React, { useEffect, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Button,
    message,
} from 'antd';
import UploadCloudinary from '@/components/common/UploadCloudinary';

export default function AddMapZoneModal({ open, onClose, onSuccess }) {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    // ✅ Reset form mỗi khi mở modal
    useEffect(() => {
        if (open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const res = await fetch('/api/map-zones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(values),
            });

            if (!res.ok) throw new Error('Lỗi tạo Map Zone');

            message.success('Tạo Map Zone thành công!');
            form.resetFields();
            onClose();
            onSuccess?.();
        } catch (err) {
            console.error(err);
            message.error('Không thể tạo Map Zone');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            title="Thêm Map Zone"
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={submitting}
                    onClick={handleSubmit}
                >
                    Tạo
                </Button>,
            ]}
            destroyOnHidden // ✅ đảm bảo unmount form mỗi lần đóng
        >
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
                    rules={[{ required: true, message: 'Vui lòng nhập tầng' }]}
                >
                    <InputNumber
                        min={0}
                        step={1}
                        style={{ width: '100%' }}
                        stringMode={false}
                        parser={(value) => value?.replace(/[^\d]/g, '') ?? ''}
                    />
                </Form.Item>

                <Form.Item
                    label="Ảnh bản đồ"
                    name="MapImageUrl"
                    rules={[{ required: true, message: 'Vui lòng tải lên ảnh bản đồ' }]}
                    valuePropName="value" // ✅ dùng đúng với UploadCloudinary
                >
                    <UploadCloudinary
                        folder="image"
                        accept="image/*"
                        onUploaded={(url) => {
                            form.setFieldValue('MapImageUrl', url || null);
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
