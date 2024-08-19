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
  notification,
  FloatButton,
} from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { createAppointment, deleteAppointment, getAllAppointment, getAllDoctors, getAllPateints, updateAppointment } from "../api/api";
import { PlusOutlined} from '@ant-design/icons';
const { Option } = Select;

const Appointment = () => {
  const [form] = Form.useForm();
  const [data, setData] = React.useState([]);
  const [editingKey, setEditingKey] = React.useState("");
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [modalType, setModalType] = React.useState("add"); // "add" or "edit"
  const [currentRecord, setCurrentRecord] = React.useState(null);
  const { allPateint,allDoctors, isLoading, appointments } = useSelector(
    (state) => state.products
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDoctors())
    dispatch(getAllAppointment())
    dispatch(getAllPateints())
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
  const handleDelete = (record) => {
    dispatch(deleteAppointment(record._id))
      .then(() => {
      
        // Show success notification
        notification.error({
          message: 'Appointment deleted',
          description: 'Appointment deleted successfully',
        });  // Fetch the updated appointments list after deletion
        dispatch(getAllAppointment());
      })
      .catch((error) => {
        // Show success notification
        notification.error({
          message: 'Appointment deleted',
          description: 'Faild deleted successfully',
        });  // Fetch the updated appointments list after deletion
      });
  };
  
  const handleAdd = () => {
    form.resetFields();
    setModalType("add");
    setIsModalVisible(true);
  };

//   const handleModalOk = () => {
//     form
//       .validateFields()
//       .then((values) => {
//         const formattedValues = {
//           ...values,
//           scheduledDateTime: values.scheduledDateTime
//             ? values.scheduledDateTime.format("YYYY-MM-DDTHH:mm:ss") // Adjusted format
//             : null,
//         };

//         if (modalType === "add") {
//           dispatch(createAppointment(formattedValues)) // Send new appointment data
//             .then(() => {
//              // Show success notification
//         notification.success({
//           message: 'Appointment added',
//           description: 'Appointment added successfully',
//         });  // Fetch the updated appointments list after deletion
//         dispatch(getAllAppointment());
//               setIsModalVisible(false);
//               setEditingKey("");
//             })
//             .catch((error) => {
            
//               // Show success notification
//         notification.error({
//           message: 'Appointment added',
//           description: `Failed to add appointment: ${error.message}`,
//         });  // Fetch the updated appointments list after deletion
//         dispatch(getAllAppointment());
//             });
//         } else if (modalType === "edit") {
//           const newData = data.map((item) =>
//             item.key === currentRecord.key
//               ? { ...item, ...formattedValues }
//               : item
//           );
//           setData(newData);
//           console.log(newData);
// dispatch(updateAppointment(newData))
       
//           notification.success({
//             message: 'Appointment updated',
//             description: 'Appointment updated successfully',
//           });
//           setIsModalVisible(false);
//           setEditingKey("");
//           setCurrentRecord(null);
//         }

//         console.log("Updated Data: ", data); // Log updated data
//       })
//       .catch((info) => {
//         console.log("Validate Failed:", info);
//       });
//   };

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
              // Show success notification
              notification.success({
                message: "Appointment added",
                description: "Appointment added successfully",
              });
              // Fetch the updated appointments list after adding
              dispatch(getAllAppointment());
              setIsModalVisible(false);
              setEditingKey("");
            })
            .catch((error) => {
              // Show error notification
              notification.error({
                message: "Failed to add appointment",
                description: `Error: ${error.message}`,
              });
            });
        } else if (modalType === "edit") {
          const updatedData = {
            ...currentRecord, 
            ...formattedValues
          };
  
          // Update appointment in the database
          dispatch(updateAppointment({updatedData,id:updatedData._id}))
            .then(() => {
              // Log updated data to the console
              console.log("Updated Appointment: ", updatedData);

              // Show success notification
              notification.success({
                message: "Appointment updated",
                description: "Appointment updated successfully",
              });
  
              // Fetch the updated appointments list after updating
              dispatch(getAllAppointment());
              setIsModalVisible(false);
              setEditingKey("");
              setCurrentRecord(null);
            })
            .catch((error) => {
              // Show error notification
              notification.error({
                message: "Failed to update appointment",
                description: `Error: ${error.message}`,
              });
            });
        }
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
       <Button type="link" danger onClick={() => handleDelete(record)}>
                Delete
              </Button>
            
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
            loading={isLoading}
        
            footer={() => (
              <div style={{ textAlign: "right", marginRight: "10%" }}>
                <strong>Total Amount: </strong>
                <span>0</span>
              </div>
            )}
          />
          <FloatButton onClick={handleAdd} icon={<PlusOutlined/>} type="primary" style={{ insetInlineEnd: 50 }} />
        </Col>
      </Row>

      <Modal
        title={modalType === "add" ? "Add Row" : "Edit Row"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="horizontal" loading={isLoading}>
          <Form.Item
            name="doctorName"
            label="Doctor"
            rules={[{ required: true, message: 'Please select a doctor!' }]}
          >
            <Select placeholder="Select a doctor">
            {allDoctors?.data?.map((dn)=>{

              return    <Option value={dn.First_Name}>{dn.First_Name}</Option>
            })}
            </Select>
          </Form.Item>
          <Form.Item
            name="patientName"
            label="Patient"
            rules={[{ required: true, message: 'Please select a patient!' }]}
          >
            <Select placeholder="Select a patient">
            {allPateint?.data?.map((pn)=>{

              return   <Option value={pn.First_Name}>{pn.First_Name}</Option>
            })}
            
           
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
