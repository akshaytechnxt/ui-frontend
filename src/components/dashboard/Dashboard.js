import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Leads from './Leads';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Button, Row, Col } from 'antd';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Option } = Select;

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads, setLeads] = useState([]);

  const [stats] = useState({
    inProgress: 45,
    sanctioned: 28,
    disbursed: 32,
    rejected: 15,
  });

  const [queryStats] = useState({
    pending: 12,
    resolved: 28,
    urgent: 5,
    total: 40,
  });

  const [approvalStats] = useState({
    pending: 8,
    approved: 15,
    rejected: 3,
    total: 26,
  });

  const [dailyEvents] = useState([
    {
      id: 1,
      title: 'Team Meeting',
      time: '10:00 AM',
      type: 'meeting',
      attendees: ['John', 'Sarah', 'Mike'],
    },
    {
      id: 2,
      title: 'Client Call - ABC Corp',
      time: '11:30 AM',
      type: 'call',
      attendees: ['John', 'Client'],
    },
    {
      id: 3,
      title: 'Document Review',
      time: '2:00 PM',
      type: 'task',
      attendees: ['John'],
    },
    {
      id: 4,
      title: 'Project Deadline',
      time: '4:00 PM',
      type: 'deadline',
      attendees: ['Team'],
    },
  ]);

  // Sample performance data for the last 6 months
  const performanceData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Leads Generated',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Leads Converted',
        data: [28, 48, 40, 19, 86, 27],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Lead Performance Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'call':
        return 'bg-green-100 text-green-800';
      case 'task':
        return 'bg-purple-100 text-purple-800';
      case 'deadline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = (values) => {
    setLeads(prev => [
      ...prev,
      { ...values, id: Date.now(), dob: values.dob.format('YYYY-MM-DD') }
    ]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* In Progress Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        {/* Sanctioned Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sanctioned</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.sanctioned}</p>
            </div>
          </div>
        </div>

        {/* Disbursed Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disbursed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.disbursed}</p>
            </div>
          </div>
        </div>

        {/* Rejected Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Graph */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="h-96">
            <Line data={performanceData} options={chartOptions} />
          </div>
        </div>

        {/* Daily Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Events</h2>
          <div className="space-y-4">
            {dailyEvents.map((event) => (
              <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.time}</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Attendees: {event.attendees.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Queries and Approvals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Queries Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Queries Overview</h3>
            <span className="text-sm text-gray-500">Total: {queryStats.total}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{queryStats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{queryStats.resolved}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{queryStats.urgent}</div>
              <div className="text-sm text-gray-600">Urgent</div>
            </div>
          </div>
        </div>

        {/* Approvals Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Approvals Overview</h3>
            <span className="text-sm text-gray-500">Total: {approvalStats.total}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{approvalStats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{approvalStats.approved}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{approvalStats.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate</h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-blue-600">68%</div>
            <div className="text-sm text-gray-600">
              <span className="text-green-600">↑ 12%</span> from last month
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Processing Time</h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-blue-600">4.2 days</div>
            <div className="text-sm text-gray-600">
              <span className="text-green-600">↓ 0.8 days</span> from last month
            </div>
          </div>
        </div>
      </div>

      <Leads leads={leads} />

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      <Modal
        title={<span style={{ fontWeight: 600, fontSize: 20 }}>Start New Application</span>}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); }}
        footer={null}
        width={850}
        centered
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ amount: 0, monthlySales: 0 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="fullName"
                label="Applicant Full Name"
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input placeholder="Enter Full Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="mobile"
                label="Applicant Mobile Number"
                rules={[{ required: true, message: 'Please enter mobile number' }, { pattern: /^\d{10}$/, message: 'Enter a valid 10-digit number' }]}
              >
                <Input placeholder="Enter Mobile Number" maxLength={10} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select date of birth' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" placeholder="DD-MM-YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="amount"
                label="Loan Amount Required"
                rules={[{ required: true, message: 'Please enter loan amount' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => `₹ ${value}`}
                  parser={value => value.replace(/₹\s?|(,*)/g, '')}
                  placeholder="₹ 0"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="tenure"
                label="Tenure of Loan"
                rules={[{ required: true, message: 'Please select tenure' }]}
              >
                <Select placeholder="Select Tenure of Loan">
                  <Option value="12">12 Months</Option>
                  <Option value="24">24 Months</Option>
                  <Option value="36">36 Months</Option>
                  <Option value="48">48 Months</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="purpose"
                label="Purpose Of Loan"
                rules={[{ required: true, message: 'Please select purpose' }]}
              >
                <Select placeholder="Select Purpose of Loan">
                  <Option value="Business Expansion">Business Expansion</Option>
                  <Option value="Working Capital">Working Capital</Option>
                  <Option value="Equipment Purchase">Equipment Purchase</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="businessRegistered"
                label="Is your Business Registered?"
                rules={[{ required: true, message: 'Please select' }]}
              >
                <Select placeholder="Select Business Registered">
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="monthlySales"
                label="Monthly Sales"
                rules={[{ required: true, message: 'Please enter monthly sales' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => `₹ ${value}`}
                  parser={value => value.replace(/₹\s?|(,*)/g, '')}
                  placeholder="₹ 0"
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button onClick={() => { setIsModalOpen(false); }}>Cancel</Button>
            <Button type="primary" htmlType="submit">Check Eligibility</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default Dashboard; 