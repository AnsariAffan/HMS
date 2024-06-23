import React, { Children, useState } from 'react';
import { Layout, Menu, Table, Input, Button, DatePicker, Avatar, Flex } from 'antd';
import { UserOutlined, SearchOutlined, CalendarOutlined, DashboardOutlined, UsergroupAddOutlined, ScheduleOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import './Dashboard.css';

import { PieChart, Pie, LineChart, Line, Tooltip, Cell } from 'recharts';

import Dashboard from './Dashboard';
const { Header, Content, Sider } = Layout;
const { Search } = Input;


const UserDashboard = () => {
    const today = new Date().toISOString().slice(0, 10);
    const [appointments, setAppointments] = useState([]);
    const [sessions, setSessions] = useState([]);
  
    // Dummy data
    const doctorCount = 10;
    const patientCount = 50;
    const newBookingCount = 5;
    const todaySessionsCount = 3;
  
    // Dummy data for charts
    const pieChartData = [
      { name: 'Doctors', value: doctorCount },
      { name: 'Patients', value: patientCount },
    ];
  
    const lineChartData = [
      { name: 'Monday', sessions: 5 },
      { name: 'Tuesday', sessions: 10 },
      { name: 'Wednesday', sessions: 8 },
      { name: 'Thursday', sessions: 15 },
      { name: 'Friday', sessions: 12 },
    ];
  
    // Light color palette for pie chart
    const COLORS = ['#8ecae6', '#ff9b73'];

  return (

    


<Layout className="site-layout">
    <Header className="site-layout-background header-fix" style={{ padding: '10px' }}>
        <div className="header-content">
            <Search  placeholder="Search Doctor name or Email" enterButton="Search" size="large" style={{ width: 500 }} />
            <div className="date-display">
                <p>Today's Date</p>
                <p>{today}</p>
            </div>
            <Button  shape="circle" icon={<CalendarOutlined />} />
        </div>
    </Header>
  <Flex>
 
<Content style={{ margin: '0' }}>
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <div className="dashboard-status">
              <Content>
              <div className="status-card" style={{ backgroundColor: '#8ecae6' }}>
                    <div className="status-number">{doctorCount}</div>
                    <div className="status-label">Doctors</div>
                </div>
                <div className="status-card" style={{ backgroundColor: 'rgb(255 173 90)' }}>
                    <div className="status-number">{patientCount}</div>
                    <div className="status-label">Patients</div>
                </div>
              </Content>
              <Content>
                <div className="status-card" style={{ backgroundColor: 'rgb(133 222 180)' }}>
                    <div className="status-number">{newBookingCount}</div>
                    <div className="status-label">Booking</div>
                </div>
                <div className="status-card"  style={{ backgroundColor: 'rgb(239 128 136)' }}>
                    <div className="status-number">{todaySessionsCount}</div>
                    <div className="status-label">Sessions</div>
                </div>
                </Content>
            </div>

            
        </div>
    </Content>
    <Content style={{ margin: '0' }}>
    <div style={{ padding: 0, background: '#fff', minHeight: 360 }}>
        {/* Existing content */}
        <div className="dashboard-charts">
            <div className="chart-item">
                <h2>Doctor vs Patient Distribution</h2>
                <PieChart width={400} height={300}>
                  <Pie dataKey="value" data={pieChartData} cx={200} cy={150} outerRadius={90} label>
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
            </div>
            <div className="chart-item">
                <h2>Weekly Session Overview</h2>
                <LineChart width={300} height={300} data={lineChartData}>
                    <Line type="monotone" dataKey="sessions" stroke="#8884d8" />
                    <Tooltip />
                </LineChart>
            </div>
        </div>
    </div>
</Content>
    </Flex>
    <div className="upcoming-section">
                <div className="upcoming-appointments">
                    <h2>Upcoming Appointments until Next Week</h2>
                    <Table dataSource={appointments} columns={[
                        { title: 'Appointment Number', dataIndex: 'appointmentNumber', key: 'appointmentNumber' },
                        { title: 'Patient Name', dataIndex: 'patientName', key: 'patientName' },
                        { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
                        { title: 'Session', dataIndex: 'session', key: 'session' }
                    ]} pagination={false} />
                    <Button type="primary" block>Show all Appointments</Button>
                </div>
                <div className="upcoming-sessions">
                    <h2>Upcoming Sessions until Next Week</h2>
                    <Table dataSource={sessions} columns={[
                        { title: 'Session Title', dataIndex: 'sessionTitle', key: 'sessionTitle' },
                        { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
                        { title: 'Scheduled Date & Time', dataIndex: 'dateTime', key: 'dateTime' }
                    ]} pagination={false} />
                    <Button type="primary" block>Show all Sessions</Button>
                </div>
            </div>
</Layout>



  )
}

export default UserDashboard
