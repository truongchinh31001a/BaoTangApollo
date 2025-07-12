// "use client";

// import '@ant-design/v5-patch-for-react-19';
// import { useState } from "react";
// import { Form, Input, Button, DatePicker, Select } from "antd";
// import { toast } from "react-toastify";
// import dayjs from "dayjs";

// export function RegisterForm({ switchToLogin }) {
//   const [loading, setLoading] = useState(false);

//   const onFinish = async (values) => {
//     setLoading(true);
//     const { name, email, password, dateOfBirth, gender } = values;

//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//           gender,
//           dateOfBirth: dateOfBirth.format("YYYY-MM-DD"),
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Đăng ký thất bại!");

//       toast.success("🎉 Đăng ký thành công! Đang chuyển sang đăng nhập...");

//       // Chuyển về tab đăng nhập sau 2 giây
//       setTimeout(() => {
//         switchToLogin();
//       }, 2000);
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <Form layout="vertical" onFinish={onFinish}>
//         <Form.Item
//           label="Họ và Tên"
//           name="name"
//           rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
//         >
//           <Input placeholder="Nguyễn Văn A" />
//         </Form.Item>

//         <Form.Item
//           label="Email"
//           name="email"
//           rules={[
//             { required: true, message: "Vui lòng nhập email!" },
//             { type: "email", message: "Email không hợp lệ!" },
//           ]}
//         >
//           <Input type="email" placeholder="example@gmail.com" />
//         </Form.Item>

//         <Form.Item
//           label="Ngày sinh"
//           name="dateOfBirth"
//           rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
//         >
//           <DatePicker
//             format="DD/MM/YYYY"
//             className="w-full"
//             disabledDate={(current) => current && current > dayjs().endOf("day")}
//           />
//         </Form.Item>

//         <Form.Item
//           label="Giới tính"
//           name="gender"
//           rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
//         >
//           <Select placeholder="Chọn giới tính">
//             <Select.Option value="male">Nam</Select.Option>
//             <Select.Option value="female">Nữ</Select.Option>
//             <Select.Option value="other">Khác</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item
//           label="Mật khẩu"
//           name="password"
//           rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }, { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }]}
//         >
//           <Input.Password placeholder="********" />
//         </Form.Item>

//         <Form.Item
//           label="Xác nhận mật khẩu"
//           name="confirmPassword"
//           dependencies={["password"]}
//           hasFeedback
//           rules={[
//             { required: true, message: "Vui lòng nhập lại mật khẩu!" },
//             ({ getFieldValue }) => ({
//               validator(_, value) {
//                 if (!value || getFieldValue("password") === value) {
//                   return Promise.resolve();
//                 }
//                 return Promise.reject(new Error("Mật khẩu không khớp!"));
//               },
//             }),
//           ]}
//         >
//           <Input.Password placeholder="********" />
//         </Form.Item>

//         <Button type="primary" htmlType="submit" loading={loading} block>
//           Đăng ký
//         </Button>
//       </Form>
//     </div>
//   );
// }
