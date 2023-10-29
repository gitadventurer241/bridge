import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import BridgeLogo from "../../../media/bridge-logo.png";
import BridgeImage from "../../../media/four-hands-meeting.jpg";

import styling from "./Login.module.css";

import configureAxios from "./../../../config";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import SpinnerLogin from "../../UI/spinner/LoginSpinner";
import { GoogleButton } from "../../UI/oauth/GoogleButton";

const axios = configureAxios();

const Login = () => {
  // state
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const onClickLogin = (values: any) => {
    setIsLoading(true);
    // Send login data to the backend (you'll need to replace the URL and method)
    setTimeout(() => {
      axios
        .post(`/api/login`, formData, {
          withCredentials: true,
        })
        .then((response) => {
          // Handle the backend response here
          const { user } = response.data;
          if (response.status === 200) {
            toast.success("Login Success");
            // Set auth, user_type in local storage
            localStorage.setItem("user_type", user.user_type);
            localStorage.setItem("auth", JSON.stringify({ user: user }));
            setIsLoading(false);
            // Navigate to the dashboard
            navigate("/");
          }
          setIsLoading(false);
        })
        .catch((error) => {
          // Handle any errors here
          if (error.response) {
            const { response } = error;
            if (response.status === 401) {
              toast.error("Invalid email or password");
              setIsLoading(false);
            } else if (response.status === 403) {
              toast.error("Invalid email");
              setIsLoading(false);
            } else if (response.status === 417) {
              toast.error("Login unsuccessful");
              setIsLoading(false);
            } else if (response.status === 400) {
              toast.error("Email and password are required");
              setIsLoading(false);
            } else {
              toast.error("Internal Server Error");
              console.error("HTTP Status Code:", error.response.status);
              console.error("Response Data:", error.response.data);
              setIsLoading(false);
            }
          }
        });
    }, 2000);
  };

  return (
    <div className={styling.container}>
      <div className={styling.loginContainer}>
        <div className={styling.loginBox}>
          <img src={BridgeLogo} alt="Bridge Logo" className={styling.logo} />
          <h1>Login</h1>
          <ToastContainer theme="light" />
          <Form
            name="normal_login"
            className={styling.loginForm}
            initialValues={{ remember: true }}
            onFinish={onClickLogin}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<UserOutlined className={styling.icon} />}
                type="text"
                name="email"
                value={formData.email}
                placeholder="email"
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className={styling.icon} />}
                name="password"
                value={formData.password}
                placeholder="Password"
                iconRender={(visible) =>
                  visible ? <IconEyeOff size={20} /> : <IconEye size={20} />
                }
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className={styling.forgotButton} href="/*">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={styling.loginButton}
              >
                {isLoading ? <SpinnerLogin /> : "Log in"}
              </Button>
            </Form.Item>
            {/* OAuth */}
            <div className={styling.oauth}>
              <hr className={styling.horizontalLine} />
              <p>or login with</p>
              <GoogleButton text={"signin_with"} isDisabled={true} />
            </div>
          </Form>
        </div>

        <div className={styling.containerTwo}>
          {/* background image */}
          <div
            className={styling.containerTwoImage}
            style={{ backgroundImage: `url(${BridgeImage})` }}
          ></div>
          <div className={styling.containerTwoText}>
            <h1 className={styling.slogan}>
              Empowering Diversity in Swiss Tech
            </h1>
            <p className={styling.sloganP}>
              Let's get connected. Let's get hired. Let's get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
