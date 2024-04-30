import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from secret import sender_email, sender_password

# Email credentials
receiver_email = "talktoanmol@outlook.com"

# Constructing the email message
message = MIMEMultipart()
message["From"] = sender_email
message["To"] = receiver_email
message["Subject"] = "Test Email from Python"

body = "Hello, this is a test email sent from Python."
message.attach(MIMEText(body, "plain"))

# Establishing a connection with the SMTP server
with smtplib.SMTP("smtp.gmail.com", 587) as server:
    server.starttls()  # Start TLS encryption
    server.login(sender_email, sender_password)
    text = message.as_string()
    server.sendmail(sender_email, receiver_email, text)
    print("Email sent successfully!")
