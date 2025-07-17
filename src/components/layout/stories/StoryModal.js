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
        });
        setIsEditingLang(lang);
    };

    const handleSave = async () => {
        const values = form.getFieldsValue();
        setSubmitting(true);
        try {
            const res = await fetch(`/api/stories/${storyId}?lang=${isEditingLang}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(values),
            });

            if (!res.ok) throw new Error('Cập nhật thất bại');
            message.success('Cập nhật thành công');
            setIsEditingLang(null);
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

    const renderEditTab = () => (
        <Form layout="vertical" form={form}>
            <Form.Item label="Title" name="Title" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Content" name="Content" rules={[{ required: true }]}>
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Audio URL" name="AudioUrl">
                <Input />
            </Form.Item>
        </Form>
    );

    const items = [
        {
            key: 'vi',
            label: 'Tiếng Việt',
            children:
                isEditingLang === 'vi'
                    ? renderEditTab()
                    : renderViewTab(detailVI),
        },
        {
            key: 'en',
            label: 'English',
            children:
                isEditingLang === 'en'
                    ? renderEditTab()
                    : renderViewTab(detailEN),
        },
    ];

    const renderFooter = () => {
        if (isEditingLang) {
            return (
                <Space>
                    <Button onClick={() => setIsEditingLang(null)}>Hủy</Button>
                    <Button
                        type="primary"
                        onClick={handleSave}
                        loading={submitting}
                    >
                        Lưu
                    </Button>
                </Space>
            );
        }

        return (
            <Space>
                <Button
                    onClick={() => startEdit(activeTab)}
                >
                    Sửa
                </Button>
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
                onClose();
            }}
            footer={renderFooter()}
            width={700}
        >
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <Tabs
                    items={items}
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key);
                        if (!isEditingLang) setIsEditingLang(null);
                    }}
                />
            )}
        </Modal>
    );
}
