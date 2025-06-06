import React, { useState } from 'react';
import { Card, Row, Col, Empty, Breadcrumb, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const sampleLeads = [
  {
    id: 1,
    fullName: 'John Doe',
    mobile: '9876543210',
    dob: '1990-01-01',
    amount: 500000,
    tenure: 24,
    purpose: 'Business Expansion',
    businessRegistered: 'Yes',
    monthlySales: 120000,
    status: 'In Progress',
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    mobile: '9123456789',
    dob: '1985-05-12',
    amount: 750000,
    tenure: 36,
    purpose: 'Working Capital',
    businessRegistered: 'No',
    monthlySales: 90000,
    status: 'Sanctioned',
  },
  {
    id: 3,
    fullName: 'Mike Johnson',
    mobile: '9988776655',
    dob: '1992-09-20',
    amount: 300000,
    tenure: 12,
    purpose: 'Equipment Purchase',
    businessRegistered: 'Yes',
    monthlySales: 50000,
    status: 'Rejected',
  },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'inprogress', label: 'In Progress' },
  { key: 'sanctioned', label: 'Sanctioned' },
  { key: 'disbursed', label: 'Disbursed' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'archived', label: 'Archived' },
];

function Leads({ leads }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();
  // Use sampleLeads for demo; in real use, merge with leads prop
  const displayLeads = sampleLeads;

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return '#2db7f5';
      case 'Sanctioned': return '#87d068';
      case 'Rejected': return '#f50';
      default: return '#108ee9';
    }
  };

  return (
    <div style={{ background: '#f5f6fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#003ca6', padding: '32px 0 24px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Breadcrumb style={{ color: '#fff', marginBottom: 8 }}>
            <Breadcrumb.Item style={{ color: '#fff' }}>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item style={{ color: '#fff' }}>Application-Listing</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ color: '#fff', fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Application</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  background: activeFilter === f.key ? '#19b5fe' : 'transparent',
                  color: activeFilter === f.key ? '#fff' : '#19b5fe',
                  border: '2px solid #19b5fe',
                  borderRadius: 20,
                  padding: '6px 24px',
                  fontWeight: 500,
                  fontSize: 16,
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Cards */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px' }}>
        <Row gutter={[24, 24]}>
          {displayLeads.map((lead) => (
            <Col xs={24} sm={12} md={8} key={lead.id}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderTop: `5px solid ${getStatusColor(lead.status)}`,
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#333' }}>{lead.fullName}</h3>
                    <span style={{
                      backgroundColor: getStatusColor(lead.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}>{lead.status}</span>
                  </div>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div style={{ color: '#666' }}>Mobile</div>
                      <div style={{ fontWeight: 500, color: '#333' }}>{lead.mobile}</div>
                    </Col>
                    <Col span={12}>
                      <div style={{ color: '#666' }}>Date of Birth</div>
                      <div style={{ fontWeight: 500, color: '#333' }}>{lead.dob}</div>
                    </Col>
                    <Col span={12}>
                      <div style={{ color: '#666' }}>Amount</div>
                      <div style={{ fontWeight: 500, color: '#333' }}>₹ {lead.amount.toLocaleString()}</div>
                    </Col>
                    <Col span={12}>
                      <div style={{ color: '#666' }}>Tenure</div>
                      <div style={{ fontWeight: 500, color: '#333' }}>{lead.tenure} Months</div>
                    </Col>
                    <Col span={24}>
                      <div style={{ color: '#666' }}>Purpose</div>
                      <div style={{ fontWeight: 500, color: '#333' }}>{lead.purpose}</div>
                    </Col>
                    <Col span={12}>
                      <div style={{ color: '#666' }}>Business Registered</div>
                      <div style={{ fontWeight: 500, color: '#333' }}>{lead.businessRegistered}</div>
                    </Col>
                    <Col span={12}>
                      <div style={{ color: '#666' }}>Monthly Sales</div>
                      <div style={{ fontWeight: 500, color: '#333' }}>₹ {lead.monthlySales.toLocaleString()}</div>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 24, textAlign: 'right' }}>
                    <Button type="primary" onClick={() => navigate(`/dashboard/application/${lead.id}`, { state: { lead } })}>
                      Update
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        {displayLeads.length === 0 && <Empty description="No leads found. Add a new lead to get started." style={{ margin: '40px 0' }} />}
      </div>
    </div>
  );
}

export default Leads; 