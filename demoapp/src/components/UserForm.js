import React, { useEffect, useState } from 'react';
import { Tabs, Form, Input, DatePicker, Button, Row, Col, Select } from 'antd';
import './Userform.css'; // Import your custom CSS file
import { useDispatch } from 'react-redux';
import { savePateint } from '../api/api';
import { Option } from 'antd/es/mentions';

const { TabPane } = Tabs;

const MyForm = () => {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      // Dispatch the async action to save patient data
      await dispatch(savePateint(values));
      console.log('Form values submitted:', values);
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

useEffect(() => {


}, []);
  return (
    <Form className="patint-form" layout="vertical" onFinish={onFinish}>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="Registration Date" name="Ragistration_Date">
            <DatePicker className="custom-input" />
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
            <DatePicker className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
        <Form.Item label="Marital Status" name="Matertal_Status">
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
          <Form.Item label="Occupation" name="Occopation">
            <Input className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Aadhar Card Number" name="AdharCard_Number">
            <Input  className="custom-input" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="PAN Card Number" name="PadCard_Number">
            <Input  className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Self Annual Income" name="Self_Annual_Income">
            <Input  className="custom-input" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Family Annual Income" name="Familty_Annual_Income">
            <Input  className="custom-input" />
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
    <MyForm onFinish={(values) => console.log('Tab 1 Form:', values)} />
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
