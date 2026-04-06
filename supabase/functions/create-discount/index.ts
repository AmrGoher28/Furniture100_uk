import { corsHeaders } from '@supabase/supabase-js/cors'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const BodySchema = z.object({
  email: z.string().email(),
  source: z.enum(['newsletter', 'signup']),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { email, source } = parsed.data
    const shopifyToken = Deno.env.get('SHOPIFY_ADMIN_TOKEN') || Deno.env.get('SHOPIFY_ACCESS_TOKEN')
    const shopifyDomain = 'furniture100-store.myshopify.com'

    if (!shopifyToken) {
      return new Response(JSON.stringify({ error: 'Shopify not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Generate unique code
    const code = `WELCOME${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Create price rule
    const priceRuleRes = await fetch(
      `https://${shopifyDomain}/admin/api/2025-07/price_rules.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyToken,
        },
        body: JSON.stringify({
          price_rule: {
            title: `Welcome 10% - ${email}`,
            target_type: 'line_item',
            target_selection: 'all',
            allocation_method: 'across',
            value_type: 'percentage',
            value: '-10.0',
            customer_selection: 'all',
            usage_limit: 1,
            starts_at: new Date().toISOString(),
          },
        }),
      }
    )

    if (!priceRuleRes.ok) {
      const err = await priceRuleRes.text()
      console.error('Price rule error:', err)
      return new Response(JSON.stringify({ error: 'Failed to create discount' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const priceRuleData = await priceRuleRes.json()
    const priceRuleId = priceRuleData.price_rule.id

    // Create discount code
    const discountRes = await fetch(
      `https://${shopifyDomain}/admin/api/2025-07/price_rules/${priceRuleId}/discount_codes.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyToken,
        },
        body: JSON.stringify({
          discount_code: { code },
        }),
      }
    )

    if (!discountRes.ok) {
      return new Response(JSON.stringify({ error: 'Failed to create code' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({ code, message: 'Discount code created' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
