'use client';

import React, { useEffect, useState } from 'react';
import { Table, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import '@ant-design/v5-patch-for-react-19';

export default function ArtifactLocationsPage() {
    const { t } = useTranslation();

    const [locations, setLocations] = useState([]);

    const fetchData = async () => {
        try {
            const [locationRes, artifactRes] = await Promise.all([
                fetch('/api/artifact-locations'),
                fetch('/api/artifacts?lang=vi'),
            ]);
            const locationData = await locationRes.json();
            const artifactData = await artifactRes.json();

            // Gộp dữ liệu theo ArtifactId
            const merged = locationData.map((loc) => {
                const artifact = artifactData.find((a) => a.ArtifactId === loc.ArtifactId);
                return {
                    ...loc,
                    Name: artifact?.Name || 'Unknown',
                    ImageUrl: artifact?.ImageUrl || '',
                };
            });

            setLocations(merged);
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            title: t('artifact.image') || 'Ảnh',
            dataIndex: 'ImageUrl',
            key: 'image',
            align: 'center',
            render: (url) => (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            overflow: 'hidden',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f5f5f5',
                        }}
                    >
                        <img
                            src={url}
                            alt="artifact"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                </div>
            ),
        },
        {
            title: t('artifact.zone') || 'Khu vực',
            dataIndex: 'ZoneName',
            key: 'zone',
            align: 'center',
        },
        {
            title: 'PosX',
            dataIndex: 'PosX',
            key: 'posX',
            align: 'center',
        },
        {
            title: 'PosY',
            dataIndex: 'PosY',
            key: 'posY',
            align: 'center',
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{t('artifact.location_title') || 'Danh sách vị trí hiện vật'}</h1>

            <Table
                bordered
                dataSource={locations}
                columns={columns}
                rowKey={(record) => `${record.ArtifactId}-${record.ZoneId}`}
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
}
