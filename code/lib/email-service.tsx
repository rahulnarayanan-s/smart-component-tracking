export async function sendEmailNotification(
  to: string,
  type: "request" | "approved" | "rejected" | "returned",
  data: {
    studentName?: string
    studentEmail?: string
    componentName?: string
    quantity?: number
    reason?: string
    mentorName?: string
  },
) {
  const emailTemplates: Record<string, { subject: string; html: (data: typeof data) => string }> = {
    request: {
      subject: "New Component Request Received",
      html: (data) => `
        <h2>New Component Request</h2>
        <p>A new component request has been submitted:</p>
        <ul>
          <li><strong>Student:</strong> ${data.studentName}</li>
          <li><strong>Component:</strong> ${data.componentName}</li>
          <li><strong>Quantity:</strong> ${data.quantity}</li>
          <li><strong>Reason:</strong> ${data.reason}</li>
        </ul>
        <p>Please review and approve or reject the request in the dashboard.</p>
      `,
    },
    approved: {
      subject: "Your Component Request Has Been Approved",
      html: (data) => `
        <h2>Request Approved</h2>
        <p>Great news! Your component request has been approved by ${data.mentorName}.</p>
        <ul>
          <li><strong>Component:</strong> ${data.componentName}</li>
          <li><strong>Quantity:</strong> ${data.quantity}</li>
        </ul>
        <p>Please pick up your component from the lab.</p>
      `,
    },
    rejected: {
      subject: "Your Component Request Has Been Rejected",
      html: (data) => `
        <h2>Request Rejected</h2>
        <p>Unfortunately, your component request has been rejected by ${data.mentorName}.</p>
        <ul>
          <li><strong>Component:</strong> ${data.componentName}</li>
          <li><strong>Quantity:</strong> ${data.quantity}</li>
        </ul>
        <p>Please contact the mentor for more information.</p>
      `,
    },
    returned: {
      subject: "Component Return Confirmation",
      html: (data) => `
        <h2>Component Return Confirmed</h2>
        <p>Your component has been marked as returned:</p>
        <ul>
          <li><strong>Component:</strong> ${data.componentName}</li>
          <li><strong>Quantity:</strong> ${data.quantity}</li>
        </ul>
        <p>Thank you for returning the component on time.</p>
      `,
    },
  }

  const template = emailTemplates[type]
  if (!template) {
    throw new Error(`Unknown email type: ${type}`)
  }

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject: template.subject,
        html: template.html(data),
        type,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send email")
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}
