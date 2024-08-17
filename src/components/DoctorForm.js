import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Button, Row, Col, Select, message, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
// import { saveDoctor, updateDoctor, getAllDoctors } from "../api/api"; // Import actions
import { Option } from "antd/es/mentions";
import moment from "moment";
import { useParams, useHistory } from "react-router-dom";
import { getAllDoctors, saveDoctor, updateDoctor } from "../api/api";

const DoctorForm = () => {
  const { id } = useParams();
  console.log(id);
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
const { allDoctors, isLoading } = useSelector( (state) => state.products);
// const [loading,setLoading] = useState(isLoading)




  useEffect(() => {
     dispatch(getAllDoctors());
     dispatch(updateDoctor())
  }, [dispatch]);



  useEffect(() => {
    if (allDoctors && allDoctors.data && id) {
      const doctorData = allDoctors?.data?.find((doctor) => doctor._id === id);
      if (doctorData) {
        setIsEditing(true);
        form.setFieldsValue({
          Registration_Date: doctorData.Registration_Date
            ? moment(doctorData.Registration_Date)
            : null,
          First_Name: doctorData.First_Name || "",
          Last_Name: doctorData.Last_Name || "",
          Date_of_Birth: doctorData.Date_of_Birth
            ? moment(doctorData.Date_of_Birth)
            : null,
          Specialization: doctorData.Specialization || "",
          Email: doctorData.Email || "",
          Contact_Number: doctorData.Contact_Number || "",
          Qualification: doctorData.Qualification || "",
          Experience: doctorData.Experience || "",
          Address: doctorData.Address || "",
          License_Number: doctorData.License_Number || "",
        });
      }
    }
  }, [id, allDoctors, form]);

  const onFinish = async (values) => {
    console.log("Form data:", {values,id});

    try {
      if (isEditing) {

        await dispatch(updateDoctor({ id, doctorData: values }));
        message.success("Doctor updated successfully");

      } else {
        await dispatch(saveDoctor( {values} ));
        message.success("Doctor added successfully");
      }
    } catch (error) {
      // console.error("Error saving/updating doctor:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(8px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Spin size="large" />
          <p style={{ marginLeft: "20px" }}>Loading...</p>
        </div>
      ) : (
        ""
      )}

      <Form
        className="doctor-form"
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="Registration Date"
              name="Registration_Date"
              rules={[{ required: true, message: 'Registration Date is required' }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                className="custom-input"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="First Name"
              name="First_Name"
              rules={[{ required: true, message: 'First Name is required' }]}
            >
              <Input className="custom-input" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Last Name" name="Last_Name">
              <Input className="custom-input" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="Date of Birth"
              name="Date_of_Birth"
              rules={[{ required: true, message: 'Date of Birth is required' }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                className="custom-input"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Specialization"
              name="Specialization"
              rules={[{ required: true, message: 'Specialization is required' }]}
            >
              <Input className="custom-input" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Email" name="Email">
              <Input className="custom-input" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="Contact Number"
              name="Contact_Number"
              rules={[{ required: true, message: 'Contact Number is required' }]}
            >
              <Input className="custom-input" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Qualification" name="Qualification">
              <Input className="custom-input" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Experience" name="Experience">
              <Input className="custom-input" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="Address"
              name="Address"
              rules={[{ required: true, message: 'Address is required' }]}
            >
              <Input className="custom-input" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="License Number" name="License_Number">
              <Input className="custom-input" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditing ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DoctorForm;
