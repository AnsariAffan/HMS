import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Row,
  Col,
  Popconfirm,
  DatePicker,
  Select,
  Modal,
  message,
} from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { createAppointment, getAllAppointment, getAllPateints } from "../api/api";

const { Option } = Select;

const Appointment = () => {
  const [form] = Form.useForm();
  const [data, setData] = React.useState([]);
  const [editingKey, setEditingKey] = React.useState("");
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [modalType, setModalType] = React.useState("add"); // "add" or "edit"
  const [currentRecord, setCurrentRecord] = React.useState(null);
  const { allPateint, isLoading, appointments } = useSelector(
    (state) => state.products
  );
  console.log(appointments);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllAppointment())
  }, [dispatch]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      scheduledDateTime: moment(record.scheduledDateTime),
    });
    setEditingKey(record.key);
    setModalType("edit");
    setIsModalVisible(true);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    message.success("Item deleted successfully.");
  };

  const handleAdd = () => {
    form.resetFields();
    setModalType("add");
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          scheduledDateTime: values.scheduledDateTime
            ? values.scheduledDateTime.format("YYYY-MM-DDTHH:mm:ss") // Adjusted format
            : null,
        };

        if (modalType === "add") {
          dispatch(createAppointment(formattedValues)) // Send new appointment data
            .then(() => {
              message.success("Appointment added successfully.");
              setIsModalVisible(false);
              setEditingKey("");
            })
            .catch((error) => {
              message.error(`Failed to add appointment: ${error.message}`);
            });
        } else if (modalType === "edit") {
          const newData = data.map((item) =>
            item.key === currentRecord.key
              ? { ...item, ...formattedValues }
              : item
          );
          setData(newData);

          message.success("Row updated successfully.");
          setIsModalVisible(false);
          setEditingKey("");
          setCurrentRecord(null);
        }

        console.log("Updated Data: ", data); // Log updated data
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingKey("");
    setCurrentRecord(null);
  };

  const columns = [
    {
      title: "Sr.No",
      dataIndex: "srNo",
      key: "srNo",
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: (text) => (
        <span>{text || "Not Selected"}</span>
      ),
    },
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text) => (
        <span>{text || "Not Selected"}</span>
      ),
    },
    {
      title: 'Scheduled Date Time',
      dataIndex: 'scheduledDateTime',
      key: 'scheduledDateTime',
      render: (text) => (
        <span>{text || "Not Scheduled"}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span>{text || "Not Set"}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              type="link"
            >
              Edit
            </Button>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'scheduledDateTime' ? 'date' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const EditableCell = ({
    title,
    editable,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editable ? (
          <Form.Item
            name={restProps.dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {restProps.dataIndex === "scheduledDateTime" ? (
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
              />
            ) : restProps.dataIndex === "doctorName" || restProps.dataIndex === "patientName" ? (
              <Select>
                {restProps.dataIndex === "doctorName" ? (
                  <>
                    <Option value="Dr. John Smith">Dr. John Smith</Option>
                    <Option value="Dr. Jane Doe">Dr. Jane Doe</Option>
                  </>
                ) : (
                  <>
                    <Option value="Alice Johnson">Alice Johnson</Option>
                    <Option value="Bob Brown">Bob Brown</Option>
                  </>
                )}
              </Select>
            ) : (
              <Input />
            )}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Button type="primary" onClick={handleAdd}>
            Add Row
          </Button>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            dataSource={appointments}
            pagination={false}
            footer={() => (
              <div style={{ textAlign: "right", marginRight: "10%" }}>
                <strong>Total Amount: </strong>
                <span>0</span>
              </div>
            )}
          />
        </Col>
      </Row>

      <Modal
        title={modalType === "add" ? "Add Row" : "Edit Row"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="doctorName"
            label="Doctor"
            rules={[{ required: true, message: 'Please select a doctor!' }]}
          >
            <Select placeholder="Select a doctor">
              <Option value="Dr. John Smith">Dr. John Smith</Option>
              <Option value="Dr. Jane Doe">Dr. Jane Doe</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="patientName"
            label="Patient"
            rules={[{ required: true, message: 'Please select a patient!' }]}
          >
            <Select placeholder="Select a patient">
              <Option value="Alice Johnson">Alice Johnson</Option>
              <Option value="Bob Brown">Bob Brown</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="scheduledDateTime"
            label="Scheduled Date Time"
            rules={[{ required: true, message: 'Please select a date and time!' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
          >
      
          <Select placeholder="Select a status">
          <Option value="Scheduled">Scheduled</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Cancelled">Cancelled</Option>
          <Option value="Rescheduled">Rescheduled</Option>
        </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Appointment;
