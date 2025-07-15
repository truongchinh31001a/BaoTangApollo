'use client';

import React from 'react';
import { Form, Input, Select, Tabs } from 'antd';
import UploadCloudinary from '@/components/common/UploadCloudinary';
import { useTranslation } from 'react-i18next'; // ✅

export default function TranslationTabs({ form, activeTab, setActiveTab }) {
    const { t } = useTranslation(); // ✅

    const tabs = ['vi', 'en'].map((lang) => {
        const label = lang === 'vi' ? t('artifacts.translation.lang_vi') : t('artifacts.translation.lang_en');

        return {
            key: lang,
            label,
            children: (
                <>
                    <Form.Item
                        name={['Translations', lang, 'Name']}
                        label={t('artifacts.translation.name')}
                        rules={[{ required: true, message: t('artifacts.translation.name_required') }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name={['Translations', lang, 'Description']}
                        label={t('artifacts.translation.description')}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        name={['Translations', lang, 'MediaType']}
                        label={t('artifacts.translation.media_type')}
                        initialValue="audio"
                    >
                        <Select
                            options={[
                                { label: 'Audio', value: 'audio' },
                                { label: 'Video', value: 'video' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item shouldUpdate={(prev, curr) =>
                        prev?.Translations?.[lang]?.MediaType !== curr?.Translations?.[lang]?.MediaType
                    }>
                        {() => {
                            const mediaType = form.getFieldValue(['Translations', lang, 'MediaType']);
                            const isVideo = mediaType === 'video';

                            return isVideo ? (
                                <>
                                    <Form.Item label={t('artifacts.translation.upload_video')}>
                                        <UploadCloudinary
                                            folder="artifacts/video"
                                            accept="video/*"
                                            onUploaded={(res) =>
                                                form.setFieldValue(['Translations', lang, 'VideoUrl'], res?.url || null)
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item name={['Translations', lang, 'VideoUrl']} hidden>
                                        <Input />
                                    </Form.Item>
                                </>
                            ) : (
                                <>
                                    <Form.Item label={t('artifacts.translation.upload_audio')}>
                                        <UploadCloudinary
                                            folder="artifacts/audio"
                                            accept="audio/*"
                                            onUploaded={(res) =>
                                                form.setFieldValue(['Translations', lang, 'AudioUrl'], res?.url || null)
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item name={['Translations', lang, 'AudioUrl']} hidden>
                                        <Input />
                                    </Form.Item>
                                </>
                            );
                        }}
                    </Form.Item>
                </>
            ),
        };
    });

    return <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs} />;
}
