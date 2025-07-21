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
import { useTranslation } from 'react-i18next';
import UploadCloudinary from '@/components/common/UploadCloudinary';

export default function StoryModal({
    open,
    onClose,
    detailVI,
    detailEN,
    loading,
    onRefresh,
}) {
    const { t } = useTranslation(); // ✅ i18n hook
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

            if (!res.ok) throw new Error('Update failed');

            if (
                values.ImageUrl &&
                values.ImageUrl !==
                (isEditingLang === 'vi' ? detailVI?.ImageUrl : detailEN?.ImageUrl)
            ) {
                await fetch(`/api/storyImg/${storyId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ ImageUrl: values.ImageUrl }),
                });
            }

            message.success(t('stories.update_success'));
            setIsEditingLang(null);
            form.resetFields();
            onClose();
            onRefresh?.();
        } catch (err) {
            console.error(err);
            message.error(t('stories.update_failed'));
        }
        setSubmitting(false);
    };

    const handleDelete = async () => {
        Modal.confirm({
            title: t('stories.delete_confirm'),
            okText: t('common.delete'),
            okType: 'danger',
            cancelText: t('common.cancel'),
            onOk: async () => {
                try {
                    const res = await fetch(`/api/stories/${storyId}`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });
                    if (!res.ok) throw new Error('Delete failed');
                    message.success(t('stories.deleted'));
                    onClose();
                    onRefresh?.();
                } catch (err) {
                    console.error(err);
                    message.error(t('stories.delete_failed'));
                }
            },
        });
    };

    const renderViewTab = (data) => (
        <Descriptions bordered column={2}>
            <Descriptions.Item label={t('stories.name')} span={2}>
                {data?.Title}
            </Descriptions.Item>
            <Descriptions.Item label={t('stories.content')} span={2}>
                {data?.Content}
            </Descriptions.Item>
            <Descriptions.Item label={t('stories.image')} span={2}>
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
            <Descriptions.Item label={t('stories.audio')} span={2}>
                {data?.AudioUrl ? (
                    <audio
                        src={data.AudioUrl}
                        controls
                        className="w-full"
                        style={{ maxHeight: 60 }}
                    />
                ) : (
                    t('common.no_data')
                )}
            </Descriptions.Item>
        </Descriptions>
    );

    const renderEditFields = () => (
        <>
            <Form.Item label={t('stories.name')} name="Title" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label={t('stories.content')} name="Content" rules={[{ required: true }]}>
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label={t('stories.audio')} name="AudioUrl">
                <UploadCloudinary
                    value={form.getFieldValue('AudioUrl')}
                    onUploaded={(url) => form.setFieldValue('AudioUrl', url)}
                    accept="audio/*"
                    folder="museum/audio"
                />
            </Form.Item>
            <Form.Item label={t('stories.image')} name="ImageUrl">
                <UploadCloudinary
                    value={form.getFieldValue('ImageUrl')}
                    onUploaded={(url) => form.setFieldValue('ImageUrl', url)}
                    accept="image/*"
                    folder="museum/stories"
                />
            </Form.Item>
        </>
    );

    const renderFooter = () => {
        if (isEditingLang) {
            return (
                <Space>
                    <Button
                        onClick={() => {
                            setIsEditingLang(null);
                            form.resetFields();
                        }}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button type="primary" onClick={handleSave} loading={submitting}>
                        {t('common.save')}
                    </Button>
                </Space>
            );
        }

        return (
            <Space>
                <Button onClick={() => startEdit(activeTab)}>{t('common.edit')}</Button>
                <Button danger onClick={handleDelete}>
                    {t('common.delete')}
                </Button>
            </Space>
        );
    };

    return (
        <Modal
            title={t('stories.detail_modal_title')}
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
                <p>{t('common.loading')}</p>
            ) : (
                <Form form={form} layout="vertical">
                    <Tabs
                        activeKey={activeTab}
                        onChange={(key) => {
                            setActiveTab(key);
                            if (!isEditingLang) setIsEditingLang(null);
                        }}
                        items={[
                            {
                                key: 'vi',
                                label: t('common.vietnamese'),
                                children:
                                    isEditingLang === 'vi'
                                        ? renderEditFields()
                                        : renderViewTab(detailVI),
                            },
                            {
                                key: 'en',
                                label: t('common.english'),
                                children:
                                    isEditingLang === 'en'
                                        ? renderEditFields()
                                        : renderViewTab(detailEN),
                            },
                        ]}
                    />
                </Form>
            )}
        </Modal>
    );
}
