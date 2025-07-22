'use client';

import React, { useEffect, useState } from 'react';
import { Table, Image, Button, Tooltip, Select, message, Modal } from 'antd';
import { FolderViewOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

export default function ArtifactLocationsPage() {
    const { t } = useTranslation();
    const [locations, setLocations] = useState([]);
    const [zones, setZones] = useState([]);
    const [selectedZoneId, setSelectedZoneId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    const fetchZones = async () => {
        try {
            const res = await fetch('/api/map-zones');
            const data = await res.json();
            setZones(data);
            if (data.length > 0) setSelectedZoneId(data[0].ZoneId);
        } catch (err) {
            console.error('Lỗi khi tải zones:', err);
            message.error('Không thể tải danh sách khu vực');
        }
    };

    const fetchLocationsByZone = async (zoneId) => {
        if (!zoneId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/artifact-locations-zone/${zoneId}?lang=vi`);
            const data = await res.json();
            if (!Array.isArray(data)) {
                setLocations([]);
                message.warning('Không có hiện vật trong khu vực này');
            } else {
                setLocations(data);
            }
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu:', err);
            message.error('Không thể tải dữ liệu vị trí');
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchZones();
    }, []);

    useEffect(() => {
        if (selectedZoneId) fetchLocationsByZone(selectedZoneId);
    }, [selectedZoneId]);

    const openModal = async (artifactId) => {
        try {
            const res = await fetch(`/api/artifact-locations/${artifactId}?lang=vi`);
            const data = await res.json();
            setModalData(data);
            setModalOpen(true);
        } catch (err) {
            message.error('Không thể lấy dữ liệu chi tiết');
        }
    };

    const columns = [
        {
            title: t('artifact.index') || 'STT',
            key: 'index',
            render: (_, __, index) => index + 1,
            align: 'center',
            width: 60,
        },
        {
            title: t('artifact.name') || 'Tên hiện vật',
            dataIndex: 'Name',
            key: 'name',
            align: 'center',
        },
        {
            title: t('artifact.image') || 'Ảnh hiện vật',
            dataIndex: 'ImageUrl',
            key: 'artifactImage',
            align: 'center',
            render: (url) => (
                <Image src={url} alt="artifact" width={80} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} placeholder />
            ),
        },
        {
            title: t('artifact.zoneImage') || 'Bản đồ khu vực',
            dataIndex: 'ZoneImageUrl',
            key: 'zoneImage',
            align: 'center',
            render: (url) => (
                <Image src={url} alt="zone" width={100} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} placeholder />
            ),
        },
        {
            title: t('common.actions') || 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center',
            ellipsis: true,
            render: (_, record) => (
                <Tooltip title={t('artifacts.view') || 'Xem chi tiết'}>
                    <Button icon={<FolderViewOutlined />} onClick={() => openModal(record.ArtifactId)} />
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    {t('artifact.location_title') || 'Danh sách vị trí hiện vật'}
                </h1>

                <Select
                    value={selectedZoneId}
                    onChange={(value) => setSelectedZoneId(value)}
                    style={{ width: 200 }}
                    placeholder="Chọn khu vực"
                    options={zones.map((z) => ({ label: z.Name, value: z.ZoneId }))}
                />
            </div>

            <Table
                bordered
                loading={loading}
                dataSource={Array.isArray(locations) ? locations : []}
                columns={columns}
                rowKey={(record) => `${record.ArtifactId}-${record.ZoneName}`}
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: t('artifact.no_data') || 'Không có hiện vật trong khu vực này' }}
            />

            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                title={modalData?.ArtifactName || 'Vị trí hiện vật'}
                footer={null}
                centered
                width={800}
            >
                {modalData?.MapImageUrl && (
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '56.25%',
                            backgroundImage: `url(${modalData.MapImageUrl})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: modalData.PosY,
                                left: modalData.PosX,
                                width: 14,
                                height: 14,
                                backgroundColor: 'red',
                                borderRadius: '50%',
                                border: '2px solid white',
                                transform: 'translate(-50%, -50%)',
                            }}
                            title={`Toạ độ: (${modalData.PosX}, ${modalData.PosY})`}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
}