import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

/* ─── Types ──────────────────────────────────────────────────────────────── */
type ContactPayload = {
  name?: string
  phone?: string
  email?: string
  note?: string
}

/* ─── Required env vars ──────────────────────────────────────────────────── */
const REQUIRED_ENV = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO_EMAIL'] as const

/* ─── Simple in-memory rate limiter (per IP, max 3 submissions / 10 min) ── */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT) return true

  entry.count++
  return false
}

/* ─── Input validation ───────────────────────────────────────────────────── */
function validatePayload(p: ContactPayload): string[] {
  const errors: string[] = []
  if (!p.name?.trim()) errors.push('Name is required')
  if (!p.phone?.trim() || !/^\+?[\d\s\-()]{7,}$/.test(p.phone)) errors.push('Valid phone number is required')
  if (!p.email?.trim() || !/\S+@\S+\.\S+/.test(p.email)) errors.push('Valid email address is required')
  return errors
}

/* ─── Sanitise user input (strip HTML tags) ──────────────────────────────── */
function sanitise(str: string | undefined): string {
  return (str ?? '').replace(/[<>]/g, '').trim()
}

/* ─── HTML email template ────────────────────────────────────────────────── */
function buildHtml(name: string, phone: string, email: string, note: string): string {
  const safeNote = note || 'No message provided.'
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Form Submission</title>
</head>
<body style="margin:0;padding:0;background:#0f1a10;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1a10;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#172019;border-radius:16px;overflow:hidden;border:1px solid rgba(140,159,78,0.25);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a2e1c,#111a12);padding:32px 36px;border-bottom:1px solid rgba(140,159,78,0.2);">
              <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(140,159,78,0.8);">Trufud Trading SPC</p>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">New Contact Form Submission</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px;">

              <!-- Sender details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:12px 16px;background:rgba(140,159,78,0.07);border-radius:10px;border:1px solid rgba(140,159,78,0.15);">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                          <span style="font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.12em;">Name</span><br/>
                          <span style="font-size:15px;color:#ffffff;font-weight:600;">${name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                          <span style="font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.12em;">Phone</span><br/>
                          <span style="font-size:15px;color:#ffffff;font-weight:600;">${phone}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.12em;">Email</span><br/>
                          <a href="mailto:${email}" style="font-size:15px;color:#8C9F4E;font-weight:600;text-decoration:none;">${email}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <p style="margin:0 0 10px 0;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.12em;">Message</p>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 18px;">
                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.7;white-space:pre-wrap;">${safeNote}</p>
              </div>

              <!-- Reply CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#8C9F4E,#5c6b2e);color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;border-radius:50px;letter-spacing:0.06em;">
                      Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid rgba(140,159,78,0.15);background:rgba(0,0,0,0.2);">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);text-align:center;">
                This email was sent automatically from the Trufud website contact form.<br/>
                Trufud Trading SPC · Post Box 2576, PC 130, Muscat, Sultanate of Oman
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/* ─── Plain-text fallback ────────────────────────────────────────────────── */
function buildText(name: string, phone: string, email: string, note: string): string {
  return [
    'NEW CONTACT FORM SUBMISSION — TRUFUD',
    '======================================',
    '',
    `Name:    ${name}`,
    `Phone:   ${phone}`,
    `Email:   ${email}`,
    '',
    'Message:',
    note || 'No message provided.',
    '',
    '--------------------------------------',
    'Sent automatically from trufudoman.com',
  ].join('\n')
}

/* ─── POST handler ───────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    /* ── Rate limit ── */
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, message: 'Too many requests. Please wait a few minutes and try again.' },
        { status: 429 }
      )
    }

    /* ── Parse & validate body ── */
    let payload: ContactPayload
    try {
      payload = (await req.json()) as ContactPayload
    } catch {
      return NextResponse.json({ ok: false, message: 'Invalid request body.' }, { status: 400 })
    }

    const errors = validatePayload(payload)
    if (errors.length) {
      return NextResponse.json({ ok: false, message: errors.join(', ') }, { status: 400 })
    }

    /* ── Check env vars ── */
    const missing = REQUIRED_ENV.filter((k) => !process.env[k]?.trim())
    if (missing.length) {
      console.error('Missing env vars:', missing)
      return NextResponse.json(
        { ok: false, message: 'Server email configuration is incomplete. Please contact us directly at info@trufudoman.com' },
        { status: 500 }
      )
    }

    /* ── Sanitise inputs ── */
    const name  = sanitise(payload.name)
    const phone = sanitise(payload.phone)
    const email = sanitise(payload.email)
    const note  = sanitise(payload.note)

    /* ── Build transporter ── */
    const smtpPort = Number(process.env.SMTP_PORT)
    const useSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: useSecure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Increase timeout for slow connections
      connectionTimeout: 10_000,
      greetingTimeout:   10_000,
      socketTimeout:     15_000,
    })

    /* ── Verify connection before sending ── */
    await transporter.verify()

    /* ── Send email ── */
    await transporter.sendMail({
      from:    `"TruFud Website" <${process.env.SMTP_USER}>`,
      to:      process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New Enquiry from ${name} — TruFud Contact Form`,
      text:    buildText(name, phone, email, note),
      html:    buildHtml(name, phone, email, note),
    })

    return NextResponse.json({ ok: true })

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[contact/route] Email send failed:', msg)

    return NextResponse.json(
      { ok: false, message: 'Unable to send your message right now. Please try again or email us directly at info@trufudoman.com' },
      { status: 500 }
    )
  }
}
