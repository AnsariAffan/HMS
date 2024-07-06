import React, { useState, useEffect } from "react";
import { Form, Input, Button, Table, Row, Col, Popconfirm, DatePicker } from "antd";
import "./BillingForm.css";

const BillingForm = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    calculateTotalAmount();
  }, [data]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

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
        PID: form.getFieldValue("PID"),
        patient: form.getFieldValue("patient"),
        PaymentDueDate: form.getFieldValue("PaymentDueDate"),
        billDate: form.getFieldValue("billDate"),
        totalBillAmount: form.getFieldValue("totalBillAmount"),
        paidAmount: form.getFieldValue("paidAmount"),
        openAmount: form.getFieldValue("openAmount"),

      };

      console.log("Header Data:", headerData);
      console.log("Table Data:", newData);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const handleAdd = () => {
    const newRow = {
      key: data.length + 1,
      srNo: data.length + 1,
      head: "",
      rate: "",
      qty: "",
      amount: "",
      discount: "",
      netAmount: "",
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

  const columns = [
    {
      title: "Sr.No",
      dataIndex: "srNo",
      key: "srNo",
    },
    {
      title: "Asset Name",
      dataIndex: "head",
      key: "head",
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

  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="Bill Date" name="billDate">
            <DatePicker style={{ width: "100%" }} className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Patient" name="patient">
            <Input style={{ width: "100%" }} placeholder="Sachin" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Patient ID" name="PID">
            <Input style={{ width: "100%" }} placeholder="IPD-29/20-21" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Payment Due Date" name="PaymentDueDate">
            <DatePicker style={{ width: "100%" }} className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Total Bill Amount" name="totalBillAmount">
            <Input style={{ width: "100%" }} placeholder="Panel" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Paid Amount" name="paidAmount">
            <Input style={{ width: "100%" }} placeholder="Hospital" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Open Amount" name="openAmount">
            <Input style={{ width: "100%" }} placeholder="Hospital" />
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
              <div style={{ textAlign: "right", marginRight: '10%' }}>
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
      </Row>
    </Form>
  );
};

export default BillingForm;
