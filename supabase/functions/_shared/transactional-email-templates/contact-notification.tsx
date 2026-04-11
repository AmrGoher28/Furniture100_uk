/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
  Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Furniture100'
const ADMIN_EMAIL = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || ''

interface ContactNotificationProps {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const ContactNotificationEmail = ({ name, email, subject, message }: ContactNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New contact form submission from {name || 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Contact Form Submission</Heading>
        <Text style={text}>You've received a new message via the {SITE_NAME} contact form.</Text>

        <Section style={detailsBox}>
          <Text style={label}>Name</Text>
          <Text style={value}>{name || '—'}</Text>

          <Text style={label}>Email</Text>
          <Text style={value}>{email || '—'}</Text>

          <Text style={label}>Subject</Text>
          <Text style={value}>{subject || '—'}</Text>

          <Text style={label}>Message</Text>
          <Text style={value}>{message || '—'}</Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>This is an automated notification from {SITE_NAME}.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactNotificationEmail,
  subject: (data: Record<string, any>) =>
    `New contact: ${data.subject || 'No subject'}`,
  displayName: 'Contact form notification (admin)',
  to: ADMIN_EMAIL,
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'Delivery question',
    message: 'Hi, I was wondering about delivery times to Scotland?',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: '600' as const, color: '#5C4033', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#7A7168', lineHeight: '1.6', margin: '0 0 20px' }
const detailsBox = { backgroundColor: '#F5F0EB', borderRadius: '8px', padding: '20px 24px', margin: '0 0 24px' }
const label = { fontSize: '11px', fontWeight: '600' as const, color: '#5C4033', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '12px 0 2px' }
const value = { fontSize: '14px', color: '#2C2C2C', margin: '0 0 8px', lineHeight: '1.5' }
const hr = { borderColor: '#EDE8E0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '0' }
