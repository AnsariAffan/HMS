import React, { useState } from 'react';
import { Layout, Menu, Avatar, Button } from 'antd';
import { UserOutlined, DashboardOutlined, UsergroupAddOutlined, ScheduleOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { useDispatch } from 'react-redux';
import { logout } from '../api/userCredential';
import SearchDropdown from './SearchDropdown'; // Import the SearchDropdown component

const { Header, Content, Sider } = Layout;

const Dashboard = ({ children }) => {
    const [selectedTab, setSelectedTab] = useState('Dashboard');

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        console.log("logout");
    };

    const handleMenuClick = (e) => {
        setSelectedTab(e.key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible>
                <div className="profile-container">
                    <Avatar size={64} icon={<UserOutlined />} />
                    <p className="profile-title">Administrator</p>
                    <p className="profile-subtitle">admin@edoc.com</p>
                    <Button type="primary" className="logout-btn" onClick={handleLogout}>Log out</Button>
                </div>
                <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" onClick={handleMenuClick}>
                    <Menu.Item key="Dashboard" icon={<DashboardOutlined />}>
                        <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="Patients Manager" icon={<UserOutlined />}>
                        <Link to="/usertable">Patients Manager</Link>
                    </Menu.Item>
                    <Menu.Item key="Bill Manager" icon={<UsergroupAddOutlined />}>
                        <Link to="/billManager">Bill Manager</Link>
                    </Menu.Item>
                    <Menu.Item key="Doctors Schedule" icon={<ScheduleOutlined />}>
                        <Link to="/doctorsSchedule">Doctors Schedule</Link>
                    </Menu.Item>
                    <Menu.Item key="Appointment" icon={<AppstoreAddOutlined />}>
                        <Link to="/appointment">Appointment</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout style={{ marginLeft: 0 }}> {/* Adjust margin-left based on Sider width */}
                <Header style={{ background: '#fff', padding: 0, position: 'fixed', top: 0, left: 200, width: 'calc(100% - 200px)', zIndex: 1 }}>
                    <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 style={{ marginTop: 0 }}>{selectedTab}</h1>
                        <SearchDropdown />
                    </div>
                </Header>
                <Content style={{ padding: '24x', marginTop: 64, minHeight: 280, overflowY: 'auto' }}>
                    <div style={{ position: 'relative', height: '100%' }}>
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
