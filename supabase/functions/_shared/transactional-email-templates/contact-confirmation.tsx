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
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Furniture100'

interface ContactConfirmationProps {
  name?: string
}

const ContactConfirmationEmail = ({ name }: ContactConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We've received your message — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Thank you, ${name}!` : 'Thank you for reaching out!'}
        </Heading>
        <Text style={text}>
          We've received your message and will get back to you as soon as possible,
          usually within 1–2 business days.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Warm regards,<br />The {SITE_NAME} Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactConfirmationEmail,
  subject: 'We received your message',
  displayName: 'Contact form confirmation',
  previewData: { name: 'Jane' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '520px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: '600' as const, color: '#5C4033', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#7A7168', lineHeight: '1.6', margin: '0 0 24px' }
const hr = { borderColor: '#EDE8E0', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999999', lineHeight: '1.5', margin: '0' }
