import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

type Position = {
  beschreibung: string
  menge: number
  einzelpreis: number
  typ?: 'einmalig' | 'monatlich'
}

function eur(n: number) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '&nbsp;€'
}

function positionRows(rows: Position[], startIndex = 1): string {
  return rows.map((p, i) => `
    <tr>
      <td class="num">${startIndex + i}</td>
      <td class="desc">${escHtml(p.beschreibung)}</td>
      <td class="right">${p.menge}</td>
      <td class="right">${eur(p.einzelpreis)}</td>
      <td class="right bold">${eur(p.menge * p.einzelpreis)}</td>
    </tr>`).join('')
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const autoPrint = req.nextUrl.searchParams.get('print') === '1'

  const { data: invoice } = await supabaseAdmin
    .from('invoices')
    .select(`*, customers(name, firma, adresse, plz, ort, email)`)
    .eq('id', id)
    .maybeSingle()

  if (!invoice) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customer = (Array.isArray(invoice.customers) ? invoice.customers[0] : invoice.customers) as any
  const positionen = (invoice.positionen ?? []) as Position[]

  const einmaligPos  = positionen.filter(p => !p.typ || p.typ === 'einmalig')
  const monatlichPos = positionen.filter(p => p.typ === 'monatlich')
  const einmaligSum  = einmaligPos.reduce((s, p) => s + p.menge * p.einzelpreis, 0)
  const monatlichSum = monatlichPos.reduce((s, p) => s + p.menge * p.einzelpreis, 0)
  const netto        = positionen.reduce((s, p) => s + p.menge * p.einzelpreis, 0)

  const hasBoth = einmaligPos.length > 0 && monatlichPos.length > 0

  const recipientName   = customer?.firma ?? customer?.name ?? '—'
  const recipientSub    = customer?.firma ? customer.name : null
  const recipientAdr    = customer?.adresse ?? null
  const recipientCity   = [customer?.plz, customer?.ort].filter(Boolean).join(' ') || null

  const datum     = invoice.datum     ? new Date(invoice.datum).toLocaleDateString('de-DE')     : '—'
  const faellig   = invoice.faellig_am ? new Date(invoice.faellig_am).toLocaleDateString('de-DE') : '—'
  const leistung  = invoice.leistungsdatum ? new Date(invoice.leistungsdatum).toLocaleDateString('de-DE') : datum
  const projekt   = invoice.projektbezeichnung ?? ''

  const posTableHeader = `
    <table class="pos-table">
      <thead>
        <tr>
          <th class="num">#</th>
          <th class="desc">Leistungsbeschreibung</th>
          <th class="right">Menge</th>
          <th class="right">Einzelpreis</th>
          <th class="right">Gesamt</th>
        </tr>
      </thead>`

  let positionsHtml: string
  if (hasBoth) {
    positionsHtml = `
      <div class="section-label blue">EINMALIG</div>
      ${posTableHeader}<tbody>${positionRows(einmaligPos)}</tbody></table>
      <div class="section-label green" style="margin-top:20px">MONATLICH</div>
      ${posTableHeader}<tbody>${positionRows(monatlichPos)}</tbody></table>`
  } else {
    positionsHtml = `${posTableHeader}<tbody>${positionRows(positionen)}</tbody></table>`
  }

  let totalsHtml = ''
  if (hasBoth) {
    totalsHtml += `
      <div class="total-row">
        <span>Einmalig</span>
        <span>${eur(einmaligSum)}</span>
      </div>
      <div class="total-row">
        <span>Monatlich</span>
        <span>${eur(monatlichSum)}/Mo</span>
      </div>
      <div class="total-divider"></div>`
  }
  totalsHtml += `
    <div class="total-row total-main">
      <span>GESAMTBETRAG (netto)</span>
      <span>${eur(netto)}</span>
    </div>`

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rechnung ${escHtml(invoice.rechnungsnummer ?? '')}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 13px;
      color: #111;
      background: #f3f4f6;
      padding: 32px 16px;
    }
    .page {
      max-width: 820px;
      margin: 0 auto;
      background: #fff;
      padding: 56px 60px;
      box-shadow: 0 4px 32px rgba(0,0,0,0.10);
      border-radius: 4px;
    }
    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; }
    .logo { font-size: 28px; font-weight: 900; color: #1d4ed8; letter-spacing: -1px; }
    .sender { font-size: 11px; color: #6b7280; text-align: right; line-height: 1.7; }
    /* Two column */
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
    .col-label { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px; }
    .recipient-box { font-size: 13px; line-height: 1.8; }
    .recipient-box .main { font-weight: 700; }
    .info-box { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 16px; }
    .info-row { display: flex; justify-content: space-between; font-size: 12px; line-height: 1.9; }
    .info-row .info-key { color: #6b7280; }
    .info-row .info-val { font-weight: 600; }
    /* Projekt */
    .projekt { font-size: 14px; font-weight: 700; margin-bottom: 20px; color: #111; }
    /* Position table */
    .section-label { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 6px; }
    .section-label.blue { color: #1d4ed8; }
    .section-label.green { color: #059669; }
    .pos-table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
    .pos-table thead tr { background: #1e293b; color: #fff; }
    .pos-table th { padding: 8px 10px; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
    .pos-table td { padding: 9px 10px; border-bottom: 1px solid #f1f5f9; font-size: 12.5px; }
    .pos-table tbody tr:last-child td { border-bottom: none; }
    .pos-table tbody tr:hover { background: #f8fafc; }
    .num  { width: 32px; text-align: center; color: #9ca3af; }
    .desc { text-align: left; }
    .right { text-align: right; }
    .bold { font-weight: 700; }
    /* Totals */
    .totals-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 14px 18px;
      margin-top: 20px;
    }
    .total-row { display: flex; justify-content: space-between; font-size: 13px; line-height: 2; }
    .total-row .bold, .total-row span:last-child { font-weight: 600; }
    .total-divider { border-top: 1px solid #bfdbfe; margin: 6px 0; }
    .total-main { font-size: 15px; font-weight: 800; color: #1d4ed8; }
    /* §19 notice */
    .notice-box {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 12px 16px;
      margin-top: 24px;
      font-size: 11.5px;
      color: #92400e;
      font-style: italic;
    }
    /* Bank + payment */
    .bank-payment { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
    .bank-block .bank-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #9ca3af; margin-bottom: 8px; }
    .bank-block .bank-row { font-size: 12px; line-height: 1.8; color: #374151; }
    .bank-block .bank-row span { color: #6b7280; }
    .payment-note { font-size: 11.5px; color: #6b7280; line-height: 1.7; padding: 12px 14px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; }
    /* Footer */
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10.5px; color: #9ca3af; }
    /* Print */
    @media print {
      body { background: #fff; padding: 0; }
      .page { box-shadow: none; padding: 24px 32px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align:center;margin-bottom:20px">
    <button onclick="window.print()" style="background:#1d4ed8;color:#fff;border:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">
      🖨️ Drucken / Als PDF speichern
    </button>
    <button onclick="window.close()" style="background:#f3f4f6;color:#374151;border:1px solid #e5e7eb;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;margin-left:10px">
      Schließen
    </button>
  </div>
  ${autoPrint ? '<script>window.addEventListener("load",()=>setTimeout(()=>window.print(),300))<\/script>' : ''}

  <div class="page">
    <!-- Header -->
    <div class="header">
      <div class="logo">klanmedia</div>
      <div class="sender">
        Benno Klan · klanmedia<br>
        Schechen · Bayern<br>
        info@klanmedia.de<br>
        +49 1577 0350652<br>
        www.klanmedia.de
      </div>
    </div>

    <!-- Recipient + Invoice info -->
    <div class="two-col">
      <div>
        <div class="col-label">Rechnung an</div>
        <div class="recipient-box">
          <div class="main">${escHtml(recipientName)}</div>
          ${recipientSub ? `<div>${escHtml(recipientSub)}</div>` : ''}
          ${recipientAdr ? `<div>${escHtml(recipientAdr)}</div>` : ''}
          ${recipientCity ? `<div>${escHtml(recipientCity)}</div>` : ''}
        </div>
      </div>
      <div>
        <div class="col-label">Rechnung</div>
        <div class="info-box">
          <div class="info-row">
            <span class="info-key">Rechnungsnummer</span>
            <span class="info-val">${escHtml(invoice.rechnungsnummer ?? '—')}</span>
          </div>
          <div class="info-row">
            <span class="info-key">Rechnungsdatum</span>
            <span class="info-val">${datum}</span>
          </div>
          <div class="info-row">
            <span class="info-key">Leistungsdatum</span>
            <span class="info-val">${leistung}</span>
          </div>
          <div class="info-row">
            <span class="info-key">Fällig bis</span>
            <span class="info-val">${faellig}</span>
          </div>
          <div class="info-row">
            <span class="info-key">Zahlungsart</span>
            <span class="info-val">Überweisung</span>
          </div>
        </div>
      </div>
    </div>

    ${projekt ? `<div class="projekt">Rechnung für: ${escHtml(projekt)}</div>` : ''}

    <!-- Positions -->
    ${positionsHtml}

    <!-- Totals -->
    <div class="totals-box">
      ${totalsHtml}
    </div>

    <!-- §19 notice -->
    <div class="notice-box">
      Gemäß §19 UStG wird keine Umsatzsteuer ausgewiesen. Es gilt der Nettobetrag.
    </div>

    <!-- Bank + payment -->
    <div class="bank-payment">
      <div class="bank-block">
        <div class="bank-title">Bankverbindung</div>
        <div class="bank-row">Kontoinhaber: <span>Benno Klan</span></div>
        <div class="bank-row">IBAN: <span>[wird ergänzt]</span></div>
        <div class="bank-row">BIC: <span>[wird ergänzt]</span></div>
        <div class="bank-row">Bank: <span>[wird ergänzt]</span></div>
      </div>
      <div>
        <div class="payment-note">
          Bitte unter Angabe der Rechnungsnummer <strong>${escHtml(invoice.rechnungsnummer ?? '')}</strong> überweisen.<br>
          Zahlungsziel: 14 Tage.<br>
          30&nbsp;% Anzahlung bei Auftragserteilung, 70&nbsp;% nach Abnahme und Übergabe.
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      klanmedia · Benno Klan · Schechen · info@klanmedia.de · +49 1577 0350652 &nbsp;|&nbsp; www.klanmedia.de
    </div>
  </div>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
