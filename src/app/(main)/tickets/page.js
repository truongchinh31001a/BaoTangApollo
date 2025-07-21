'use client';

import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Space,
    Modal,
    message,
    Tag,
} from 'antd';
import {
    FolderViewOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import AddTicketModal from '@/components/layout/tickets/AddTicketModal';
import TicketDetailModal from '@/components/layout/tickets/TicketDetailModal';

export default function TicketPage() {
    const { t } = useTranslation();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tickets');
            const data = await res.json();
            setTickets(data);
        } catch (err) {
            message.error(t('tickets.fetch_error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const openDetailModal = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const closeDetailModal = () => {
        setSelectedTicket(null);
        setIsModalOpen(false);
    };

    const handleAddTicket = (newTicket) => {
        setTickets((prev) => [newTicket, ...prev]);
    };

    const columns = [
        {
            title: t('tickets.index'),
            key: 'index',
            render: (_, __, index) => index + 1,
            align: 'center',
            width: 70,
        },
        {
            title: t('tickets.id'),
            dataIndex: 'TicketId',
            key: 'TicketId',
            align: 'center',
            render: (id) => <span className="text-sm">{id}</span>,
        },
        {
            title: t('tickets.language'),
            dataIndex: 'LanguageCode',
            key: 'LanguageCode',
            align: 'center',
            render: (lang) => (
                <Tag color={lang === 'vi' ? 'green' : 'blue'}>{lang}</Tag>
            ),
        },
        {
            title: t('tickets.created_at'),
            dataIndex: 'CreatedAt',
            key: 'CreatedAt',
            align: 'center',
            render: (date) =>
                new Date(date).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
        },
        {
            title: t('tickets.action'),
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<FolderViewOutlined />}
                        onClick={() => openDetailModal(record)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold mb-4">
                    {t('tickets.title')}
                </h1>
                <div className="space-x-2">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        {t('tickets.add_new')}
                    </Button>
                </div>
            </div>

            <Table
                dataSource={tickets}
                columns={columns}
                rowKey="TicketId"
                loading={loading}
                bordered
                pagination={{ pageSize: 5 }}
            />

            <TicketDetailModal
                open={isModalOpen}
                ticket={selectedTicket}
                onClose={closeDetailModal}
            />

            <AddTicketModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddTicket}
            />
        </div>
    );
}
