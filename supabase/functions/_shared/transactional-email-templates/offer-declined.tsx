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
  Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Furniture100'

interface OfferDeclinedProps {
  productTitle?: string
  originalPrice?: string
  offerAmount?: string
  shopUrl?: string
}

const OfferDeclinedEmail = ({
  productTitle = 'Your item',
  originalPrice = '0.00',
  offerAmount = '0.00',
  shopUrl = 'https://furniture100.co.uk/shop',
}: OfferDeclinedProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Update on your offer for {productTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{SITE_NAME}</Text>
        <Hr style={divider} />
        <Heading style={h1}>Offer Update</Heading>
        <Text style={text}>
          Thank you for your interest in <strong>{productTitle}</strong>. Unfortunately, we're unable to accept your offer at this time.
        </Text>
        <Section style={priceBox}>
          <Text style={priceLabel}>Listed Price</Text>
          <Text style={priceValue}>£{originalPrice}</Text>
          <Text style={priceLabel}>Your Offer</Text>
          <Text style={priceValue}>£{offerAmount}</Text>
        </Section>
        <Text style={text}>
          You're welcome to purchase this item at the listed price, or browse our collection for other pieces you might love.
        </Text>
        <Button style={button} href={shopUrl}>
          Browse Collection
        </Button>
        <Text style={footer}>
          If you have any questions, feel free to get in touch. We'd love to help you find the perfect piece.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OfferDeclinedEmail,
  subject: (data: Record<string, any>) => `Update on your offer for ${data.productTitle || 'your item'} — ${SITE_NAME}`,
  displayName: 'Offer declined',
  previewData: {
    productTitle: 'Oak Dining Table',
    originalPrice: '899.00',
    offerAmount: '650.00',
    shopUrl: 'https://furniture100.co.uk/shop',
  },
} satisfies TemplateEntry

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
const priceBox = {
  backgroundColor: '#FAF8F5',
  padding: '20px 24px',
  margin: '0 0 28px',
}
const priceLabel = { fontSize: '12px', color: '#C4B5A3', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '1px' }
const priceValue = { fontSize: '16px', color: '#5C4A3A', margin: '0 0 16px', fontWeight: 300 as const }
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
