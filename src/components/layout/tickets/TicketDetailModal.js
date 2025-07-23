'use client';

import { Modal, Button, Tag, Descriptions } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

export default function TicketDetailModal({ open, ticket, onClose }) {
    const { t } = useTranslation();

    if (!ticket) return null;

    const handleShowQRCode = () => {
        Modal.info({
            title: t('tickets.qr_modal_title'),
            content: (
                <div className="flex flex-col items-center mt-4">
                    <QRCodeCanvas
                        value={`${ticket.LanguageCode}-${ticket.TicketId}`}
                        size={200}
                    />
                    <p className="mt-4">
                        {t('tickets.id')}: <strong>{ticket.TicketId}</strong>
                    </p>
                </div>
            ),
            okText: t('common.close'),
        });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={t('tickets.detail_modal_title')}
            footer={[
                <Button key="qr" type="primary" onClick={handleShowQRCode}>
                    {t('tickets.generate_qr')}
                </Button>,
                <Button key="close" onClick={onClose}>
                    {t('common.close')}
                </Button>,
            ]}
        >
            <Descriptions bordered column={1}>
                <Descriptions.Item label={t('tickets.id')}>
                    <Tag color="blue">{ticket.TicketId}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t('tickets.language')}>
                    <Tag color={ticket.LanguageCode === 'vi' ? 'green' : 'blue'}>
                        {ticket.LanguageCode}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t('tickets.created_at')}>
                    {new Date(ticket.CreatedAt).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}
