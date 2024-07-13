import React, { useState, useEffect } from "react";
import { Form, Input, Button, Table, Row, Col, Popconfirm, DatePicker, Select, Flex } from "antd";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./BillingForm.css";
import PDFgenerator from "../Utilities/PDFgenerator";
import { getAllPateints, saveBill } from "../api/api";
import {
  FileTextTwoTone,
} from "@ant-design/icons";
const { Option } = Select;

const BillingForm = ({ id }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [patientDetails, setPatientDetails] = useState({
    patientId: "",
    FIRST_NAME: "",
  });

  const dispatch = useDispatch();
  const { allPateint, isLoading,BillDetails } = useSelector((state) => state.products);
console.log(BillDetails);
  useEffect(() => {
    dispatch(getAllPateints());

  }, [dispatch]);

  useEffect(() => {
    calculateTotalAmount();
  }, [data]);

  useEffect(() => {
    form.setFieldsValue({
      totalBillAmount: totalAmount,
      ...patientDetails,
    });
  }, [totalAmount, patientDetails]);

  useEffect(() => {
    if (id) {
      const selectedPatient = allPateint.data.find((patient) => patient._id === id);
      if (selectedPatient) {
        setPatientDetails({
          patientId: selectedPatient._id,
          FIRST_NAME: selectedPatient.First_Name,
        });
      }
    }
  }, [id, allPateint.data]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  // const save = async (key) => {
  //   try {
  //     const rowData = await form.validateFields();
  //     rowData.netAmount = rowData.qty * rowData.amount;
  //     const newData = [...data];
  //     const index = newData.findIndex((item) => key === item.key);
  //     if (index > -1) {
  //       const item = newData[index];
  //       newData.splice(index, 1, { ...item, ...rowData });
  //       setData(newData);
  //       setEditingKey("");
  //     }
      
  //     const headerData = {
  //       Bill_ID: form.getFieldValue("Bill_ID"),
  //       PaymentDueDate: form.getFieldValue("PaymentDueDate"),
  //       billDate: form.getFieldValue("billDate"),
  //       totalBillAmount: totalAmount,
  //       patient_id: patientDetails.patientId,
  //       FIRST_NAME: patientDetails.FIRST_NAME,
  //     };

  //     console.log("Header Data:", headerData);
  //     console.log("Table Data:", newData);
  //      dispatch(saveBill({ headerData:headerData, tableData: newData }));
  //   } catch (errInfo) {
  //     console.log("Validate Failed:", errInfo);
  //   }
  // };
  const save = async (key) => {
    try {
      const rowData = await form.validateFields();
      rowData.netAmount = rowData.qty * rowData.amount;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...rowData });
        setData(newData);
        setEditingKey("");
      }
      
      const headerData = {
        Bill_ID: form.getFieldValue("Bill_ID"),
        PaymentDueDate: form.getFieldValue("PaymentDueDate"),
        Tax: form.getFieldValue("Tax"),
        billDate: form.getFieldValue("billDate"),
        totalBillAmount: totalAmount,
        patient_id: patientDetails.patientId,
        FIRST_NAME: patientDetails.FIRST_NAME,
        Contact_Number: patientDetails.Contact_Number,
      };

      const formattedTableData = newData.map((item) => ({
        key: item.key,
        srNo: item.srNo,
        qty: item.qty,
        amount: item.amount,
        discount: item.discount,
      }));

      console.log("Header Data:", headerData);
      console.log("Table Data:", formattedTableData);
      dispatch(saveBill({ headerData, tableData: formattedTableData }));
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };


  const handleGenerateBill = () => {
    const headerData = {
      Bill_ID: form.getFieldValue("Bill_ID"),
      PaymentDueDate: form.getFieldValue("PaymentDueDate"),
      billDate: form.getFieldValue("billDate"),
      totalBillAmount: totalAmount,
      patient_id: patientDetails.patientId,
      FIRST_NAME: patientDetails.FIRST_NAME,
    };

    const billingDetails = data.map((item) => ({
      srNo: item.srNo,
      qty: item.qty,
      amount: item.amount,
      discount: item.discount,
      netAmount: item.netAmount,
      itemName: item.itemName,
    }));

    PDFgenerator(headerData, data, billingDetails, totalAmount);
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const handleAdd = () => {
    const newRow = {
      key: data.length + 1,
      srNo: data.length + 1,
      qty: "",
      amount: "",
      discount: "",
      netAmount: "",
      itemName: "",
    };
    setData([...data, newRow]);
    setEditingKey(newRow.key);
    form.resetFields();
  };

  const calculateTotalAmount = () => {
    let total = 0;
    data.forEach((item) => {
      total += parseFloat(item.netAmount) || 0;
    });
    setTotalAmount(total);
  };

  const handlePatientSelect = (value, option) => {
    const selectedPatient = allPateint.data.find((patient) => patient._id === value);
    if (selectedPatient) {
      setPatientDetails({
        patientId: selectedPatient._id,
        FIRST_NAME: selectedPatient.First_Name,
      });
    }
  };

  const columns = [
    {
      title: "Sr.No",
      dataIndex: "srNo",
      key: "srNo",
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      editable: true,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      editable: true,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      editable: true,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      editable: true,
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button onClick={() => save(record.key)} type="link">
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button disabled={editingKey !== ""} onClick={() => edit(record)} type="link">
              Edit
            </Button>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
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
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>

    <Flex vertical>
    <flex style={{display:"flex"}}>
 
    <FileTextTwoTone style={{fontSize:"20px"}}/>
    <h2  style={{paddingLeft:"10px"}}>{id?"Edit Bill":"New Bill"}</h2>
</flex>
    <Form form={form} layout="vertical">

    <Row gutter={16}>
      <Col span={6}>
        <Form.Item label="Bill ID" name="Bill_ID">
          <Input  style={{ width: "100%" }} placeholder="Bill ID" />
        </Form.Item>
      </Col>
      <Col span={6}>
      <Form.Item label="Contact Number" name="Contact_Number">
        <Input  style={{ width: "100%" }} placeholder="Bill ID" />
      </Form.Item>
    </Col>
      
      <Col span={6}>
        <Form.Item label="Bill Date" name="billDate">
          <DatePicker style={{ width: "100%" }} className="custom-input" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item   label="Patient" name="FIRST_NAME">
          <Select
            showSearch
            style={{ width: "100%",height:40 }}
            placeholder="Select a patient"
            optionFilterProp="children"
            onChange={handlePatientSelect}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={patientDetails.patientId}
            disabled={!!id}
          >
            {allPateint.data.map((patient) => (
              <Option key={patient._id} value={patient._id}>
                {patient.First_Name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="Patient ID" name="patientId">
          <Input disabled style={{ width: "100%" }} placeholder="Patient ID" value={patientDetails.patientId} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="Tax" name="Tax">
          <Input style={{ width: "100%" }} placeholder="0" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="Payment Due Date" name="PaymentDueDate">
          <DatePicker style={{ width: "100%" }} className="custom-input" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="Total Bill Amount" name="totalBillAmount">
          <Input style={{ width: "100%" }} placeholder="0" disabled value={totalAmount} />
        </Form.Item>
      </Col>
    </Row>

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
              cell: (props) => {
                const { children, ...restProps } = props;
                return (
                  <td {...restProps}>
                    {restProps.editing ? (
                      <Form.Item
                        name={restProps.dataIndex}
                        style={{ margin: 0 }}
                        rules={[
                          {
                            required: true,
                            message: `Please Input ${restProps.title}!`,
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    ) : (
                      children
                    )}
                  </td>
                );
              },
            },
          }}
          columns={mergedColumns}
          dataSource={data}
          pagination={false}
          footer={() => (
            <div style={{ textAlign: "right", marginRight: "10%" }}>
              <strong>Total Amount: </strong>
              <span>{totalAmount}</span>
            </div>
          )}
        />
      </Col>
    </Row>
    <Row gutter={16} style={{ marginTop: 16 }}>
      <Col span={4}>
        <Button type="primary" onClick={() => save(editingKey)}>
          Save
        </Button>
      </Col>
      <Col span={4}>
        <Button type="primary" onClick={handleGenerateBill}>
          Generate Bill
        </Button>
      </Col>
    </Row>
  </Form>
    </Flex>
  </>
  );
};

export default BillingForm;
