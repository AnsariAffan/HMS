




import { useEffect, useState } from 'react';
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
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import Link from 'antd/es/typography/Link';
import {
  Dropdown,

  Menu,

  Spin,

  Tag,

} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllPateints } from "../api/api";

import { UserAddOutlined, DownOutlined, EllipsisOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";





const { Title } = Typography;
const { Option } = Select;


const data = [
  {
    key: '1',
    sessionTitle: 'Test Session',
    doctor: 'Test Doctor',
    scheduledDate: moment('2050-01-01 18:00', 'YYYY-MM-DD HH:mm'),
    maxNum: 50,
  },
];

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const [value, setValue] = useState(children);
  const [editingValue, setEditingValue] = useState('');

  const handleChange = (e) => {
    setEditingValue(e.target.value);
  };

  const toggleEdit = () => {
    setEditingValue(value); // Reset editing value to current value
  };

  const save = async () => {
    try {
      const newValue = editingValue.trim() || value;
      if (newValue !== value) {
        record[dataIndex] = newValue;
        // Handle save logic (e.g., API call or local storage update)
      }
      toggleEdit();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  let inputNode = <Input value={editingValue} onChange={handleChange} />;
  if (inputType === 'number') {
    inputNode = <InputNumber value={editingValue} onChange={handleChange} />;
  }
  // const { isLoading, allPateint,message } = useSelector((state) => state.products);
  return (
    <td {...restProps}>
      {editing ? (
        <Space>
          {inputNode}
          <Button type="primary" onClick={save} size="small" style={{ marginLeft: 8 }}>
            Save
          </Button>
          <Button onClick={toggleEdit} size="small" style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Space>
      ) : (
        <div style={{ paddingRight: 24 }}>
          {children}
         
        </div>
      )}
    </td>
  );
};



const Usertable = () => {



  const dispatch = useDispatch();

  const { isLoading, allPateint,message } = useSelector((state) => state.products);

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueNames2, setUniqueNames2] = useState([]);

  console.log(message)
  useEffect(() => {
    dispatch(getAllPateints());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

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

      const uniqueNames = [...new Set(allPateint.data.map((patient) => patient.FIRST_NAME))];
      setUniqueNames2(uniqueNames);
    }
  }, [allPateint, searchText]);

  const allPatientData = allPateint?.data;
  const uniqueNames = allPatientData && Array.isArray(allPatientData) ? [...new Set(allPatientData.map((patient) => patient.FIRST_NAME))] : [];
  
  const nameFilters = uniqueNames.map((name) => ({ text: name, value: name }));

  const columns = [
    {
      title: "Patent ID",
      dataIndex: "_id",
      key: "patentId",
      render: (text, record) => (
        <Link href={`pateint/${record._id}`}>{`${record._id}`}</Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "First_Name",
      key: "FIRST_NAME",
      filters: nameFilters,
      onFilter: (value, record) => record.FIRST_NAME === value,
      
    },
    
    {
      title: "Phone Number",
      dataIndex: "Contact_Number",
      key: "HOME_PHONE",
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "GENDER",
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Age",
      dataIndex: "Age",
      key: "Age",
    
    },
    {
      title: "Material Status",
      dataIndex: "Matertal_Status",
      key: "Material Status",
      filters: [
        { text: "Single", value: "single" },
        { text: "Married", value: "married" },
      ],
      onFilter: (value, record) => record.Matertal_Status === value,
      // render: (tags) => (
      //   <>
      //     {tags?.map((tag, index) => (
      //       <Tag color="blue" key={index}>
      //         {tag}
      //       </Tag>
      //     ))}
      //   </>
      // ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      defaultSortOrder: 'descend', // Sort by latest created date
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD HH:mm:ss"), // Format date with time
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(), // Custom sorter function
    },
  ];




  const [editingKey, setEditingKey] = useState('');
  const [dataSource, setDataSource] = useState([...data]);
  const [filterDoctor, setFilterDoctor] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = (record) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => record.key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...record });
      setDataSource(newData);
      setEditingKey('');
    }
  };

  const deleteRecord = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const handleFilterChange = (value) => {
    setFilterDoctor(value);
  };
  const handlePrint = () => {
    window.print();
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Patients");
    XLSX.writeFile(wb, "patients.xlsx");
  };

  const mergedColumns = columns.map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      inputType: col.dataIndex === 'maxNum' ? 'number' : 'text',
      dataIndex: col.dataIndex,
      title: col.title,
      editing: isEditing(record),
    }),
  }));

  return (
    <div>
      <Title level={3}>Patient Manager</Title>
      <Space style={{ marginBottom: 16 }}>
        <Link href="/UserForm"> <Button type="primary" >
          Add a Patient
        </Button></Link>
       
        <DatePicker  defaultValue={moment()} format="YYYY-MM-DD" />
   
        <Input.Search
            placeholder="Master Filter"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: 8, width: "max-content" ,height:10}}
            allowClear
            className="master Search"
          />
      </Space>

      <Title level={4}>All Patient (1)</Title>
      {/* <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={dataSource.filter(
          (item) => filterDoctor === '' || item.doctor === filterDoctor
        )}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      /> */}

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

      <Flex
        horizontal
        className="setmaster Search"
        style={{ justifyContent: "space-between" }}
      >
        <Flex vertical>
          {/* <Typography.Title style={{ margin: "0px" }} level={5}>
            Master Search
          </Typography.Title> */}
          {/* <Input.Search
            placeholder="Master Filter"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: 8, width: "max-content" }}
            allowClear
            className="master Search"
          /> */}
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
        </Flex>

        
      </Flex>


      <Flex gap="middle" horizontal>
        <Table
          loading={isLoading}
          style={{ width: "100%", opacity: isLoading ? 0.5 : 1 }}
          columns={columns}
          dataSource={filteredData?.map((patient) => ({
            ...patient,
            key: patient._id,
          }))}
        />
      </Flex>
  
    </div>
    </div>
  );
};

export default Usertable;