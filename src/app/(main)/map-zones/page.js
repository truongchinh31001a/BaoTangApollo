'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Image, message } from 'antd';
import { FolderViewOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import MapZoneModal from '@/components/layout/mapzones/MapZoneModal';

export default function MapZonesPage() {
    const [mapZones, setMapZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchMapZones = async () => {
        try {
            const res = await fetch('/api/map-zones');
            const data = await res.json();
            setMapZones(data);
        } catch (err) {
            console.error('Lỗi khi load map-zones:', err);
            message.error('Không thể tải danh sách khu vực');
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

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => index + 1,
            align: 'center',
            width: 70,
        },
        {
            title: 'Tên khu',
            dataIndex: 'Name',
            key: 'name',
            align: 'center',
        },
        {
            title: 'Tầng',
            dataIndex: 'Floor',
            key: 'floor',
            align: 'center',
            render: (val) => <Tag color="blue">Tầng {val}</Tag>,
        },
        {
            title: 'Ảnh bản đồ',
            dataIndex: 'MapImageUrl',
            key: 'mapImage',
            align: 'center',
            render: (url) =>
                url ? (
                    <Image
                        src={url}
                        alt="map"
                        width={80}
                        height={80}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                ) : (
                    <i>Không có</i>
                ),
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Button
                    icon={<FolderViewOutlined />}
                    onClick={() => openModal(record)}
                />
            ),
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Danh sách Map Zones</h1>
            <Table
                dataSource={mapZones}
                columns={columns}
                rowKey="ZoneId"
                pagination={{ pageSize: 5 }}
            />

            <MapZoneModal
                open={isModalOpen}
                onClose={closeModal}
                data={selectedZone}
                onRefresh={fetchMapZones}
            />
        </div>
    );
}
