import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, DatePicker, Select, notification, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createpayment, getAllPayments } from '../api/api';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;

const PaymentModal = ({ billingId }) => {
  const { id: urlId } = useParams();
  const id = billingId || urlId; // Use billId if provided, otherwise fallback to urlId

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [invoiceAmount, setInvoiceAmount] = useState(null);
  const [previousPaymentStatus, setPreviousPaymentStatus] = useState(null);
  const { payments, BillDetails,isLoading } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (isModalOpen) {
      dispatch(getAllPayments());
    }
  }, [isModalOpen, dispatch]);

  useEffect(() => {
    if (id && BillDetails?.data) {
      const billData = Array.isArray(BillDetails?.data) ? BillDetails.data.find((bill) => bill?._id === id) : null;

      if (billData) {
        const relatedPayments = payments?.data?.filter(payment => payment.billId === id);

        if (relatedPayments?.length > 0) {
          const lastPayment = relatedPayments[relatedPayments.length - 1];
          setInvoiceAmount(lastPayment.openAmount);
          setPreviousPaymentStatus(lastPayment.paymentStatus);
          form.setFieldsValue({
            invoiceAmount: lastPayment.openAmount,
          });
        } else {
          setInvoiceAmount(billData.totalBillAmount);
          setPreviousPaymentStatus(null);
          form.setFieldsValue({
            invoiceAmount: billData.totalBillAmount,
          });
        }
      }
    }
  }, [id, BillDetails, payments]);

  const showModal = () => {
    if (invoiceAmount !== null) {
      form.setFieldsValue({
        invoiceAmount,
        paymentDate: dayjs(), // Set current date
      });
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setLoading(true); // Start loading
    form.validateFields()
      .then((values) => {
        const currentInvoiceAmount = parseFloat(values.invoiceAmount) || 0;
        const paidAmount = parseFloat(values.paidAmount) || 0;
        const openAmount = currentInvoiceAmount - paidAmount;

        const paymentStatus = openAmount === 0 ? 'fullyPaid' : 'partiallyPaid';

        if (previousPaymentStatus === 'fullyPaid') {
          notification.error({
            message: 'Validation Error',
            description: 'Previous payment is already fully paid. Cannot create a new payment.',
            placement: 'topRight',
          });
          setLoading(false); // Stop loading
          return;
        }

        if (openAmount < 0) {
          form.setFields([
            {
              name: 'paidAmount',
              errors: ['Paid amount cannot exceed invoice amount.'],
            },
          ]);
          setLoading(false); // Stop loading
          return;
        }

        dispatch(createpayment({ ...values, billId: id, openAmount, paymentStatus }))
          .then(() => {
            notification.success({
              message: 'Payment Created',
              description: 'The payment has been created successfully.',
              placement: 'topRight',
            });
            setIsModalOpen(false);
            form.resetFields();
          })
          .catch((error) => {
            notification.error({
              message: 'Creation Failed',
              description: (
                <div>
                  Failed to create payment. Please try again later.
                  <div style={{ marginTop: 8 }}>
                    <Spin />
                  </div>
                </div>
              ),
              placement: 'topRight',
            });
            console.error('Payment Creation Error:', error);
          })
          .finally(() => {
            setLoading(false); // Stop loading
          });
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
        setLoading(false); // Stop loading if validation fails
      });
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form fields when closing modal
    setIsModalOpen(false);
  };

  const updateOpenAmountAndStatus = () => {
    const currentInvoiceAmount = parseFloat(form.getFieldValue('invoiceAmount')) || 0;
    const paidAmount = parseFloat(form.getFieldValue('paidAmount')) || 0;
    const openAmount = currentInvoiceAmount - paidAmount;

    form.setFieldsValue({ 
      openAmount,
      paymentStatus: openAmount === 0 ? 'fullyPaid' : 'partiallyPaid',
    });
  };

  return (
    <>
      <Button  
      // style={{
      //   border: '1px solid black', /* Blank border */
      //   color: 'black', /* Blank color text */
      //   backgroundColor: 'white', /* White background */
      //   // Optional: Add padding or other styling if needed
      //   padding: '8px 16px',
      // }}
      onClick={showModal}>
        Create Payment
      </Button>
      <Modal 
        title="Payment Details" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        loading={isLoading}
      >
        <Form form={form} layout="horizontal" initialValues={{
          invoiceAmount,
          paymentDate: dayjs(),
        }}>
          <Form.Item 
            name="paymentDate" 
            label="Payment Date" 
            rules={[{ required: true, message: 'Please select a payment date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item 
            name="invoiceAmount" 
            label="Invoice Amount" 
            rules={[{ required: true, message: 'Please enter the invoice amount' }]}
          >
            <Input 
              prefix="$" 
              value={invoiceAmount}
              placeholder="Invoice amount"
              disabled
            />
          </Form.Item>

          <Form.Item 
            name="paidAmount" 
            label="Paid Amount" 
            rules={[{ required: true, message: 'Please enter the paid amount' }]}
          >
            <Input 
              prefix="$" 
              placeholder="Enter paid amount" 
              onChange={updateOpenAmountAndStatus} 
            />
          </Form.Item>

          <Form.Item 
            name="openAmount" 
            label="Open Amount" 
          >
            <Input 
              prefix="$" 
              placeholder="Open amount" 
              readOnly 
              disabled
            />
          </Form.Item>

          <Form.Item 
            name="paymentStatus" 
            label="Payment Status" 
          >
            <Select disabled placeholder="Payment status">
              <Option value="fullyPaid">Fully Paid</Option>
              <Option value="partiallyPaid">Partially Paid</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PaymentModal;
