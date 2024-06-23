import React, { useEffect, useState } from 'react';
import { Tabs, Form, Input, DatePicker, Button, Row, Col, Select } from 'antd';
import './Userform.css'; // Import your custom CSS file
import { useDispatch, useSelector } from 'react-redux';
import { getAllPateints, savePateint, updatePateint } from '../api/api'; // Import the updatePatient action
import { Option } from 'antd/es/mentions';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const { TabPane } = Tabs;

const MyForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { allPateint } = useSelector((state) => state.products);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const history = useHistory();
  useEffect(() => {
    dispatch(getAllPateints());
  }, [dispatch]);

  useEffect(() => {
    if (allPateint && allPateint.data && id) {
      const patientData = allPateint.data.find((patient) => patient._id === id);
      if (patientData) {
        setIsEditing(true);
        form.setFieldsValue({
          Ragistration_Date: patientData.Ragistration_Date ? moment(patientData.Ragistration_Date) : null,
          First_Name: patientData.First_Name || '',
          Middle_Name: patientData.Middle_Name || '',
          Last_Name: patientData.Last_Name || '',
          Date_of_Birth: patientData.Date_of_Birth ? moment(patientData.Date_of_Birth) : null,
          Marital_Status: patientData.Marital_Status || 'Married',
          Age: patientData.Age || '',
          Year: patientData.Year || '',
          Gender: patientData.Gender || 'Male',
          Nationality: patientData.Nationality || '',
          Religion: patientData.Religion || '',
          Contact_Number: patientData.Contact_Number || '',
          Permanent_address: patientData.Permanent_address || '',
          Occupation: patientData.Occupation || '',
          AdharCard_Number: patientData.AdharCard_Number || '',
          PadCard_Number: patientData.PadCard_Number || '',
          Self_Annual_Income: patientData.Self_Annual_Income || '',
          Familty_Annual_Income: patientData.Familty_Annual_Income || '',
        });
      }
    }
  }, [id, allPateint, form]);

  const onFinish = async (values) => {
    try {
      if (isEditing) {
        await dispatch(updatePateint({history,values})); // Call updatePatient if editing
        console.log('Patient updated:',values);
    
      } else {
        await dispatch(savePateint({history,values}));
        console.log('Patient saved:', values);
      }
    } catch (error) {
      console.error('Error saving/updating patient:', error);
    }
  };

  return (
    <Form className="patient-form" layout="vertical" form={form} onFinish={onFinish}>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="Registration Date" name="Ragistration_Date">
            <DatePicker style={{ width: "-webkit-fill-available" }} className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="First Name" name="First_Name">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Middle Name" name="Middle_Name">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="Last Name" name="Last_Name">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Date of Birth" name="Date_of_Birth">
            <DatePicker style={{ width: "-webkit-fill-available" }} className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Marital Status" name="Marital_Status">
            <Select className="custom-input">
              <Option value="Married">Married</Option>
              <Option value="Unmarried">Unmarried</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="Age" name="Age">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Year" name="Year">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Gender" name="Gender">
            <Select className="custom-input">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="Nationality" name="Nationality">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Religion" name="Religion">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Contact Number" name="Contact_Number">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="Permanent Address" name="Permanent_address">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Occupation" name="Occupation">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item  label="Aadhar Card Number" name="AdharCard_Number">
            <Input disabled={isEditing?true:false} className="custom-input" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="PAN Card Number" name="PadCard_Number">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Self Annual Income" name="Self_Annual_Income">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Family Annual Income" name="Familty_Annual_Income">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

const Tab1 = () => (
  <div>
    <h3>Patient Information</h3>
    <MyForm />
  </div>
);

const Tab2 = () => (
  <div>
    <h3>Tab 2 Content</h3>
    {/* Add Tab 2 specific content */}
  </div>
);

const Tab3 = () => (
  <div>
    <h3>Tab 3 Content</h3>
    {/* Add Tab 3 specific content */}
  </div>
);

const UserForm = () => {
  const [activeTab, setActiveTab] = useState('1');

  return (
    <div className="tab-container">
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} centered>
        <TabPane tab="Patient Information" key="1">
          <Tab1 />
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          <Tab2 />
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          <Tab3 />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserForm;
