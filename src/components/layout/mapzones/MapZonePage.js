'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Tag, Image, Tooltip, message } from 'antd';
import { FolderViewOutlined, PlusOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { useTranslation } from 'react-i18next'; // ✅ i18n
import MapZoneModal from '@/components/layout/mapzones/MapZoneModal';
import AddMapZoneModal from '@/components/layout/mapzones/AddMapZoneModal';

export default function MapZonesPage() {
    const { t } = useTranslation();

    const [mapZones, setMapZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchMapZones = async () => {
        try {
            const res = await fetch('/api/map-zones');
            const data = await res.json();
            setMapZones(data);
        } catch (err) {
            console.error('Lỗi khi load map-zones:', err);
            message.error(t('mapzones.fetch_error'));
        }
    };

    useEffect(() => {
        fetchMapZones();
    }, []);

    const openModal = (zone) => {
        setSelectedZone(zone);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedZone(null);
    };

    const columns = useMemo(() => [
        {
            title: t('mapzones.index'),
            key: 'index',
            render: (_, __, index) => index + 1,
            align: 'center',
            width: 60,
        },
        {
            title: t('mapzones.name'),
            dataIndex: 'Name',
            key: 'name',
            align: 'center',
        },
        {
            title: t('mapzones.floor'),
            dataIndex: 'Floor',
            key: 'floor',
            align: 'center',
            width: 150,
            render: (val) => <Tag color="blue">{t('mapzones.floor_prefix')} {val}</Tag>,
        },
        {
            title: t('mapzones.map_image'),
            dataIndex: 'MapImageUrl',
            key: 'mapImage',
            align: 'center',
            width: 400,
            render: (url) =>
                url ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            src={url}
                            alt="map"
                            width={80}
                            height={80}
                            style={{ objectFit: 'cover', borderRadius: 8 }}
                        />
                    </div>
                ) : (
                    <i>{t('mapzones.no_image')}</i>
                ),
        },
        {
            title: t('mapzones.action'),
            key: 'action',
            align: 'center',
            width: 120,
            ellipsis: true,
            render: (_, record) => (
                <Tooltip title={t('mapzones.view_detail')}>
                    <Button
                        icon={<FolderViewOutlined />}
                        onClick={() => openModal(record)}
                    />
                </Tooltip>
            ),
        },
    ], [t]);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold mb-4">{t('mapzones.title')}</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    {t('mapzones.add_new')}
                </Button>
            </div>

            <Table
                bordered
                dataSource={mapZones}
                columns={columns}
                rowKey="ZoneId"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 'max-content' }}
            />

            <MapZoneModal
                open={isModalOpen}
                onClose={closeModal}
                data={selectedZone}
                onRefresh={fetchMapZones}
            />

            <AddMapZoneModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchMapZones}
            />
        </div>
    );
}
