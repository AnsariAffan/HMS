import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Popconfirm,
  DatePicker,
  Typography,
  InputNumber,
  Select,
  Flex,
  Spin,
  Tag,
  Dropdown,
  Menu,
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, EllipsisOutlined } from '@ant-design/icons';
import moment from 'moment';
import Link from 'antd/es/typography/Link';
import { useDispatch, useSelector } from "react-redux";
import { getAllPateints } from "../api/api";
import * as XLSX from "xlsx";
import "./Usertable.css";

const { Title } = Typography;
const { Option } = Select;

const Usertable = () => {
  const dispatch = useDispatch();
  const { isLoading, allPateint, message } = useSelector((state) => state.products);

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(getAllPateints());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(allPateint?.data)) {
      const filteredData = allPateint.data.filter((patient) =>
        Object.values(patient).some(
          (value) =>
            value &&
            typeof value === "string" &&
            value.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredData(filteredData);
    }
  }, [allPateint, searchText]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Patient ID",
      dataIndex: "_id",
      key: "patientId",
      render: (text, record) => (
        <Link href={`patient/${record._id}`}>{`${record._id}`}</Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "FIRST_NAME",
      key: "FIRST_NAME",
      filters: [...new Set(allPateint?.data?.map(patient => patient.FIRST_NAME))].map(name => ({ text: name, value: name })),
      onFilter: (value, record) => record.FIRST_NAME === value,
    },
    {
      title: "Phone Number",
      dataIndex: "Contact_Number",
      key: "Contact_Number",
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
      ],
      onFilter: (value, record) => record.Gender === value,
    },
    {
      title: "Age",
      dataIndex: "Age",
      key: "Age",
    },
    {
      title: "Material Status",
      dataIndex: "Matertal_Status",
      key: "Matertal_Status",
      filters: [
        { text: "Single", value: "single" },
        { text: "Married", value: "married" },
      ],
      onFilter: (value, record) => record.Matertal_Status === value,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      defaultSortOrder: 'descend',
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Patients");
    XLSX.writeFile(wb, "patients.xlsx");
  };

  return (
    <div className="patient-table" style={{ width: "100%", paddingInline: "15px" }}>
      <Title level={3}>Patient Manager</Title>
      <Space style={{ marginBottom: 16 }}>
        <Link href="/UserForm">
          <Button style={{ marginBottom: 8, width: "max-content", height: "40px" }} type="primary">
            Add a Patient
          </Button>
        </Link>
        <DatePicker style={{ marginBottom: 8, width: "max-content", height: "40px" }} defaultValue={moment()} format="YYYY-MM-DD" />
        <Input.Search
          placeholder="Master Filter"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 8, width: "max-content", height: "40px" }}
          allowClear
          className="master-search"
        />
      </Space>
      <Title level={4}>All Patient ({filteredData.length})</Title>
      <div style={{ position: "relative" }}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Spin size="large" />
          </div>
        )}
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="print" onClick={handlePrint}>
                Print
              </Menu.Item>
              <Menu.Item key="export" onClick={handleExportToExcel}>
                Export to Excel
              </Menu.Item>
            </Menu>
          }
          placement="bottomLeft"
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()} style={{ cursor: "pointer" }}>
            <Space>
              Export Report <EllipsisOutlined />
            </Space>
          </a>
        </Dropdown>
        <Table
          loading={isLoading}
          style={{ width: "100%", opacity: isLoading ? 0.5 : 1 }}
          columns={columns}
          dataSource={filteredData?.map((patient) => ({
            ...patient,
            key: patient._id,
          }))}
          rowClassName={(record, index) => 
            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
        />
      </div>
    </div>
  );
};

export default Usertable;
