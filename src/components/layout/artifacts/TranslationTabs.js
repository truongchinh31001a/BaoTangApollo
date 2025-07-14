'use client';

import React from 'react';
import { Form, Input, Select, Tabs } from 'antd';
import UploadCloudinary from '@/components/common/UploadCloudinary';

export default function TranslationTabs({ form, activeTab, setActiveTab }) {
    const tabs = ['vi', 'en'].map((lang) => {
        const isVI = lang === 'vi';

        return {
            key: lang,
            label: isVI ? 'Tiếng Việt' : 'English',
            children: (
                <>
                    <Form.Item
                        name={['Translations', lang, 'Name']}
                        label={isVI ? 'Tên hiện vật' : 'Artifact Name'}
                        rules={[{ required: true, message: isVI ? 'Vui lòng nhập tên!' : 'Please enter name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name={['Translations', lang, 'Description']}
                        label={isVI ? 'Mô tả' : 'Description'}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        name={['Translations', lang, 'MediaType']}
                        label={isVI ? 'Loại media' : 'Media Type'}
                        initialValue="audio"
                    >
                        <Select
                            options={[
                                { label: 'Audio', value: 'audio' },
                                { label: 'Video', value: 'video' },
                            ]}
                        />
                    </Form.Item>

                    {/* Upload Section: dùng shouldUpdate để render lại đúng khi MediaType đổi */}
                    <Form.Item shouldUpdate={(prev, curr) =>
                        prev?.Translations?.[lang]?.MediaType !== curr?.Translations?.[lang]?.MediaType
                    }>
                        {() => {
                            const mediaType = form.getFieldValue(['Translations', lang, 'MediaType']);
                            const isVideo = mediaType === 'video';

                            return isVideo ? (
                                <>
                                    <Form.Item label={isVI ? 'Tải lên Video' : 'Upload Video'}>
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
                                    <Form.Item label={isVI ? 'Tải lên Audio' : 'Upload Audio'}>
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
