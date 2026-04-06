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

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

const SITE_NAME = 'Furniture100'

export const InviteEmail = ({
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to join {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{SITE_NAME}</Text>
        <Hr style={divider} />
        <Heading style={h1}>You've Been Invited</Heading>
        <Text style={text}>
          You've been invited to join {SITE_NAME}. Click the button below to accept and create your account.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Accept Invitation
        </Button>
        <Text style={footer}>
          If you weren't expecting this invitation, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }
const container = { padding: '40px 30px', maxWidth: '560px', margin: '0 auto' }
const brand = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '24px',
  fontWeight: 'normal' as const,
  color: '#1A1A1A',
  letterSpacing: '3px',
  textAlign: 'center' as const,
  margin: '0 0 20px',
}
const divider = { borderColor: '#C4B5A3', margin: '0 0 30px' }
const h1 = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '22px',
  fontWeight: 'normal' as const,
  color: '#1A1A1A',
  margin: '0 0 16px',
}
const text = { fontSize: '14px', color: '#5C4A3A', lineHeight: '1.6', margin: '0 0 28px', fontWeight: 300 as const }
const button = {
  backgroundColor: '#1A1A1A',
  color: '#FAF8F5',
  fontSize: '13px',
  borderRadius: '0px',
  padding: '14px 28px',
  textDecoration: 'none',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
}
const footer = { fontSize: '12px', color: '#C4B5A3', margin: '30px 0 0', lineHeight: '1.5' }
