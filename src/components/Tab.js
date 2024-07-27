import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';

const Tab = ({ to, label }) => {
    const location = useLocation();

    return (
        <Menu.Item 
            key={to}
            style={{
                fontWeight: location.pathname === to ? 'bold' : 'normal'
            }}
        >
            <Link to={to}>
                {label}
            </Link>
        </Menu.Item>
    );
};

export default Tab;
