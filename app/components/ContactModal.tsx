
'use client';

import { Dialog, Button, TextField, TextArea, Flex, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { submitContactForm, type ContactFormData } from '@/app/actions/contact-form';

interface ContactModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ContactModal = ({ trigger, open, onOpenChange }: ContactModalProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    comments: ''
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    // Clear submit message when user starts typing
    if (submitMessage) {
      setSubmitMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrors({});
    setSubmitMessage(null);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message });

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          comments: ''
        });

        // Close modal after 2 seconds
        setTimeout(() => {
          onOpenChange?.(false);
          setSubmitMessage(null);
        }, 2000);
      } else {
        setSubmitMessage({ type: 'error', text: result.message });

        // Set field-specific errors if available
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      comments: ''
    });
    setErrors({});
    setSubmitMessage(null);
    onOpenChange?.(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger>{trigger}</Dialog.Trigger>}

      <Dialog.Content
        maxWidth="550px"
        style={{
          backgroundColor: 'var(--color-dark-gray-2)',
          borderColor: 'var(--color-dark-gray-4)',
          border: '2px solid',
        }}
      >
        <Dialog.Title
          style={{
            color: 'var(--color-peach-7)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            outline: 'none',
            border: 'none',
            boxShadow: 'none',
          }}
        >
          Get In Touch
        </Dialog.Title>

        <Dialog.Description
          size="2"
          mb="4"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          Fill out the form below and we'll get back to you as soon as possible.
        </Dialog.Description>

        {/* Success/Error Message */}
        {submitMessage && (
          <Flex
            mb="4"
            p="3"
            style={{
              backgroundColor: submitMessage.type === 'success'
                ? 'rgba(166, 227, 161, 0.1)'
                : 'rgba(243, 139, 168, 0.1)',
              borderRadius: '6px',
              border: `1px solid ${submitMessage.type === 'success' ? '#a6e3a1' : '#f38ba8'}`,
            }}
          >
            <Text
              size="2"
              style={{
                color: submitMessage.type === 'success' ? '#a6e3a1' : '#f38ba8',
                fontWeight: '500'
              }}
            >
              {submitMessage.text}
            </Text>
          </Flex>
        )}

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            {/* First Name & Last Name Row */}
            <Flex gap="3" direction={{ initial: 'column', sm: 'row' }}>
              <Flex direction="column" style={{ flex: 1 }} gap="1">
                <label
                  htmlFor="firstName"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--color-foreground)'
                  }}
                >
                  First Name <span style={{ color: 'var(--color-peach-5)' }}>*</span>
                </label>
                <TextField.Root
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: 'var(--color-dark-gray-3)',
                    borderColor: errors.firstName ? '#f38ba8' : 'var(--color-dark-gray-5)',
                    color: 'var(--color-foreground)',
                  }}
                />
                {errors.firstName && (
                  <Text size="1" style={{ color: '#f38ba8' }}>
                    {errors.firstName[0]}
                  </Text>
                )}
              </Flex>

              <Flex direction="column" style={{ flex: 1 }} gap="1">
                <label
                  htmlFor="lastName"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--color-foreground)'
                  }}
                >
                  Last Name <span style={{ color: 'var(--color-peach-5)' }}>*</span>
                </label>
                <TextField.Root
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: 'var(--color-dark-gray-3)',
                    borderColor: errors.lastName ? '#f38ba8' : 'var(--color-dark-gray-5)',
                    color: 'var(--color-foreground)',
                  }}
                />
                {errors.lastName && (
                  <Text size="1" style={{ color: '#f38ba8' }}>
                    {errors.lastName[0]}
                  </Text>
                )}
              </Flex>
            </Flex>

            {/* Email */}
            <Flex direction="column" gap="1">
              <label
                htmlFor="email"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--color-foreground)'
                }}
              >
                Email <span style={{ color: 'var(--color-peach-5)' }}>*</span>
              </label>
              <TextField.Root
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isSubmitting}
                style={{
                  backgroundColor: 'var(--color-dark-gray-3)',
                  borderColor: errors.email ? '#f38ba8' : 'var(--color-dark-gray-5)',
                  color: 'var(--color-foreground)',
                }}
              />
              {errors.email && (
                <Text size="1" style={{ color: '#f38ba8' }}>
                  {errors.email[0]}
                </Text>
              )}
            </Flex>

            {/* Phone */}
            <Flex direction="column" gap="1">
              <label
                htmlFor="phone"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--color-foreground)'
                }}
              >
                Phone Number <span style={{ color: 'var(--color-peach-5)' }}>*</span>
              </label>
              <TextField.Root
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={isSubmitting}
                style={{
                  backgroundColor: 'var(--color-dark-gray-3)',
                  borderColor: errors.phone ? '#f38ba8' : 'var(--color-dark-gray-5)',
                  color: 'var(--color-foreground)',
                }}
              />
              {errors.phone && (
                <Text size="1" style={{ color: '#f38ba8' }}>
                  {errors.phone[0]}
                </Text>
              )}
            </Flex>

            {/* Company (Optional) */}
            <Flex direction="column" gap="1">
              <label
                htmlFor="company"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--color-foreground)'
                }}
              >
                Company <span style={{ color: 'var(--color-muted-foreground)', fontSize: '0.75rem' }}>(optional)</span>
              </label>
              <TextField.Root
                id="company"
                placeholder="Your Company Name"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                disabled={isSubmitting}
                style={{
                  backgroundColor: 'var(--color-dark-gray-3)',
                  borderColor: 'var(--color-dark-gray-5)',
                  color: 'var(--color-foreground)',
                }}
              />
            </Flex>

            {/* Comments */}
            <Flex direction="column" gap="1">
              <label
                htmlFor="comments"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--color-foreground)'
                }}
              >
                Comments <span style={{ color: 'var(--color-peach-5)' }}>*</span>
              </label>
              <TextArea
                id="comments"
                placeholder="Tell us about your project or inquiry..."
                value={formData.comments}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                disabled={isSubmitting}
                rows={4}
                style={{
                  backgroundColor: 'var(--color-dark-gray-3)',
                  borderColor: errors.comments ? '#f38ba8' : 'var(--color-dark-gray-5)',
                  color: 'var(--color-foreground)',
                  resize: 'vertical',
                }}
              />
              {errors.comments && (
                <Text size="1" style={{ color: '#f38ba8' }}>
                  {errors.comments[0]}
                </Text>
              )}
            </Flex>

            {/* Action Buttons */}
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button
                  type="button"
                  variant="soft"
                  color="gray"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: 'var(--color-dark-gray-4)',
                    color: 'var(--color-foreground)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1,
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Close>

              <Button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: 'var(--color-peach-3)',
                  color: 'var(--color-peach-9)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  border: '2px solid var(--color-peach-5)',
                  opacity: isSubmitting ? 0.6 : 1,
                }}
                className="hover:bg-[var(--color-peach-4)]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};