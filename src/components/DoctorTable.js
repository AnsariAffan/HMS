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
  Dropdown,
  Menu,
  Spin,
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined, ExportOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
// import { getAllDoctors } from '../api/api'; // Update with your API function
import * as XLSX from 'xlsx';
// import './DoctorTable.css'; // Create a similar CSS file for styling
import { Link } from 'react-router-dom';
import { getAllDoctors, updateDoctor } from '../api/api';

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

const DoctorTable = () => {

  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueSpecialties, setUniqueSpecialties] = useState([]);

  const { allDoctors, isLoading } = useSelector( (state) => state.products);

  console.log(allDoctors.data);

  useEffect(() => {
     dispatch(getAllDoctors());
     dispatch(updateDoctor())
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  useEffect(() => {
    if (Array.isArray(allDoctors?.data)) {
      const filteredData = allDoctors.data.filter((doctor) =>
        Object.values(doctor).some(
          (value) =>
            value &&
            typeof value === 'string' &&
            value.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredData(filteredData);

      const uniqueSpecialties = [...new Set(allDoctors.data.map((doctor) => doctor.Specialty))];
      setUniqueSpecialties(uniqueSpecialties);
    }
  }, [allDoctors, searchText]);

  const specialtyFilters = uniqueSpecialties.map((specialty) => ({ text: specialty, value: specialty }));

  const columns = [
    {
      title: 'Doctor ID',
      dataIndex: '_id',
      key: 'doctorId',
      render: (text, record) => (
        <Link to={`/EditdoctorForm/${record._id}`}>{`${record._id}`}</Link>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'First_Name',
      key: 'First_Name',
    },
    {
      title: 'Specialty',
      dataIndex: 'Specialty',
      key: 'Specialty',
      filters: specialtyFilters,
      onFilter: (value, record) => record.Specialty === value,
    },
    {
      title: 'Phone Number',
      dataIndex: 'Contact_Number',
      key: 'Contact_Number',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Doctors');
    XLSX.writeFile(wb, 'doctors.xlsx');
  };

  return (
    <div className="doctor-table" style={{ width: '100%', paddingInline: '15px' }}>
      <Space style={{ marginBottom: 0 }}>
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
          trigger={['click']}
        >
          <a onClick={(e) => e.preventDefault()} style={{ cursor: 'pointer' }}>
            <Space>
              Export Report <ExportOutlined />
            </Space>
          </a>
        </Dropdown>
        <Link to="/doctorForm">
          <Button style={{ marginBottom: 8, width: 'max-content', height: '40px' }} type="primary">
            <UserOutlined style={{ fontSize: '20px' }} />
            Add Doctor
          </Button>
        </Link>
        <DatePicker style={{ marginBottom: 8, width: '15rem', height: '40px' }} defaultValue={moment()} format="YYYY-MM-DD" />
        <Input.Search
          placeholder="Master Filter"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 8, width: 'max-content', height: '40px' }}
          allowClear
          className="master Search"
        />
      </Space>

      <Title level={4}>All Doctors ("doctorCount")</Title>

      <div style={{ position: 'relative' }}>
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <Spin size="large" />
          </div>
        )}

        <Table
          loading={isLoading}
          style={{ width: '100%', opacity: isLoading ? 0.5 : 1 }}
          columns={columns}
          dataSource={filteredData?.map((doctor) => ({
            ...doctor,
            key: doctor._id,
          }))}
          pagination={{
            pageSize: 50,
          }}
          scroll={{
            y: 310,
          }}
          footer={() => (
            <div style={{ textAlign: 'right', padding: '4px 0' }}>
              <strong>Total Records: </strong>
              <span>{filteredData?.length}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default DoctorTable;
