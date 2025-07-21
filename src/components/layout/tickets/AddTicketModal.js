'use client';

import { Modal, Button, Radio, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AddTicketModal({ open, onClose, onAdd }) {
    const { t } = useTranslation();
    const [language, setLanguage] = useState('vi');
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        setLoading(true);
        try {
            const newTicket = {
                TicketId: Math.random().toString(36).substr(2, 8).toUpperCase(),
                LanguageCode: language,
                CreatedAt: new Date().toISOString(),
            };
            message.success(t('tickets.add_success'));
            onAdd(newTicket);
            onClose();
        } catch (err) {
            message.error(t('tickets.add_error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={t('tickets.add_modal_title')}
            okText={t('tickets.add')}
            okButtonProps={{ loading }}
            onOk={handleAdd}
        >
            <Radio.Group
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <Radio value="vi">{t('tickets.lang_vi')}</Radio>
                <Radio value="en">{t('tickets.lang_en')}</Radio>
            </Radio.Group>
        </Modal>
    );
}
