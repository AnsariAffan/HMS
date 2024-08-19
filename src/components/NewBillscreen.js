import React, { useState, useEffect } from "react";
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
  Flex,
  message,
  FloatButton,
  Spin,
  notification
} from "antd";
import Cascader from 'antd/es/cascader';

import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./BillingForm.css";
import PDFgenerator from "../Utilities/PDFgenerator";
import { getAllBills, getAllPateints, getAllPayments, saveBill, updateBill } from "../api/api";
import { FileTextTwoTone } from "@ant-design/icons";
import { useParams,Link ,useHistory} from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";
import PaymentModal from "./PaymentModal";
import PaymentTable from "./PaymentTable";
const { Option } = Select;

const NewBillscreen = () => {
  const {id} = useParams();
  console.log(id);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [billEdit, setbillEdit] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [patientBillData ,setpatientBillData]=useState()
const [patientDetail ,setpatientDetail] = useState()
const [lastPayment,setLastPayment] = useState()


console.log(patientDetail);

const history = useHistory()


  const dispatch = useDispatch();
  const { allPateint, isLoading, BillDetails,payments } = useSelector(
    (state) => state.products
  );
console.log(payments.data);




  const [billHeader,setBillheader] = useState({})
const [billtable,setbilltable] = useState()


  useEffect(() => {
    calculateTotalAmount();
  }, [data]);

  useEffect(() => {
    form.setFieldsValue({
      totalBillAmount: totalAmount,
     
    });
  }, [totalAmount]);

  useEffect(() => {
    dispatch(getAllBills());
    dispatch(getAllPateints())
   
  }, [dispatch]);


 


  useEffect(() => {

    const filteredPayments = payments.data?.filter(payment => payment.billId === id) || [];
// console.log(filteredPayments[filteredPayments.length-1]);
setLastPayment(filteredPayments[filteredPayments.length-1])
console.log(lastPayment?.paymentStatus);
    dispatch(getAllPayments())

    if (id && BillDetails?.data) {
      const billData = Array.isArray(BillDetails?.data) ? BillDetails.data.find((bill) => bill?._id === id) : null;
      const pid = Array.isArray(allPateint?.data) ? allPateint.data.find((bill) => bill?._id === BillDetails.patient_id) : null;
      setpatientBillData(billData)
console.log(pid);
      if (billData) {
        setBillheader(billData.headerData || {});
        setbilltable(billData.tableData || []);
        form.setFieldsValue({
          // ...billData.headerData,
           patient_id: billData.patient_id,
      // PaymentDueDate: billData.PaymentDueDate ,
      // billDate: billData.billDate,
      Bill_ID: billData._id,
      Tax: billData.Tax,
      totalBillAmount: totalAmount,
      FIRST_NAME: billData.FIRST_NAME,
      Contact_Number:billData.Contact_Number,
      billDate: billData.billDate
      ? moment(billData.billDate)
      : null,
      PaymentDueDate: billData.PaymentDueDate
      ? moment(billData.PaymentDueDate)
      : null,
      paymentStatus:   lastPayment?.paymentStatus
      ?  lastPayment?.paymentStatus
      : null,
    
        });
        setData(billData?.lineItems || []);
        calculateTotalAmount();
      }
    }
  }, [id, BillDetails,dispatch]);




  //defualting Login on bill screen from patient table
 
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };


  const handleDelete = (key) => {
    // Remove the item from the local state
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  
    // Update the table data state
    const formattedTableData = newData.map((item) => ({
      key: item.key,
      srNo: item.srNo,
      qty: item.qty,
      amount: item.amount,
      discount: item.discount,
      netAmount: item.netAmount,
      itemName: item.itemName,
    }));
    
    setbilltable(formattedTableData);
    console.log("Table Data after delete:", formattedTableData);
  
    // Optionally, you can show a success message
    message.success("Item deleted successfully.");
  };

  
  const handleAdd = () => {
    const newRow = {
      key: data.length + 1,
      srNo: data.length + 1,
      qty: "",
      amount: "",
      discount: "",
      netAmount: "",
      itemName: [],
    };
    setData([...data, newRow]);
    setEditingKey(newRow.key);
    form.resetFields(['qty', 'amount', 'discount', 'netAmount', 'itemName']); // Reset only row fields
  };
  

  const calculateTotalAmount = () => {
    let total = 0;
    data.forEach((item) => {
      total += parseFloat(item.netAmount) || 0;
    });
    setTotalAmount(total);
  };
  const saveHeaderData = () => {
    const patientData = BillDetails?.data?.find((patient) => patient?._id === id);

     // Default the form fields if needed
form.setFieldsValue({
  FIRST_NAME: patientData.FIRST_NAME,
  Contact_Number: patientData.Contact_Number,
});

console.log(patientData);
const headerData = {
  patient_id: id,
  PaymentDueDate: form.getFieldValue("PaymentDueDate"),
  billDate: form.getFieldValue("billDate"),
  Tax: form.getFieldValue("Tax"),
  totalBillAmount: totalAmount,
  FIRST_NAME: patientData.FIRST_NAME,// Directly assign patient data
  Contact_Number: patientData.Contact_Number // Directly assign patient data
};

// Set bill header data
setBillheader(headerData);
console.log("Header Data:", headerData);

// Return header data
return headerData;
};



  
  const saveTableData = async (key) => {
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
  
      const formattedTableData = newData.map((item) => ({
        key: item.key,
        srNo: item.srNo,
        qty: item.qty,
        amount: item.amount,
        discount: item.discount,
        netAmount: item.netAmount,
        itemName: item.itemName,
      }));
  
      setbilltable(formattedTableData);
     
      console.log("Table Data:", formattedTableData);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  useEffect(()=>{
    saveHeaderData();
     saveTableData(editingKey);
  },[id && patientBillData])
  

  const handleGenerateBill = () => {
    const headerData = {
      Bill_ID: form.getFieldValue("Bill_ID"),
      PaymentDueDate: form.getFieldValue("PaymentDueDate"),
      billDate: form.getFieldValue("billDate"),
      totalBillAmount: totalAmount,
      patient_id: patientBillData.patientId,
      FIRST_NAME: patientBillData.FIRST_NAME,
    };

    const billingDetails = data.map((item) => ({
      srNo: item.srNo,
      qty: item.qty,
      amount: item.amount,
      discount: item.discount,
      netAmount: item.netAmount,
      itemName: item.itemName,
    }));

    PDFgenerator(headerData, data, billingDetails, totalAmount,patientDetail);
  };

 

  useEffect(() => {
    if (BillDetails?.data && allPateint?.data) {
      // Extract patient IDs from BillDetails.data
      const patientIdsFromBills = BillDetails.data.map(bill => bill.patient_id);
  
      // Find the first patient from allPateint.data with an ID in patientIdsFromBills
      const patient = allPateint.data.find(patient =>
        patientIdsFromBills.includes(patient._id)
      );
  
      console.log('Found Patient:', patient);
      setpatientDetail(patient)
      // If you need to do something specific with the patient, you can add that logic here
    }
  }, [BillDetails?.data, allPateint?.data]);
  
  
  
  const handleSaveBill = async () => {
    try {
      const headerData = saveHeaderData();
      await saveTableData(editingKey);
      form.getFieldValue(['qty', 'amount', 'discount', 'netAmount', 'itemName']); 
  
      if (id && patientBillData) {
        // Update existing bill
        await dispatch(updateBill({
          headerData: { ...headerData, _id: patientBillData._id, patient_id: patientBillData?.patient_id },
          tableData: billtable
        }));
  
        // Success notification for bill update
        notification.success({
          message: 'Bill Updated',
          description: 'The bill has been updated successfully.',
          placement: 'topRight',
        });
        console.log("Bill updated successfully.");
      } else {
        // Add new bill
        await dispatch(saveBill({
          headerData: headerData,
          tableData: billtable
        }));
  
        // Success notification for adding new bill
        notification.success({
          message: 'Bill Added',
          description: 'The new bill has been added successfully.',
          placement: 'topRight',
        });
        console.log("Bill added successfully.");
      }
    } catch (error) {
      // Error notification for save/update failure
      notification.error({
        message: 'Error',
        description: 'There was an error saving or updating the bill. Please try again.',
        placement: 'topRight',
      });
      console.error("Error saving/updating bill:", error);
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
      render: (text, record) => (
        <Cascader
          options={options}
          onChange={(value) => handleCascaderChange(value, record)}
          value={record.itemName}
          placeholder="Select Item"
          style={{ width: '100%' }}
        />
      ),
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
          <span style={{display:"flex" }}>
            <Button onClick={() => saveTableData(record.key)} type="link">
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <span style={{display:"flex" }}>
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
  const options = [
    {
      value: 'category1',
      label: 'Category 1',
      children: [
        {
          value: 'item1',
          label: 'Item 1',
        },
        {
          value: 'item2',
          label: 'Item 2',
        },
      ],
    },
    {
      value: 'category2',
      label: 'Category 2',
      children: [
        {
          value: 'item3',
          label: 'Item 3',
        },
        {
          value: 'item4',
          label: 'Item 4',
        },
      ],
    },
  ];
  
  const handleCascaderChange = (value, record) => {
    const newData = [...data];
    const index = newData.findIndex((item) => record.key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, itemName: value });
      setData(newData);
    }
  };
  

  

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
    return(

      <>
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

    </>  
    )
    
     

  }


  return (
    <>

   
       <Flex vertical className="billForm">
      <flex style={{ display: "flex" ,justifyContent:"space-between"}}>
        <flex style={{ display: "flex" }}>
          <FileTextTwoTone style={{ fontSize: "20px" }} />
          <h2 style={{ paddingLeft: "10px" }}>
           New Bill
          </h2>
        </flex>
        <Link to="" style={{padding: "20px"}}>{patientDetail?._id}</Link>
        </flex>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Bill ID" name="Bill_ID">
                <Input
                disabled
                  style={{ width: "100%" }}
                  placeholder="Bill ID"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Contact Number" name="Contact_Number">
                <Input style={{ width: "100%" }} placeholder="Contact Number" 
   
                 
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Bill Date" name="billDate" >
                <DatePicker
             
                  style={{ width: "100%" }}
                  className="custom-input"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
            <Form.Item label="Patient" name="FIRST_NAME" >
            <Input disabled style={{ width: "100%" }} placeholder="Patient" />
            </Form.Item>
          </Col>
           
         
            <Col span={6}>
              <Form.Item label="Tax" name="Tax">
                <Input style={{ width: "100%" }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Payment Due Date" name="PaymentDueDate">
                <DatePicker
                  style={{ width: "100%" }}
                  className="custom-input"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Total Bill Amount" name="totalBillAmount">
                <Input
                  style={{ width: "100%" }}
                  placeholder="0"
                  disabled
                  value={totalAmount}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
            <Form.Item label="Payment status" name="paymentStatus">
              <Input
                style={{ width: "100%" }}
               
                disabled
                value={lastPayment?.paymentStatus}
              />
            </Form.Item>
          </Col>
            </Row>

          <Row gutter={16}>
            <Col span={18}>
            <Button  
              // style={{

              //   border: '1px solid black', /* Blank border */
              //   color: 'black', /* Blank color text */
              //   backgroundColor: 'white', /* White background */
              //   // Optional: Add padding or other styling if needed
              //   padding: '8px 16px',
              // }}
              onClick={handleAdd}>
                Add Row
              </Button>
            </Col>
            <Col span={3}>
            <PaymentModal/>
            
            </Col>
            <Col span={3}>
            <PaymentTable/>
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
              <Button type="primary" onClick={() => handleSaveBill(editingKey)}>
                Save
              </Button>
            </Col>
            
            <FloatButton  tooltip={<div>Generate Bill</div>}  onClick={handleGenerateBill} />
          </Row>
        </Form>
      </Flex> 
             
    </>
  );
};

export default NewBillscreen;
