/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
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

interface ChatReplyProps {
  reply?: string
  url?: string
}

const ChatReplyEmail = ({ reply, url }: ChatReplyProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You have a new reply from {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You have a reply from {SITE_NAME}</Heading>
        <Text style={text}>
          {reply || 'You have a new message waiting for you.'}
        </Text>
        {url ? (
          <Button href={url} style={button}>
            View conversation
          </Button>
        ) : null}
        <Hr style={hr} />
        <Text style={footer}>
          Warm regards,<br />The {SITE_NAME} Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ChatReplyEmail,
  subject: 'You have a reply from Furniture100',
  displayName: 'Chat reply notification',
  previewData: {
    reply: 'Thanks for your message — yes, that sofa is available in olive linen. Let me know if you’d like to reserve it.',
    url: 'https://furniture100.co.uk/chat',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '520px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: '600' as const, color: '#5C4033', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#7A7168', lineHeight: '1.6', margin: '0 0 24px' }
const button = {
  backgroundColor: '#5E6A45',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '500' as const,
  padding: '12px 24px',
  borderRadius: '999px',
  textDecoration: 'none',
  display: 'inline-block',
}
const hr = { borderColor: '#EDE8E0', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999999', lineHeight: '1.5', margin: '0' }
