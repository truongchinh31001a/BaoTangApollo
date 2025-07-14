'use client';

import { Upload, message, Image } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Dragger } = Upload;

export default function UploadCloudinary({ onUploaded, folder = '', accept = 'image/*' }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [resourceType, setResourceType] = useState(null);
    const [loading, setLoading] = useState(false);

    const detectType = (mime) => {
        if (mime.startsWith('image/')) return 'image';
        if (mime.startsWith('video/')) return 'video';
        if (mime.startsWith('audio/')) return 'audio';
        return 'raw';
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        setResourceType(null);
        onUploaded?.(null); // Gửi null về form nếu cần reset
    };

    const customUpload = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        setLoading(true);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload thất bại');

            const type = detectType(file.type);
            setPreviewUrl(data.url);
            setResourceType(type);
            message.success('Tải lên thành công');
            onSuccess(data);
            onUploaded?.(data);
        } catch (err) {
            message.error(err.message);
            onError?.(err);
        } finally {
            setLoading(false);
        }
    };

    const renderPreview = () => {
        if (!previewUrl) return null;

        return (
            <div className="mb-3 text-center">
                {resourceType === 'image' && <Image src={previewUrl} alt="preview" width={200} />}
                {resourceType === 'video' && <video src={previewUrl} controls width={300} className="rounded-md" />}
                {resourceType === 'audio' && <audio src={previewUrl} controls className="w-full" />}
                <div className="mt-2">
                    <button
                        onClick={handleRemove}
                        className="text-red-500 hover:underline flex items-center justify-center gap-1"
                    >
                        <DeleteOutlined /> Xoá file
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col items-center justify-center">
            {renderPreview()}
            {!previewUrl && (
                <Dragger
                    name="file"
                    accept={accept}
                    customRequest={customUpload}
                    showUploadList={false}
                    disabled={loading}
                    maxCount={1}
                    style={{ width: '100%' }}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Kéo thả hoặc nhấn để chọn file</p>
                    <p className="ant-upload-hint">Hỗ trợ ảnh, video, audio. Tối đa 10MB.</p>
                </Dragger>
            )}
        </div>
    );
}
