import React, { useState } from 'react';
import { Menu, Dropdown, Input } from 'antd';
import { useHistory } from 'react-router-dom';

const { Search } = Input;

const SearchDropdown = () => {
  const [searchValue, setSearchValue] = useState('');
  const history = useHistory();

  const menuItems = [
    { key: 'Dashboard', label: 'Dashboard', route: '/dashboard' },
    { key: 'Patients Manager', label: 'Patients Manager', route: '/usertable' },
    { key: 'Patients Form', label: 'Patients Form', route: '/userForm' },
    { key: 'Patients Bill', label: 'New Bill', route: '/billingForm' },
    { key: 'Bill Manager', label: 'Bill Manager', route: '/billManager' },
    { key: 'Doctors Schedule', label: 'Doctors Schedule', route: '/doctorsSchedule' },
    { key: 'Appointment', label: 'Appointment', route: '/appointment' }
  ];

  const filteredItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleMenuClick = (route) => {
    history.push(route);
  };

  const menu = (
    <Menu>
      {filteredItems.map(item => (
        <Menu.Item key={item.key} onClick={() => handleMenuClick(item.route)}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Search
        placeholder="Search"
        style={{ width: 200 }}
        allowClear
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </Dropdown>
  );
};

export default SearchDropdown;
