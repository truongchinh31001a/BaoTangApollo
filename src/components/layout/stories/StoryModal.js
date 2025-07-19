'use client';

import React, { useState } from 'react';
import {
    Modal,
    Tabs,
    Image,
    Input,
    Form,
    Button,
    Space,
    message,
    Descriptions,
} from 'antd';
import UploadCloudinary from '@/components/common/UploadCloudinary';

export default function StoryModal({
    open,
    onClose,
    detailVI,
    detailEN,
    loading,
    onRefresh,
}) {
    const [isEditingLang, setIsEditingLang] = useState(null);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('vi');

    const storyId = detailVI?.StoryId || detailEN?.StoryId;

    const startEdit = (lang) => {
        const data = lang === 'vi' ? detailVI : detailEN;
        form.setFieldsValue({
            Title: data?.Title || '',
            Content: data?.Content || '',
            AudioUrl: data?.AudioUrl || '',
            ImageUrl: data?.ImageUrl || '',
        });
        setIsEditingLang(lang);
    };

    const handleSave = async () => {
        const values = form.getFieldsValue();
        setSubmitting(true);
        try {
            const res = await fetch(`/api/stories/${storyId}?lang=${isEditingLang}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(values),
            });

            if (!res.ok) throw new Error('Cập nhật thất bại');

            // Gọi API cập nhật ảnh (nếu có thay đổi)
            if (values.ImageUrl && values.ImageUrl !== (isEditingLang === 'vi' ? detailVI?.ImageUrl : detailEN?.ImageUrl)) {
                await fetch(`/api/storyImg/${storyId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ ImageUrl: values.ImageUrl }),
                });
            }

            message.success('Cập nhật thành công');
            setIsEditingLang(null);
            form.resetFields();
            onClose(); // Đóng modal
            onRefresh?.();
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi cập nhật');
        }
        setSubmitting(false);
    };

    const handleDelete = async () => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa Story này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const res = await fetch(`/api/stories/${storyId}`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });
                    if (!res.ok) throw new Error('Lỗi xoá');
                    message.success('Đã xoá Story');
                    onClose();
                    onRefresh?.();
                } catch (err) {
                    console.error(err);
                    message.error('Xóa thất bại');
                }
            },
        });
    };

    const renderViewTab = (data) => (
        <Descriptions bordered column={2}>
            <Descriptions.Item label="Tiêu đề" span={2}>
                {data?.Title}
            </Descriptions.Item>

            <Descriptions.Item label="Nội dung" span={2}>
                {data?.Content}
            </Descriptions.Item>

            <Descriptions.Item label="Ảnh minh hoạ" span={2}>
                {data?.ImageUrl && (
                    <div className="w-full" style={{ maxHeight: 300, overflow: 'hidden' }}>
                        <Image
                            src={data.ImageUrl}
                            width="100%"
                            style={{ objectFit: 'contain', maxHeight: 300 }}
                            alt="Story Image"
                        />
                    </div>
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Audio" span={2}>
                {data?.AudioUrl ? (
                    <audio
                        src={data.AudioUrl}
                        controls
                        className="w-full"
                        style={{ maxHeight: 60 }}
                    />
                ) : (
                    'Không có'
                )}
            </Descriptions.Item>
        </Descriptions>
    );

    const renderEditForm = (
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item label="Title" name="Title" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Content" name="Content" rules={[{ required: true }]}>
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Audio (upload)" name="AudioUrl">
                <UploadCloudinary
                    value={form.getFieldValue('AudioUrl')}
                    onUploaded={(url) => form.setFieldsValue({ AudioUrl: url })}
                    accept="audio/*"
                    folder="museum/audio"
                />
            </Form.Item>
            <Form.Item label="Ảnh minh hoạ (upload)" name="ImageUrl">
                <UploadCloudinary
                    value={form.getFieldValue('ImageUrl')}
                    onUploaded={(url) => form.setFieldsValue({ ImageUrl: url })}
                    accept="image/*"
                    folder="museum/stories"
                />
            </Form.Item>
        </Form>
    );

    const items = [
        {
            key: 'vi',
            label: 'Tiếng Việt',
            children: isEditingLang === 'vi' ? renderEditForm : renderViewTab(detailVI),
        },
        {
            key: 'en',
            label: 'English',
            children: isEditingLang === 'en' ? renderEditForm : renderViewTab(detailEN),
        },
    ];

    const renderFooter = () => {
        if (isEditingLang) {
            return (
                <Space>
                    <Button onClick={() => { setIsEditingLang(null); form.resetFields(); }}>
                        Hủy
                    </Button>
                    <Button type="primary" onClick={handleSave} loading={submitting}>
                        Lưu
                    </Button>
                </Space>
            );
        }

        return (
            <Space>
                <Button onClick={() => startEdit(activeTab)}>Sửa</Button>
                <Button danger onClick={handleDelete}>
                    Xoá Story
                </Button>
            </Space>
        );
    };

    return (
        <Modal
            title="Chi tiết Story"
            open={open}
            onCancel={() => {
                setIsEditingLang(null);
                form.resetFields();
                onClose();
            }}
            footer={renderFooter()}
            width={700}
        >
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key);
                        if (!isEditingLang) setIsEditingLang(null);
                    }}
                    items={items}
                />
            )}
        </Modal>
    );
}
