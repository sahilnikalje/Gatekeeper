const EMAIL_VERIFY_TEMPLATE=
`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Verify Your Account</title>
<style>
body{
  margin:0;
  padding:0;
  background:linear-gradient(135deg,#1e3a8a,#312e81);
  font-family:'Segoe UI',sans-serif;
}
.wrapper{
  max-width:600px;
  margin:40px auto;
  background:#ffffff;
  border-radius:20px;
  padding:40px;
  text-align:center;
  box-shadow:0 20px 50px rgba(0,0,0,0.3);
}
.logo{
  font-size:28px;
  font-weight:800;
  color:#4f46e5;
}
.nav{
  margin-top:10px;
}
.nav a{
  margin:0 12px;
  font-size:14px;
  color:#6b7280;
  text-decoration:none;
}
.otp{
  font-size:36px;
  letter-spacing:10px;
  font-weight:700;
  margin:30px 0;
  color:#4f46e5;
}
.footer{
  margin-top:40px;
  font-size:12px;
  color:#9ca3af;
}
</style>
</head>

<body>
<div class="wrapper">

  <div class="logo">
      <img src='cid:logo123' width='140' alt='Gatekeeper Logo'/>
  </div>

  <div class="nav">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>

  <h2 style="margin-top:30px;">Account Verification</h2>

  <p>Hello,</p>

  <p>Your registered email is:</p>
  <p><strong>{{email}}</strong></p>

  <p>Use the OTP below to verify your account:</p>

  <div class="otp">{{otp}}</div>

  <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>

  <div class="footer">
    © 2026 Gatekeeper · Secure Authentication System
  </div>

</div>
</body>
</html>
`

const PASSWORD_RESET_TEMPLATE =
`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Password Reset</title>
<style>
body{
  margin:0;
  padding:0;
  background:linear-gradient(135deg,#1e3a8a,#312e81);
  font-family:'Segoe UI',sans-serif;
}
.wrapper{
  max-width:600px;
  margin:40px auto;
  background:#ffffff;
  border-radius:20px;
  padding:40px;
  text-align:center;
  box-shadow:0 20px 50px rgba(0,0,0,0.3);
}
.logo{
  font-size:28px;
  font-weight:800;
  color:#9333ea;
}
.nav{
  margin-top:10px;
}
.nav a{
  margin:0 12px;
  font-size:14px;
  color:#6b7280;
  text-decoration:none;
}
.otp{
  font-size:36px;
  letter-spacing:10px;
  font-weight:700;
  margin:30px 0;
  color:#9333ea;
}
.footer{
  margin-top:40px;
  font-size:12px;
  color:#9ca3af;
}
</style>
</head>

<body>
<div class="wrapper">

  <div class="logo">
      <img src='cid:logo123' width='140' alt='Gatekeeper Logo'/>
  </div>


  <div class="nav">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>

  <h2 style="margin-top:30px;">Password Reset Request</h2>

  <p>The password reset request was made for:</p>
  <p><strong>{{email}}</strong></p>

  <p>Use the OTP below to reset your password:</p>

  <div class="otp">{{otp}}</div>

  <p>This OTP will expire in 5 minutes.</p>

  <div class="footer">
    If you did not request this, please ignore this email.<br/>
    © 2026 Gatekeeper
  </div>

</div>
</body>
</html>
`


const WELCOME_EMAIL_TEMPLATE=
`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Welcome to Gatekeeper</title>
<style>
body{
  margin:0;
  padding:0;
  background:linear-gradient(135deg,#1e3a8a,#312e81);
  font-family:'Segoe UI',sans-serif;
}
.wrapper{
  max-width:600px;
  margin:40px auto;
  background:#ffffff;
  border-radius:20px;
  padding:40px;
  text-align:center;
  box-shadow:0 20px 50px rgba(0,0,0,0.3);
}
.logo{
  font-size:28px;
  font-weight:800;
  color:#4f46e5;
}
.nav{
  margin-top:10px;
}
.nav a{
  margin:0 12px;
  font-size:14px;
  color:#6b7280;
  text-decoration:none;
}
.btn{
  display:inline-block;
  margin-top:30px;
  padding:14px 32px;
  background:linear-gradient(90deg,#4f46e5,#9333ea);
  color:#ffffff;
  border-radius:10px;
  text-decoration:none;
  font-weight:600;
}
.footer{
  margin-top:40px;
  font-size:12px;
  color:#9ca3af;
}
</style>
</head>

<body>
<div class="wrapper">

  <div class="logo">
      <img src='cid:logo123' width='140' alt='Gatekeeper Logo'/>
  </div>


  <div class="nav">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>

  <h2 style="margin-top:30px;">Welcome to Gatekeeper 🚀</h2>

  <p>Your account has been successfully created with:</p>

  <p><strong>{{email}}</strong></p>

  <p>You are now part of our secure authentication system.</p>

  <a href="#" class="btn">Go to Dashboard</a>

  <div class="footer">
    © 2026 Gatekeeper · Secure Authentication Platform
  </div>

</div>
</body>
</html>
`


module.exports={EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE, WELCOME_EMAIL_TEMPLATE}