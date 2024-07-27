import React, { useEffect, useRef, useState } from "react";
import { Layout, Menu, Tabs, Avatar, Button } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  UsergroupAddOutlined,
  ScheduleOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../clientTwo/HMS/src/api/userCredential";
import { getAllPateints } from "../../../clientTwo/HMS/src/api/api";
import "./Dashboard.css";
import UserDashboard from "../../../clientTwo/HMS/src/components/UserDashboard";
import Usertable from "../../../clientTwo/HMS/src/components/Usertable";
import BillManager from "../../../clientTwo/HMS/src/components/BillManager";
import Patient from "../../../clientTwo/HMS/src/components/Pateint";

const { Header, Content, Sider } = Layout;

const defaultPanes = [
  {
    label: "Dashboard",
    children: <UserDashboard />,
    key: "1",
  },
];

const Menutabs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState(defaultPanes);
  const newTabIndex = useRef(0);
  const [refreshUserTable, setRefreshUserTable] = useState(false);

  const onChange = (key) => {
    setActiveKey(key);
    console.log(key);
  };

  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      setActiveKey(key);
    }
    setItems(newPanes);
  };

  const onEdit = (targetKey, action) => {
    if (action === "remove") {
      remove(targetKey);
    }
  };

  const handleMenuClick = (e) => {
    const key = e.key;
    if (items.find((pane) => pane.key === key)) {
      setActiveKey(key);
    } else {
      let newPane;
      switch (key) {
        case "1":
          newPane = {
            label: "Dashboard",
            children: <UserDashboard activeKey={key} />,
            key,
          };
          break;
        case "2":
          newPane = {
            label: "Patients",
            children: <Usertable activeKey={key} refresh={refreshUserTable} />,
            key,
          };
          break;
        case "3":
          newPane = {
            label: "Bill Manager",
            children: <BillManager activeKey={key} />,
            key,
          };
          break;
        case "4":
          newPane = {
            label: "PatientForm",
            children: <Patient activeKey={key} />,
            key,
          };
          break;
        case "5":
          newPane = {
            label: "Appointment",
            children: <div>Appointment Content</div>,
            key,
          };
          break;
        default:
          break;
      }
      setItems([...items, newPane]);
      setActiveKey(key);
    }
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
    console.log("logout");
  };

  useEffect(() => {
    dispatch(getAllPateints());
  }, [dispatch]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="profile-container">
          <Avatar size={64} icon={<UserOutlined />} />
          <p className="profile-title">Administrator</p>
          <p className="profile-subtitle">admin@edoc.com</p>
          <Button type="primary" className="logout-btn" onClick={handleLogout}>
            Log out
          </Button>
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          onClick={handleMenuClick}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/patients">Patients</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UsergroupAddOutlined />}>
            <Link to="/billManager">Bill Manager</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<ScheduleOutlined />}>
            <Link to="/patientForm">PatientForm</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<AppstoreAddOutlined />}>
            <Link to="/appointment">Appointment</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          <Tabs
            hideAdd
            onChange={onChange}
            activeKey={activeKey}
            type="editable-card"
            onEdit={onEdit}
            items={items}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Menutabs;
