'use client';

import { Upload, message, Image } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Dragger } = Upload;

export default function UploadCloudinary({
    onUploaded,
    folder = '',
    accept = 'image/*',
    value, // ✅ nhận giá trị từ form
}) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [resourceType, setResourceType] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ Đồng bộ khi mở form có giá trị cũ
    useEffect(() => {
        if (value) {
            setPreviewUrl(value);
            setResourceType(detectType(value));
        } else {
            setPreviewUrl(null);
            setResourceType(null);
        }
    }, [value]);

    const detectType = (urlOrMime) => {
        if (typeof urlOrMime !== 'string') return 'raw';
        if (urlOrMime.includes('.mp4') || urlOrMime.includes('video/')) return 'video';
        if (urlOrMime.includes('.mp3') || urlOrMime.includes('audio/')) return 'audio';
        if (urlOrMime.includes('.jpg') || urlOrMime.includes('.png') || urlOrMime.includes('image/')) return 'image';
        return 'raw';
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        setResourceType(null);
        onUploaded?.(null); // thông báo cho Form xoá giá trị
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

            const url = data.url;
            const type = detectType(file.type);

            setPreviewUrl(url);
            setResourceType(type);
            message.success('Tải lên thành công');
            onUploaded?.(url);
            onSuccess(data.url);
        } catch (err) {
            console.error(err);
            message.error(err.message || 'Lỗi upload');
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
