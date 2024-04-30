import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from secret import sender_email, sender_password


def send_graded_mail(to_email, uid):
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = to_email
    message["Subject"] = "Assignment Graded!"

    body = f"""Your assignment has been graded successfully! Check out your
    submission at http://localhost:5173/view/submission?uid={uid}"""
    message.attach(MIMEText(body, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()  # Start TLS encryption
        server.login(sender_email, sender_password)
        text = message.as_string()
        server.sendmail(sender_email, to_email, text)
        print("Email sent successfully!")


if __name__ == "__main__":
    send_graded_mail("talktoanmol@outlook.com", "uiadsa")
