import { InvoiceEmailData } from "@/interfaces/utils-interfaces";

import { SendEmail } from "@/utils/send-email";

export const SendInvoiceReceiptToClient = async (
  invoiceData: InvoiceEmailData
): Promise<boolean> => {
  const subject = `Payment Receipt - Invoice #${invoiceData.invoiceNumber} | Code Aura`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Receipt - Code Aura</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333333;
          background-color: #f8f9fa;
        }
        
        .email-container {
          max-width: 650px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #4bf7ff 0%, #2cd4da 100%);
          color: #012b2d;
          padding: 30px 40px;
          text-align: center;
          position: relative;
        }
        
        .header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #00d1a0;
        }
        
        .logo {
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        
        .header-subtitle {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 500;
        }
        
        .success-badge {
          background: #00d1a0;
          color: white;
          padding: 8px 20px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 14px;
          margin: 20px auto 0;
          display: inline-block;
        }
        
        .content {
          padding: 40px;
        }
        
        .greeting {
          font-size: 18px;
          margin-bottom: 25px;
          color: #2c3e50;
        }
        
        .invoice-summary {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 25px;
          margin: 25px 0;
        }
        
        .summary-title {
          font-size: 20px;
          font-weight: bold;
          color: #1a202c;
          margin-bottom: 20px;
          text-align: center;
          border-bottom: 2px solid #4bf7ff;
          padding-bottom: 10px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }
        
        .info-item {
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .info-label {
          font-weight: 600;
          color: #4a5568;
          font-size: 14px;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .info-value {
          color: #1a202c;
          font-size: 16px;
          font-weight: 500;
        }
        
        .service-details {
          background: #f0fdf4;
          border-left: 4px solid #00d1a0;
          padding: 20px;
          margin: 25px 0;
          border-radius: 0 8px 8px 0;
        }
        
        .service-title {
          font-weight: bold;
          color: #065f46;
          font-size: 18px;
          margin-bottom: 10px;
        }
        
        .service-description {
          color: #047857;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        
        .total-amount {
          background: linear-gradient(135deg, #1f7fb0 0%, #18638c 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 25px 0;
        }
        
        .total-label {
          font-size: 16px;
          margin-bottom: 5px;
          opacity: 0.9;
        }
        
        .total-value {
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 1px;
        }
        
        .payment-status {
          text-align: center;
          margin: 25px 0;
          padding: 15px;
          background: #dcfce7;
          border-radius: 8px;
          border: 1px solid #bbf7d0;
        }
        
        .status-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        
        .status-text {
          color: #15803d;
          font-weight: bold;
          font-size: 18px;
        }
        
        .next-steps {
          background: #fefce8;
          border: 1px solid #facc15;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        }
        
        .next-steps-title {
          color: #a16207;
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .next-steps-text {
          color: #92400e;
          line-height: 1.6;
        }
        
        .contact-info {
          background: #f1f5f9;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
          text-align: center;
        }
        
        .contact-title {
          font-weight: bold;
          color: #334155;
          margin-bottom: 15px;
          font-size: 16px;
        }
        
        .contact-details {
          color: #64748b;
          line-height: 1.8;
        }
        
        .contact-details a {
          color: #1f7fb0;
          text-decoration: none;
          font-weight: 500;
        }
        
        .footer {
          background: #1a202c;
          color: #a0aec0;
          padding: 30px 40px;
          text-align: center;
          font-size: 14px;
          line-height: 1.8;
        }
        
        .footer-logo {
          color: #4bf7ff;
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 10px;
        }
        
        @media (max-width: 600px) {
          .content {
            padding: 20px;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          
          .total-value {
            font-size: 28px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">CODE AURA</div>
          <div class="header-subtitle">Professional Development Services</div>
          <div class="success-badge">✓ PAYMENT SUCCESSFUL</div>
        </div>
        
        <div class="content">
          <div class="greeting">
            Dear ${invoiceData.clientName},
          </div>
          
          <p>Thank you for your payment! We're excited to confirm that your payment has been successfully processed. Below are the details of your transaction:</p>
          
          <div class="invoice-summary">
            <div class="summary-title">Payment Receipt Details</div>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Invoice Number</div>
                <div class="info-value">#${invoiceData.invoiceNumber}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Client ID</div>
                <div class="info-value">${invoiceData.clientId}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Issue Date</div>
                <div class="info-value">${new Date(
                  invoiceData.createdAt
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Payment Date</div>
                <div class="info-value">${new Date(
                  invoiceData.paidAt || new Date()
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</div>
              </div>
            </div>
          </div>
          
          <div class="service-details">
            <div class="service-title">${invoiceData.serviceTitle}</div>
            <div class="service-description">${
              invoiceData.serviceDescription
            }</div>
          </div>
          
          <div class="total-amount">
            <div class="total-label">Total Amount Paid</div>
            <div class="total-value">$${invoiceData.totalAmount.toLocaleString()}</div>
          </div>
          
          <div class="payment-status">
            <div class="status-icon">✅</div>
            <div class="status-text">PAYMENT CONFIRMED</div>
            <div style="color: #059669; margin-top: 5px;">Your transaction has been completed successfully</div>
          </div>
          
          <div class="next-steps">
            <div class="next-steps-title">What happens next?</div>
            <div class="next-steps-text">
              Our team has been notified of your payment and will begin work on your project immediately. 
              You can expect to hear from us within 24-48 hours with project kickoff details and next steps. 
              This email serves as your official receipt for tax and record-keeping purposes.
            </div>
          </div>
          
          <div class="contact-info">
            <div class="contact-title">Need Help or Have Questions?</div>
            <div class="contact-details">
              Email: <a href="mailto:info@codeaura.us">info@codeaura.us</a><br>
              Website: <a href="https://codeaura.us">www.codeaura.us</a><br>
              We're here to help you every step of the way!
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-logo">CODE AURA</div>
          <div>© ${new Date().getFullYear()} Code Aura. All rights reserved.</div>
          <div>Professional Development Services | Trusted by businesses worldwide</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await SendEmail({
    to: invoiceData.clientEmailAddress,
    subject,
    html,
  });
};

export const SendInvoiceNotificationToAdmin = async (
  invoiceData: InvoiceEmailData
): Promise<boolean> => {
  const subject = `💰 Payment Received - Invoice #${
    invoiceData.invoiceNumber
  } - $${invoiceData.totalAmount.toLocaleString()}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Notification - Code Aura</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f8f9fa;
        }
        
        .email-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin: 20px;
        }
        
        .header {
          background: linear-gradient(135deg, #00d1a0 0%, #059669 100%);
          color: white;
          padding: 25px;
          text-align: center;
        }
        
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        
        .amount-highlight {
          background: rgba(255,255,255,0.2);
          padding: 10px 20px;
          border-radius: 25px;
          display: inline-block;
          margin-top: 10px;
          font-size: 20px;
          font-weight: bold;
        }
        
        .content {
          padding: 30px;
        }
        
        .client-info {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .info-label {
          font-weight: bold;
          color: #4a5568;
        }
        
        .info-value {
          color: #1a202c;
        }
        
        .service-details {
          background: #f0fdf4;
          border-left: 4px solid #00d1a0;
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        
        .actions {
          background: #fefce8;
          border: 1px solid #facc15;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .footer {
          background: #1a202c;
          color: #a0aec0;
          padding: 20px;
          text-align: center;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎉 Payment Received!</h1>
          <div class="amount-highlight">$${invoiceData.totalAmount.toLocaleString()}</div>
        </div>
        
        <div class="content">
          <p><strong>Great news!</strong> Payment has been successfully received for invoice #${
            invoiceData.invoiceNumber
          }.</p>
          
          <div class="client-info">
            <h3 style="margin-top: 0; color: #1a202c;">Client Information</h3>
            
            <div class="info-row">
              <span class="info-label">Client Name:</span>
              <span class="info-value">${invoiceData.clientName}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Client ID:</span>
              <span class="info-value">${invoiceData.clientId}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${invoiceData.clientEmailAddress}</span>
            </div>
            
            ${
              invoiceData.clientPhoneNumber
                ? `
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${invoiceData.clientPhoneNumber}</span>
            </div>
            `
                : ""
            }
            
            <div class="info-row">
              <span class="info-label">Invoice Number:</span>
              <span class="info-value">#${invoiceData.invoiceNumber}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Payment Date:</span>
              <span class="info-value">${new Date(
                invoiceData.paidAt || new Date()
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Total Amount:</span>
              <span class="info-value" style="font-weight: bold; color: #059669;">$${invoiceData.totalAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="service-details">
            <h3 style="margin-top: 0; color: #065f46;">Service Details</h3>
            <h4 style="color: #047857; margin-bottom: 10px;">${
              invoiceData.serviceTitle
            }</h4>
            <p style="color: #047857; margin: 0;">${
              invoiceData.serviceDescription
            }</p>
          </div>
          
          <div class="actions">
            <h3 style="margin-top: 0; color: #a16207;">Next Steps</h3>
            <ul style="color: #92400e; margin: 0;">
              <li>Client has been sent a receipt confirmation email</li>
              <li>Invoice status updated to PAID in the system</li>
              <li>Project can now be initiated according to service agreement</li>
              <li>Consider sending project kickoff communication within 24-48 hours</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <div style="color: #4bf7ff; font-weight: bold; margin-bottom: 5px;">CODE AURA</div>
          <div>Payment Management System | © ${new Date().getFullYear()}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await SendEmail({
    to: process.env.EMAIL_USER || "info@codeaura.us",
    subject,
    html,
  });
};
