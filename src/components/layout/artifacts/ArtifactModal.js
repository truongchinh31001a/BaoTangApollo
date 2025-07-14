'use client';

import React, { useState, useEffect } from 'react';
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
import { AudioOutlined, VideoCameraOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';

export default function ArtifactModal({
  open,
  onClose,
  detailVI,
  detailEN,
  loading,
  onRefresh,
}) {
  const [activeTab, setActiveTab] = useState('vi');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const artifactId = detailVI?.ArtifactId || detailEN?.ArtifactId;

  // Khi bấm sửa → nạp dữ liệu từ tab hiện tại
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
          // Bạn có thể thêm AudioUrl và VideoUrl ở đây nếu form có field tương ứng
        }),
      });

      if (!res.ok) throw new Error('Lỗi khi cập nhật');
      message.success('Cập nhật thành công');
      setIsEditing(false);
      onClose();
      onRefresh?.();
    } catch (err) {
      message.error('Cập nhật thất bại');
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xóa hiện vật này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const res = await fetch(`/api/artifacts/${artifactId}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (!res.ok) throw new Error('Xóa thất bại');
          message.success('Đã xóa hiện vật');
          onClose();
          onRefresh?.();
        } catch (err) {
          message.error('Lỗi khi xóa hiện vật');
        }
      },
    });
  };

  const renderTabContent = (detail) => {
    if (isEditing) {
      return (
        <Form layout="vertical">
          <Form.Item label="Tên">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Mô tả">
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
        <p><strong>Tên:</strong> {detail.Name}</p>
        <p><strong>Mô tả:</strong> {detail.Description}</p>
        {detail.VideoUrl && detail.VideoUrl.trim() !== '' && (
          <video src={detail.VideoUrl} controls className="w-full mt-3" />
        )}

        {detail.AudioUrl && detail.AudioUrl.trim() !== '' && (
          <audio src={detail.AudioUrl} controls className="w-full mt-3" />
        )}

      </>
    ) : (
      <p>Không có dữ liệu</p>
    );
  };

  const items = [
    { key: 'vi', label: 'Tiếng Việt', children: renderTabContent(detailVI) },
    { key: 'en', label: 'English', children: renderTabContent(detailEN) },
  ];

  return (
    <Modal
      title="Chi tiết hiện vật"
      open={open}
      onCancel={() => {
        setIsEditing(false);
        onClose();
      }}
      footer={
        <Space>
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)}>Hủy</Button>
              <Button
                type="primary"
                loading={submitting}
                onClick={handleSave}
              >
                Lưu
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleEdit}>Sửa</Button>
              <Button danger onClick={handleDelete}>Xóa</Button>
            </>
          )}
          <Button onClick={onClose}>Đóng</Button>
        </Space>
      }
      width={700}
    >
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <Tabs
          items={items}
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setIsEditing(false); // chuyển tab là tắt edit
          }}
        />
      )}
    </Modal>
  );
}
