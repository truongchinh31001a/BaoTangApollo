'use client';

import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import UploadCloudinary from '@/components/common/UploadCloudinary';
import TranslationTabs from './TranslationTabs';
import { useTranslation } from 'react-i18next';

export default function AddArtifactModal({ open, onClose, onRefresh }) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('vi');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const translations = ['vi', 'en'].map((lang) => ({
                LanguageCode: lang,
                Name: values?.Translations?.[lang]?.Name || '',
                Description: values?.Translations?.[lang]?.Description || '',
                AudioUrl: values?.Translations?.[lang]?.AudioUrl || '',
                VideoUrl: values?.Translations?.[lang]?.VideoUrl || '',
            }));

            const payload = {
                ImageUrl: values.ImageUrl,
                Translations: translations,
            };

            setLoading(true);
            const res = await fetch('/api/artifacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(t('artifacts.add_error'));
            message.success(t('artifacts.add_success'));
            form.resetFields();
            onClose();
            onRefresh?.();
        } catch (err) {
            message.error(err.message || t('artifacts.add_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            title={t('artifacts.add_title')}
            okText={t('artifacts.save')}
            cancelText={t('artifacts.cancel')}
            confirmLoading={loading}
            width={700}
        >
            <Form layout="vertical" form={form}>
                {/* Upload ảnh chính */}
                <Form.Item label={t('artifacts.image_label')}>
                    <UploadCloudinary
                        folder="artifacts"
                        accept="image/*"
                        onUploaded={(res) => {
                            const imageUrl = res?.url;
                            if (typeof imageUrl === 'string') {
                                form.setFieldValue('ImageUrl', imageUrl);
                            }
                        }}
                    />
                </Form.Item>
                <Form.Item name="ImageUrl" hidden>
                    <Input />
                </Form.Item>

                {/* Tabs đa ngôn ngữ */}
                <TranslationTabs form={form} activeTab={activeTab} setActiveTab={setActiveTab} />
            </Form>
        </Modal>
    );
}
