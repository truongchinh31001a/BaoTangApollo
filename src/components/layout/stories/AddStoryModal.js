'use client';

import { Modal, Form, Input, Button, Switch, Tabs, message, Select } from 'antd';
import { useState } from 'react';
import UploadCloudinary from '@/components/common/UploadCloudinary';

export default function AddStoryModal({ open, onClose, onRefresh, artifactOptions = [] }) {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const body = {
                IsGlobal: values.IsGlobal,
                ArtifactId: values.ArtifactId || null,
                ImageUrl: imageUrl || null,
                Translations: [
                    {
                        LanguageCode: 'vi',
                        Title: values.vi_Title,
                        Content: values.vi_Content,
                        AudioUrl: values.vi_AudioUrl || null,
                    },
                    {
                        LanguageCode: 'en',
                        Title: values.en_Title,
                        Content: values.en_Content,
                        AudioUrl: values.en_AudioUrl || null,
                    },
                ],
            };

            const res = await fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error('Thêm thất bại');
            message.success('Thêm câu chuyện thành công!');
            onClose();
            onRefresh?.();
            form.resetFields();
            setImageUrl(null);
        } catch (err) {
            message.error(err.message || 'Lỗi khi thêm câu chuyện');
        }
        setSubmitting(false);
    };

    const tabItems = [
        {
            key: 'vi',
            label: 'Tiếng Việt',
            children: (
                <>
                    <Form.Item
                        label="Tiêu đề (VI)"
                        name="vi_Title"
                        rules={[{ required: true, message: 'Nhập tiêu đề' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung (VI)"
                        name="vi_Content"
                        rules={[{ required: true, message: 'Nhập nội dung' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Audio (VI)" name="vi_AudioUrl">
                        <UploadCloudinary
                            value={form.getFieldValue('vi_AudioUrl')}
                            onUploaded={(url) => {
                                // ✅ An toàn hơn
                                form.setFieldsValue({ vi_AudioUrl: url });
                            }}
                            accept="audio/*"
                            folder="museum/audio"
                        />
                    </Form.Item>
                </>
            ),
        },
        {
            key: 'en',
            label: 'English',
            children: (
                <>
                    <Form.Item
                        label="Title (EN)"
                        name="en_Title"
                        rules={[{ required: true, message: 'Enter title' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Content (EN)"
                        name="en_Content"
                        rules={[{ required: true, message: 'Enter content' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Audio (EN)" name="en_AudioUrl">
                        <UploadCloudinary
                            value={form.getFieldValue('en_AudioUrl')}
                            onUploaded={(url) => {
                                form.setFieldsValue({ en_AudioUrl: url });
                            }}
                            accept="audio/*"
                            folder="museum/audio"
                        />
                    </Form.Item>
                </>
            ),
        },
    ];

    return (
        <Modal
            title="Thêm Câu Chuyện"
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            <Form layout="vertical" form={form}>
                <Form.Item label="Gắn với hiện vật" name="ArtifactId">
                    <Select
                        allowClear
                        showSearch
                        placeholder="Chọn hiện vật (nếu có)"
                        options={artifactOptions}
                        optionFilterProp="label"
                    />
                </Form.Item>

                <Form.Item label="Hiển thị toàn bộ (IsGlobal)" name="IsGlobal" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item label="Ảnh (Image)">
                    <UploadCloudinary
                        value={imageUrl}
                        onUploaded={setImageUrl}
                        accept="image/*"
                        folder="museum/stories"
                    />
                </Form.Item>

                <Tabs className="mt-4" defaultActiveKey="vi" items={tabItems} />

                <div className="flex justify-end mt-4">
                    <Button onClick={onClose} className="mr-2">
                        Hủy
                    </Button>
                    <Button type="primary" loading={submitting} onClick={handleSubmit}>
                        Thêm mới
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
