'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Select, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';

export default function AddArtifactLocationModal({ open, onClose, zoneId, zoneImageUrl, existingArtifactIds, onSuccess }) {
    const { t } = useTranslation();
    const [artifacts, setArtifacts] = useState([]);
    const [selectedArtifactId, setSelectedArtifactId] = useState(null);
    const [pos, setPos] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAvailableArtifacts = async () => {
        try {
            const res = await fetch('/api/artifacts');
            const data = await res.json();
            const filtered = data.filter(a => !existingArtifactIds.includes(a.ArtifactId));
            setArtifacts(filtered);
        } catch (err) {
            message.error(t('artifacts.load_error'));
        }
    };

    useEffect(() => {
        if (open) {
            fetchAvailableArtifacts();
            setSelectedArtifactId(null);
            setPos(null);
        }
    }, [open]);

    const handleMapClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        setPos({
            x: parseFloat(offsetX.toFixed(2)),
            y: parseFloat(offsetY.toFixed(2)),
        });
    };

    const handleAdd = async () => {
        if (!selectedArtifactId || !pos) {
            message.warning(t('artifacts.validation_select'));
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/artifact-locations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    artifactId: selectedArtifactId,
                    zoneId,
                    posX: pos.x,
                    posY: pos.y,
                }),
            });
            if (!res.ok) throw new Error();
            message.success(t('artifacts.add_success'));
            onSuccess?.();
            onClose();
        } catch (err) {
            message.error(t('artifacts.add_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={t('artifacts.add_location')}
            footer={[
                <Button key="cancel" onClick={onClose}>{t('common.cancel')}</Button>,
                <Button key="add" type="primary" loading={loading} onClick={handleAdd}>{t('common.add')}</Button>,
            ]}
            centered
            width={800}
        >
            <div className="mb-4">
                <Select
                    value={selectedArtifactId}
                    onChange={setSelectedArtifactId}
                    placeholder={t('artifacts.select_artifact')}
                    style={{ width: '100%' }}
                    options={artifacts.map(a => ({ label: a.Name, value: a.ArtifactId }))}
                />
            </div>

            {zoneImageUrl && (
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '56.25%',
                        backgroundImage: `url(${zoneImageUrl})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        cursor: 'crosshair',
                    }}
                    onClick={handleMapClick}
                >
                    {pos && (
                        <div
                            style={{
                                position: 'absolute',
                                top: pos.y,
                                left: pos.x,
                                width: 14,
                                height: 14,
                                backgroundColor: 'green',
                                borderRadius: '50%',
                                border: '2px solid white',
                                transform: 'translate(-50%, -50%)',
                            }}
                            title={`Toạ độ: (${pos.x}, ${pos.y})`}
                        />
                    )}
                </div>
            )}
        </Modal>
    );
}
