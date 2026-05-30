const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'owner@cp.com';

function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
}

async function sendMail({ subject, html }) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[EMAIL - not configured] To: ${ADMIN_EMAIL} | Subject: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `CarPartner <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    console.error('[EMAIL ERROR]', err.message);
  }
}

const baseStyle = `
  font-family: Arial, sans-serif; max-width: 600px; margin: auto;
  background: #0f172a; color: #e2e8f0; border-radius: 12px; overflow: hidden;
`;
const headerStyle = `
  background: linear-gradient(135deg, #f59e0b, #d97706);
  padding: 24px 32px; color: #0f172a;
`;
const bodyStyle = `padding: 28px 32px;`;
const rowStyle = `
  background: #1e293b; border-radius: 8px; padding: 12px 16px;
  margin-bottom: 8px; font-size: 14px;
`;
const labelStyle = `color: #94a3b8; font-size: 12px; margin-bottom: 2px;`;
const valueStyle = `color: #f8fafc; font-weight: 600;`;
const footerStyle = `
  border-top: 1px solid #1e293b; padding: 16px 32px;
  font-size: 12px; color: #64748b; text-align: center;
`;

function row(label, value) {
  return `<div style="${rowStyle}">
    <div style="${labelStyle}">${label}</div>
    <div style="${valueStyle}">${value || '—'}</div>
  </div>`;
}

exports.notifyNewInquiry = async ({ inquiry, vehicleTitle, vehicleType, ownerName, ownerPhone, ownerEmail }) => {
  await sendMail({
    subject: `🔔 New Inquiry — ${vehicleTitle}`,
    html: `<div style="${baseStyle}">
      <div style="${headerStyle}">
        <h2 style="margin:0;font-size:20px;">New Vehicle Inquiry</h2>
        <p style="margin:4px 0 0;font-size:13px;opacity:0.8;">Someone is interested in one of your listed vehicles</p>
      </div>
      <div style="${bodyStyle}">
        <p style="color:#94a3b8;font-size:13px;margin-bottom:16px;">
          A new inquiry has been submitted. Review the contact details below and arrange the rental.
        </p>

        <h3 style="color:#f59e0b;font-size:14px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Vehicle</h3>
        ${row('Title', vehicleTitle)}
        ${row('Type', vehicleType)}

        <h3 style="color:#60a5fa;font-size:14px;margin:16px 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Person Who Wants Vehicle</h3>
        ${row('Name', inquiry.seekerName)}
        ${row('Phone / WhatsApp', `<a href="tel:${inquiry.seekerPhone}" style="color:#f59e0b;">${inquiry.seekerPhone}</a>`)}
        ${row('Email', `<a href="mailto:${inquiry.seekerEmail}" style="color:#f59e0b;">${inquiry.seekerEmail}</a>`)}
        ${row('Rental Type', inquiry.rentalType)}
        ${inquiry.purpose ? row('Purpose', inquiry.purpose) : ''}
        ${inquiry.message ? row('Message', inquiry.message) : ''}

        <h3 style="color:#f59e0b;font-size:14px;margin:16px 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Vehicle Owner to Contact</h3>
        ${row('Name', ownerName)}
        ${row('Phone', `<a href="tel:${ownerPhone}" style="color:#f59e0b;">${ownerPhone || 'Not provided'}</a>`)}
        ${row('Email', `<a href="mailto:${ownerEmail}" style="color:#f59e0b;">${ownerEmail}</a>`)}
      </div>
      <div style="${footerStyle}">CarPartner Admin Panel · Log in to update inquiry status</div>
    </div>`,
  });
};

exports.notifyNewRequest = async ({ request }) => {
  await sendMail({
    subject: `🚛 New Vehicle Request — ${request.vehicleType}`,
    html: `<div style="${baseStyle}">
      <div style="${headerStyle}">
        <h2 style="margin:0;font-size:20px;">New Vehicle Request</h2>
        <p style="margin:4px 0 0;font-size:13px;opacity:0.8;">Someone needs a vehicle that isn't listed yet</p>
      </div>
      <div style="${bodyStyle}">
        <p style="color:#94a3b8;font-size:13px;margin-bottom:16px;">
          Source this vehicle from your network and contact the person below.
        </p>

        <h3 style="color:#60a5fa;font-size:14px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Requestor</h3>
        ${row('Name', request.seekerName)}
        ${row('Phone / WhatsApp', `<a href="tel:${request.seekerPhone}" style="color:#f59e0b;">${request.seekerPhone}</a>`)}
        ${row('Email', `<a href="mailto:${request.seekerEmail}" style="color:#f59e0b;">${request.seekerEmail}</a>`)}

        <h3 style="color:#f59e0b;font-size:14px;margin:16px 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Vehicle Needed</h3>
        ${row('Type', request.vehicleType)}
        ${row('Purpose', request.purpose)}
        ${row('Rental Type', request.rentalType)}
        ${row('Quantity', request.quantity)}
        ${request.location ? row('Location', request.location) : ''}
        ${request.budget ? row('Budget', `₹${Number(request.budget).toLocaleString('en-IN')}`) : ''}
        ${request.startDate ? row('Start Date', new Date(request.startDate).toLocaleDateString('en-IN')) : ''}
        ${request.endDate ? row('End Date', new Date(request.endDate).toLocaleDateString('en-IN')) : ''}
        ${request.additionalDetails ? row('Additional Details', request.additionalDetails) : ''}
      </div>
      <div style="${footerStyle}">CarPartner Admin Panel · Log in to update request status</div>
    </div>`,
  });
};

exports.notifyNewVehicle = async ({ vehicle, ownerName, ownerPhone, ownerEmail }) => {
  await sendMail({
    subject: `🚗 New Vehicle Listed — ${vehicle.title}`,
    html: `<div style="${baseStyle}">
      <div style="${headerStyle}">
        <h2 style="margin:0;font-size:20px;">New Vehicle Awaiting Approval</h2>
        <p style="margin:4px 0 0;font-size:13px;opacity:0.8;">A vehicle owner has listed a new vehicle</p>
      </div>
      <div style="${bodyStyle}">
        <p style="color:#94a3b8;font-size:13px;margin-bottom:16px;">
          Review the listing details and approve or reject from the admin panel.
        </p>

        <h3 style="color:#f59e0b;font-size:14px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Vehicle Details</h3>
        ${row('Title', vehicle.title)}
        ${row('Type', vehicle.type)}
        ${row('Location', vehicle.location)}
        ${vehicle.make ? row('Make', vehicle.make) : ''}
        ${vehicle.model ? row('Model', vehicle.model) : ''}
        ${vehicle.year ? row('Year', vehicle.year) : ''}
        ${vehicle.capacity ? row('Capacity', vehicle.capacity) : ''}

        <h3 style="color:#60a5fa;font-size:14px;margin:16px 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Owner</h3>
        ${row('Name', ownerName)}
        ${row('Phone', `<a href="tel:${ownerPhone}" style="color:#f59e0b;">${ownerPhone || 'Not provided'}</a>`)}
        ${row('Email', `<a href="mailto:${ownerEmail}" style="color:#f59e0b;">${ownerEmail}</a>`)}
      </div>
      <div style="${footerStyle}">CarPartner Admin Panel · Log in to approve or reject this vehicle</div>
    </div>`,
  });
};
