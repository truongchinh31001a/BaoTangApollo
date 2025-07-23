import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail', // hoặc smtp khác như SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendResetPasswordEmail(to, token) {
    const baseUrl = process.env.BASE_URL
    const resetLink = `${baseUrl}/reset-password?token=${token}`; // Thay bằng domain thật

    await transporter.sendMail({
        from: `"Bao Tang Apollo" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Reset your password',
        html: `
      <p>Chào bạn,</p>
      <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu.</p>
      <p>Nhấn vào nút bên dưới để đặt lại:</p>
      <p><a href="${resetLink}" target="_blank" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none;">Đặt lại mật khẩu</a></p>
      <p>Link sẽ hết hạn sau 15 phút.</p>
    `
    });
}
