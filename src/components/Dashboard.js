

import React, { Children,  useEffect, useState } from 'react';
import { Layout, Menu, Table, Input, Button, DatePicker, Avatar, Flex } from 'antd';
import { UserOutlined, SearchOutlined, CalendarOutlined, DashboardOutlined, UsergroupAddOutlined, ScheduleOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import './Dashboard.css';
import { PieChart, Pie, LineChart, Line, Tooltip } from 'recharts';
import Link from 'antd/es/typography/Link';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPateints } from '../api/api';
const { Header, Content, Sider } = Layout;
const { Search } = Input;

const Dashboard = (      {children}) => {

  const dispatch =   useDispatch()
    const { isLoading, allPateint,message } = useSelector((state) => state.products);

    


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
        { name: 'Doctors', value: 10 },
        { name: 'Patients', value: 50 },
    ];

    const lineChartData = [
        { name: 'Monday', sessions: 5 },
        { name: 'Tuesday', sessions: 10 },
        { name: 'Wednesday', sessions: 8 },
        { name: 'Thursday', sessions: 15 },
        { name: 'Friday', sessions: 12 },
    ];


    return (
        <Layout style={{ minHeight: '100vh' }} >
         
            <Sider  collapsible >
                <div  className="profile-container" >
                    <Avatar size={64} icon={<UserOutlined />}  />
                    <p className="profile-title">Administrator</p>
                    <p className="profile-subtitle">admin@edoc.com</p>
                    <Button type="primary" className="logout-btn">Log out</Button>
                </div>
                <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" >
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        <Link href="/">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                    <Link href="/Usertable"> Patients</Link> 
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UsergroupAddOutlined />}>
                    <Link to="/Doctors">Doctors</Link>   
                    </Menu.Item>
                    <Menu.Item key="4" icon={<ScheduleOutlined />}>
                    <Link to="/Doctors Schedule"> Doctors Schedule</Link>  
                    </Menu.Item>
                    <Menu.Item key="5" icon={<AppstoreAddOutlined />}>
                    <Link to="/Appointment"> Appointment</Link>
                    </Menu.Item>
                    
                </Menu>
            </Sider>
       
          

{children}
       
        </Layout>
    );
};

export default Dashboard;

