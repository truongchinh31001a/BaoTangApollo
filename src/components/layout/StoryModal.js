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
} from 'antd';

export default function StoryModal({
    open,
    onClose,
    detailVI,
    detailEN,
    loading,
    onRefresh,
}) {
    const [isEditingLang, setIsEditingLang] = useState(null); // 'vi' | 'en' | null
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

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

    const renderViewTab = (data, lang) => (
        <>
            {data?.ImageUrl && <Image src={data.ImageUrl} width="100%" className="mb-3" />}
            <p><strong>Title:</strong> {data?.Title}</p>
            <p><strong>Content:</strong></p>
            <div className="border p-2 bg-gray-50 rounded whitespace-pre-line">{data?.Content}</div>
            {data?.AudioUrl && (
                <audio src={data.AudioUrl} controls className="w-full mt-3" />
            )}
            <div className="mt-4">
                <Button onClick={() => startEdit(lang)}>Sửa {lang.toUpperCase()}</Button>
            </div>
        </>
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
            <Space>
                <Button onClick={() => setIsEditingLang(null)}>Hủy</Button>
                <Button type="primary" onClick={handleSave} loading={submitting}>
                    Lưu
                </Button>
            </Space>
        </Form>
    );

    const items = [
        {
            key: 'vi',
            label: 'Tiếng Việt',
            children: isEditingLang === 'vi' ? renderEditTab() : renderViewTab(detailVI, 'vi'),
        },
        {
            key: 'en',
            label: 'English',
            children: isEditingLang === 'en' ? renderEditTab() : renderViewTab(detailEN, 'en'),
        },
    ];

    return (
        <Modal
            title="Chi tiết Story"
            open={open}
            onCancel={() => {
                setIsEditingLang(null);
                onClose();
            }}
            footer={
                <Button danger onClick={handleDelete}>
                    Xóa Story
                </Button>
            }
            width={700}
        >
            {loading ? <p>Đang tải...</p> : <Tabs items={items} />}
        </Modal>
    );
}
