import { Card, Col, Row } from 'antd';

export default function DashboardSection({ title, children, span = 24 }) {
  return (
    <Row gutter={[16, 16]}>
      <Col span={span}>
        <Card title={title}>
          {children}
        </Card>
      </Col>
    </Row>
  );
}
