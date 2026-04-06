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

interface ReauthenticationEmailProps {
  token: string
}

const SITE_NAME = 'Furniture100'

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code for {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{SITE_NAME}</Text>
        <Hr style={divider} />
        <Heading style={h1}>Verification Code</Heading>
        <Text style={text}>Use the code below to confirm your identity:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          This code will expire shortly. If you didn't request this, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#1A1A1A',
  margin: '0 0 30px',
  letterSpacing: '4px',
  textAlign: 'center' as const,
}
const footer = { fontSize: '12px', color: '#C4B5A3', margin: '30px 0 0', lineHeight: '1.5' }
