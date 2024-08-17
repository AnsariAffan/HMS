import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Popconfirm, FloatButton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPayments, deletePayment } from '../api/api';
import PaymentModal from './PaymentModal';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CustomerServiceOutlined, CommentOutlined
 } from '@ant-design/icons';

const PaymentTable = ({ billingId }) => {
  const { id: urlId } = useParams();
  const id = billingId || urlId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const dispatch = useDispatch();
  const { payments } = useSelector((state) => state.products);

  useEffect(() => {
    if (isModalOpen) {
      dispatch(getAllPayments());
    }
  }, [isModalOpen, dispatch]);

  const showModal = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    dispatch(deletePayment(record._id));
    dispatch(getAllPayments());
  };

  const filteredPayments = payments.data?.filter(payment => payment.billId === id) || [];

  const columns = [
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: text => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Invoice Amount',
      dataIndex: 'invoiceAmount',
      key: 'invoiceAmount',
      render: text => `$${text}`,
    },
    {
      title: 'Paid Amount',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: text => `$${text}`,
    },
    {
      title: 'Open Amount',
      dataIndex: 'openAmount',
      key: 'openAmount',
      render: text => `$${text}`,
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: text => text === 'fullyPaid' ? 'Fully Paid' : 'Partially Paid',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
         
          <Popconfirm
            title="Are you sure to delete this payment?"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns.map(col => col.title)],
      body: filteredPayments.map(payment => [
        new Date(payment.paymentDate).toLocaleDateString(),
        `$${payment.invoiceAmount}`,
        `$${payment.paidAmount}`,
        `$${payment.openAmount}`,
        payment.paymentStatus === 'fullyPaid' ? 'Fully Paid' : 'Partially Paid',
      ]),
    });
    doc.save('payments-report.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredPayments.map(payment => ({
      'Payment Date': new Date(payment.paymentDate).toLocaleDateString(),
      'Invoice Amount': `$${payment.invoiceAmount}`,
      'Paid Amount': `$${payment.paidAmount}`,
      'Open Amount': `$${payment.openAmount}`,
      'Payment Status': payment.paymentStatus === 'fullyPaid' ? 'Fully Paid' : 'Partially Paid',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'payments-report.xlsx');
  };

  return (
    <>
      <Button onClick={showModal} style={{ marginRight: 8 }}>
        View Payments
      </Button>
      <Modal
        title="Payments Table"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
      
        <Table
          dataSource={filteredPayments}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      
     
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{
          insetInlineEnd: 94,
        }}
      
      >
        <FloatButton onClick={exportToPDF}/>
        <FloatButton onClick={exportToExcel} icon={<CommentOutlined />} />
      </FloatButton.Group>

      </Modal>
      {selectedRecord && (
        
        <PaymentModal
          record={selectedRecord}
          visible={isModalOpen}
          onCancel={handleCancel}
          
        />
        
   
      )}
    </>
  );
};

export default PaymentTable;
