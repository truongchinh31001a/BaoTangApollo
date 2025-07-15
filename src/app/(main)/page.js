'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  Skeleton,
  Empty,
  DatePicker,
  Button,
} from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardHome() {
  const { t } = useTranslation();

  const [totalScans, setTotalScans] = useState(0);
  const [languageStats, setLanguageStats] = useState([]);
  const [dailyScanCounts, setDailyScanCounts] = useState([]);
  const [hourlyActivity, setHourlyActivity] = useState([]);
  const [popularArtifacts, setPopularArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [dailyRes, popularRes, langRes, hourlyRes] = await Promise.all([
          fetch('/api/analytics/scans-by-date'),
          fetch('/api/analytics/popular-artifacts'),
          fetch('/api/analytics/language-usage'),
          fetch('/api/analytics/hourly-distribution'),
        ]);

        const [daily, popular, lang, hourly] = await Promise.all([
          dailyRes.json(),
          popularRes.json(),
          langRes.json(),
          hourlyRes.json(),
        ]);

        setDailyScanCounts(daily);
        setPopularArtifacts(popular);
        setLanguageStats(lang);
        setHourlyActivity(hourly);
        setTotalScans(daily.reduce((sum, item) => sum + item.count, 0));
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(popularArtifacts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t('dashboard.popular_artifacts'));
    XLSX.writeFile(wb, 'artifacts.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [[t('dashboard.artifact_name'), t('dashboard.scan_count')]],
      body: popularArtifacts.map((item) => [item.name, item.scanCount]),
    });
    doc.save('artifacts.pdf');
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        {t('dashboard.title')}
      </Title>

      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <RangePicker
            format="YYYY-MM-DD"
            onChange={(dates) => setDateRange(dates)}
          />
        </Col>
        <Col>
          <Row gutter={8}>
            <Col>
              <Button onClick={exportToExcel}>{t('dashboard.export_excel')}</Button>
            </Col>
            <Col>
              <Button onClick={exportToPDF}>{t('dashboard.export_pdf')}</Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card variant="borderless">
            <Statistic title={t('dashboard.total_scans')} value={totalScans} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title={t('dashboard.language_distribution')} variant="borderless">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={languageStats}
                  dataKey="count"
                  nameKey="language"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {languageStats.map((entry, index) => (
                    <Cell
                      key={`lang-${entry.language}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={t('dashboard.hourly_activity')} variant="borderless">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyActivity}>
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title={t('dashboard.daily_activity')} variant="borderless">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyScanCounts}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={t('dashboard.popular_artifacts')} variant="borderless">
            {popularArtifacts.length === 0 ? (
              <Empty description={t('dashboard.no_artifacts')} />
            ) : (
              <Row gutter={[16, 16]}>
                {popularArtifacts.map((artifact, index) => (
                  <Col
                    key={artifact.artifactId || `artifact-${index}`}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={artifact.name}
                          src={artifact.imageUrl}
                          style={{ objectFit: 'cover', height: 160 }}
                        />
                      }
                    >
                      <Card.Meta
                        title={artifact.name}
                        description={`${t('dashboard.scan_count')}: ${artifact.scanCount}`}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}