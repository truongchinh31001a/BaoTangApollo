'use client';

import React, { useState } from 'react';
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
        <Image
          src={detail.ImageUrl}
          alt={detail.Name}
          width="100%"
          className="mb-3"
        />
        <p><strong>{t('artifacts.name')}:</strong> {detail.Name}</p>
        <p><strong>{t('artifacts.description')}:</strong> {detail.Description}</p>
        {detail.VideoUrl && detail.VideoUrl.trim() !== '' && (
          <video src={detail.VideoUrl} controls className="w-full mt-3" />
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
    { key: 'vi', label: t('artifacts.lang_vi'), children: renderTabContent(detailVI) },
    { key: 'en', label: t('artifacts.lang_en'), children: renderTabContent(detailEN) },
  ];

  return (
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
              <Button onClick={() => setIsEditing(false)}>{t('common.cancel')}</Button>
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
              <Button danger onClick={handleDelete}>{t('common.delete')}</Button>
            </>
          )}
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
  );
}
