'use client';

import { Modal, Form, Input, Button, Switch, Tabs, message, Select } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UploadCloudinary from '@/components/common/UploadCloudinary';

export default function AddStoryModal({ open, onClose, onRefresh, artifactOptions = [] }) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const body = {
                IsGlobal: values.IsGlobal || false,
                ArtifactId: values.ArtifactId || null,
                ImageUrl: values.ImageUrl || null,
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

            if (!res.ok) throw new Error(t('stories.add_failed'));

            message.success(t('stories.add_success'));
            onClose();
            onRefresh?.();
            form.resetFields();
        } catch (err) {
            message.error(err.message || t('stories.add_failed'));
        }
        setSubmitting(false);
    };

    const tabItems = [
        {
            key: 'vi',
            label: t('common.vietnamese'),
            children: (
                <>
                    <Form.Item
                        label={t('stories.title_vi')}
                        name="vi_Title"
                        rules={[{ required: true, message: t('stories.title_required') }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t('stories.content_vi')}
                        name="vi_Content"
                        rules={[{ required: true, message: t('stories.content_required') }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate>
                        {() => (
                            <Form.Item label={t('stories.audio_vi')} name="vi_AudioUrl">
                                <UploadCloudinary
                                    value={form.getFieldValue('vi_AudioUrl' || '')}
                                    onUploaded={(url) =>
                                        form.setFieldsValue({ vi_AudioUrl: url })
                                    }
                                    accept="audio/*"
                                    folder="museum/audio"
                                />
                            </Form.Item>
                        )}
                    </Form.Item>
                </>
            ),
        },
        {
            key: 'en',
            label: t('common.english'),
            children: (
                <>
                    <Form.Item
                        label={t('stories.title_en')}
                        name="en_Title"
                        rules={[{ required: true, message: t('stories.title_required') }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t('stories.content_en')}
                        name="en_Content"
                        rules={[{ required: true, message: t('stories.content_required') }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate>
                        {() => (
                            <Form.Item label={t('stories.audio_en')} name="en_AudioUrl">
                                <UploadCloudinary
                                    value={form.getFieldValue('en_AudioUrl')}
                                    onUploaded={(url) =>
                                        form.setFieldsValue({ en_AudioUrl: url })
                                    }
                                    accept="audio/*"
                                    folder="museum/audio"
                                />
                            </Form.Item>
                        )}
                    </Form.Item>
                </>
            ),
        },
    ];

    return (
        <Modal
            title={t('stories.add_modal_title')}
            open={open}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            footer={null}
            width={700}
        >
            <Form layout="vertical" form={form}>
                <Form.Item label={t('stories.artifact')} name="ArtifactId">
                    <Select
                        allowClear
                        showSearch
                        placeholder={t('stories.select_artifact')}
                        options={artifactOptions}
                        optionFilterProp="label"
                    />
                </Form.Item>

                <Form.Item
                    label={t('stories.is_global')}
                    name="IsGlobal"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item label={t('stories.image')} name="ImageUrl">
                    <UploadCloudinary
                        value={form.getFieldValue('ImageUrl')}
                        onUploaded={(url) => form.setFieldValue('ImageUrl', url)}
                        accept="image/*"
                        folder="museum/stories"
                    />
                </Form.Item>

                <Tabs className="mt-4" defaultActiveKey="vi" items={tabItems} />

                <div className="flex justify-end mt-4">
                    <Button onClick={onClose} className="mr-2">
                        {t('common.cancel')}
                    </Button>
                    <Button type="primary" loading={submitting} onClick={handleSubmit}>
                        {t('common.add')}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
