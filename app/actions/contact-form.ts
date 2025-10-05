'use server';

import { z } from 'zod';

const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Please enter a valid email'),
  phone: z.string().min(1, 'Phone number is required'),
  company: z.string().optional(),
  comments: z.string().min(1, 'Comments are required'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ContactFormResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Sanitize user input for plain text email to prevent injection attacks
function sanitizeForEmail(str: string): string {
  return str
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/[\r\n]+/g, ' ') // Replace line breaks with spaces to prevent header injection
    .trim();
}

// Escape HTML entities to prevent XSS in HTML emails
function escapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[<>&"']/g, (char) => htmlEntities[char] || char);
}

export async function submitContactForm(data: ContactFormData): Promise<ContactFormResult> {
  try {
    // Validate required environment variables
    if (!process.env.EMAIL_API_ENDPOINT || !process.env.EMAIL_API_KEY) {
      console.error('Email service not configured: Missing EMAIL_API_ENDPOINT or EMAIL_API_KEY');
      return {
        success: false,
        message: 'Email service is not configured. Please contact the administrator.',
      };
    }

    // Validate the form data
    const validatedData = contactFormSchema.parse(data);

    // Sanitize all user inputs
    const sanitizedFirstName = sanitizeForEmail(validatedData.firstName);
    const sanitizedLastName = sanitizeForEmail(validatedData.lastName);
    const sanitizedEmail = sanitizeForEmail(validatedData.email);
    const sanitizedPhone = sanitizeForEmail(validatedData.phone);
    const sanitizedCompany = validatedData.company ? sanitizeForEmail(validatedData.company) : '';
    const sanitizedComments = validatedData.comments.trim();

    // Build plain text email content
    const emailContent = `
New Contact Form Submission

Name: ${sanitizedFirstName} ${sanitizedLastName}
Email: ${sanitizedEmail}
Phone: ${sanitizedPhone}
${sanitizedCompany ? `Company: ${sanitizedCompany}` : ''}

Comments:
${sanitizedComments}
    `.trim();

    // Build HTML email content with proper escaping
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(sanitizedFirstName)} ${escapeHtml(sanitizedLastName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(sanitizedEmail)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(sanitizedPhone)}</p>
      ${sanitizedCompany ? `<p><strong>Company:</strong> ${escapeHtml(sanitizedCompany)}</p>` : ''}
      <p><strong>Comments:</strong></p>
      <p>${escapeHtml(sanitizedComments).replace(/\n/g, '<br>')}</p>
    `.trim();

    // Send email via API endpoint
    const response = await fetch(process.env.EMAIL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'noreply@codecatdevs.com',
        to: process.env.EMAIL_TO || 'contact@codecatdevs.com',
        subject: `New Contact Form Submission from ${sanitizedFirstName} ${sanitizedLastName}`,
        text: emailContent,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Email API error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to send email: ${response.status}`);
    }

    return {
      success: true,
      message: 'Thank you for contacting us! We\'ll get back to you soon.',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((err:any) => {
        const path = err.path[0];
        if (path && typeof path === 'string') {
          errors[path] = [err.message];
        }
      });
      return {
        success: false,
        message: 'Please check your form for errors.',
        errors,
      };
    }

    console.error('Contact form submission error:', error);
    return {
      success: false,
      message: 'An error occurred while submitting your form. Please try again later.',
    };
  }
}