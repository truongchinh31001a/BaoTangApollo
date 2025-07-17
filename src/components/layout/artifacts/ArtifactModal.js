'use client';

import React, { useState, useRef } from 'react';
import {
  Modal,
  Image,
  Tabs,
  Button,
  Space,
  message,
  Form,
  Input,
} from 'antd';
import { useTranslation } from 'react-i18next';
import '@ant-design/v5-patch-for-react-19';
import { QRCodeCanvas } from 'qrcode.react';

export default function ArtifactModal({
  open,
  onClose,
  detailVI,
  detailEN,
  loading,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('vi');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const qrRef = useRef(null);
  const artifactId = detailVI?.ArtifactId || detailEN?.ArtifactId;

  const handleEdit = () => {
    const detail = activeTab === 'vi' ? detailVI : detailEN;
    setEditName(detail?.Name || '');
    setEditDescription(detail?.Description || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/artifacts/${artifactId}?lang=${activeTab}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: editName,
          Description: editDescription,
        }),
      });

      if (!res.ok) throw new Error(t('artifacts.update_error'));
      message.success(t('artifacts.update_success'));
      setIsEditing(false);
      onClose();
      onRefresh?.();
    } catch (err) {
      message.error(t('artifacts.update_error'));
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: t('artifacts.confirm_delete_title'),
      okText: t('common.delete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          const res = await fetch(`/api/artifacts/${artifactId}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (!res.ok) throw new Error();
          message.success(t('artifacts.delete_success'));
          onClose();
          onRefresh?.();
        } catch (err) {
          message.error(t('artifacts.delete_error'));
        }
      },
    });
  };

  const renderTabContent = (detail) => {
    if (isEditing) {
      return (
        <Form layout="vertical">
          <Form.Item label={t('artifacts.name')}>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label={t('artifacts.description')}>
            <Input.TextArea
              rows={4}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </Form.Item>
        </Form>
      );
    }

    return detail ? (
      <>
        {detail.ImageUrl && (
          <div className="mb-3 w-full" style={{ maxHeight: 300, overflow: 'hidden' }}>
            <Image
              src={detail.ImageUrl}
              alt={detail.Name}
              width="100%"
              style={{ objectFit: 'contain', maxHeight: 300 }}
            />
          </div>
        )}

        <p><strong>{t('artifacts.name')}:</strong> {detail.Name}</p>
        <p><strong>{t('artifacts.description')}:</strong> {detail.Description}</p>

        {detail.VideoUrl && detail.VideoUrl.trim() !== '' && (
          <video
            src={detail.VideoUrl}
            controls
            className="w-full mt-3"
            style={{ maxHeight: 300, objectFit: 'contain' }}
          />
        )}

        {detail.AudioUrl && detail.AudioUrl.trim() !== '' && (
          <audio src={detail.AudioUrl} controls className="w-full mt-3" />
        )}
      </>
    ) : (
      <p>{t('artifacts.no_data')}</p>
    );
  };

  const items = [
    {
      key: 'vi',
      label: t('artifacts.lang_vi'),
      children: renderTabContent(detailVI),
    },
    {
      key: 'en',
      label: t('artifacts.lang_en'),
      children: renderTabContent(detailEN),
    },
  ];

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `artifact-${artifactId}.png`;
      link.click();
    } else {
      message.error('Không tìm thấy mã QR để tải.');
    }
  };

  return (
    <>
      <Modal
        title={t('artifacts.detail_title')}
        open={open}
        onCancel={() => {
          setIsEditing(false);
          onClose();
        }}
        footer={
          <Space>
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)}>
                  {t('common.cancel')}
                </Button>
                <Button
                  type="primary"
                  loading={submitting}
                  onClick={handleSave}
                >
                  {t('common.save')}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleEdit}>{t('common.edit')}</Button>
                <Button danger onClick={handleDelete}>
                  {t('common.delete')}
                </Button>
              </>
            )}
            <Button onClick={() => setShowQR(true)}>Mã QR</Button>
            <Button onClick={onClose}>{t('common.close')}</Button>
          </Space>
        }
        width={700}
      >
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <Tabs
            items={items}
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              setIsEditing(false);
            }}
          />
        )}
      </Modal>

      <Modal
        open={showQR}
        title="Mã QR ArtifactId"
        onCancel={() => setShowQR(false)}
        footer={
          <Space>
            <Button onClick={downloadQRCode} type="primary">
              Tải mã QR
            </Button>
            <Button onClick={() => setShowQR(false)}>Đóng</Button>
          </Space>
        }
      >
        <div
          ref={qrRef}
          className="flex flex-col items-center space-y-4 text-center"
        >
          <QRCodeCanvas value={artifactId} size={200} />
        </div>
      </Modal>
    </>
  );
}
