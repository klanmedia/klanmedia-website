import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, HeadingLevel,
} from 'docx'

type Position = {
  beschreibung: string
  menge: number
  einzelpreis: number
  typ?: 'einmalig' | 'monatlich'
}

function eur(n: number) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function cell(text: string, bold = false, align: typeof AlignmentType[keyof typeof AlignmentType] = AlignmentType.LEFT): TableCell {
  return new TableCell({
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, font: 'Calibri', size: 22 })],
    })],
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      left:   { style: BorderStyle.NONE },
      right:  { style: BorderStyle.NONE },
    },
    margins: { top: 80, bottom: 80, left: 80, right: 80 },
  })
}

function sectionLabel(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, font: 'Calibri', size: 20, color: '6B7280' })],
    spacing: { before: 200, after: 80 },
  })
}

function positionTable(rows: Position[]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          cell('Beschreibung', true),
          cell('Menge', true, AlignmentType.RIGHT),
          cell('Einzelpreis', true, AlignmentType.RIGHT),
          cell('Gesamt', true, AlignmentType.RIGHT),
        ],
        tableHeader: true,
      }),
      ...rows.map(p => new TableRow({
        children: [
          cell(p.beschreibung),
          cell(String(p.menge), false, AlignmentType.RIGHT),
          cell(eur(p.einzelpreis), false, AlignmentType.RIGHT),
          cell(eur(p.menge * p.einzelpreis), false, AlignmentType.RIGHT),
        ],
      })),
    ],
  })
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data: invoice } = await supabaseAdmin
    .from('invoices')
    .select(`*, customers(*)`)
    .eq('id', id)
    .maybeSingle()

  if (!invoice) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 })

  const customer = invoice.customers as {
    name: string; firma: string | null; adresse: string | null; plz: string | null; ort: string | null
  } | null

  const positionen = (invoice.positionen ?? []) as Position[]
  const einmaligPos  = positionen.filter(p => !p.typ || p.typ === 'einmalig')
  const monatlichPos = positionen.filter(p => p.typ === 'monatlich')
  const einmaligSum  = einmaligPos.reduce((s, p) => s + p.menge * p.einzelpreis, 0)
  const monatlichSum = monatlichPos.reduce((s, p) => s + p.menge * p.einzelpreis, 0)
  const netto        = positionen.reduce((s, p) => s + p.menge * p.einzelpreis, 0)

  const hasBoth = einmaligPos.length > 0 && monatlichPos.length > 0

  const senderLines = ['klanmedia', 'Benno Klan', 'info@klanmedia.de']
  const recipientLines = [
    customer?.firma ?? customer?.name ?? 'Unbekannt',
    ...(customer?.firma ? [customer.name] : []),
    ...(customer?.adresse ? [customer.adresse] : []),
    ...(customer?.plz || customer?.ort ? [`${customer?.plz ?? ''} ${customer?.ort ?? ''}`.trim()] : []),
  ]

  const children: (Paragraph | Table)[] = [
    // Sender
    new Paragraph({
      children: senderLines.map((line, i) => new TextRun({
        text: line + (i < senderLines.length - 1 ? '\n' : ''),
        font: 'Calibri', size: i === 0 ? 28 : 22, bold: i === 0,
      })),
    }),
    new Paragraph({ text: '' }),

    // Recipient
    ...recipientLines.map(line => new Paragraph({
      children: [new TextRun({ text: line, font: 'Calibri', size: 22 })],
    })),
    new Paragraph({ text: '' }),
    new Paragraph({ text: '' }),

    // Title
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: `Rechnung ${invoice.rechnungsnummer ?? ''}`, bold: true, size: 36, font: 'Calibri' })],
    }),
    new Paragraph({ text: '' }),

    // Dates
    new Paragraph({
      children: [new TextRun({
        text: `Rechnungsdatum: ${invoice.datum ? new Date(invoice.datum).toLocaleDateString('de-DE') : '—'}`,
        font: 'Calibri', size: 22,
      })],
    }),
    ...(invoice.faellig_am ? [new Paragraph({
      children: [new TextRun({
        text: `Zahlbar bis: ${new Date(invoice.faellig_am).toLocaleDateString('de-DE')}`,
        font: 'Calibri', size: 22,
      })],
    })] : []),
    new Paragraph({ text: '' }),

    // Positions — grouped if both types present
    ...(hasBoth ? [
      sectionLabel('EINMALIG'),
      positionTable(einmaligPos),
      new Paragraph({ text: '' }),
      sectionLabel('MONATLICH'),
      positionTable(monatlichPos),
    ] : [
      positionTable(positionen),
    ]),

    new Paragraph({ text: '' }),

    // Totals
    ...(hasBoth ? [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: `Einmalig: ${eur(einmaligSum)}`, font: 'Calibri', size: 22 })],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: `Monatlich: ${eur(monatlichSum)}/Mo`, font: 'Calibri', size: 22 })],
      }),
    ] : []),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: `Nettobetrag: ${eur(netto)}`, bold: true, size: 26, font: 'Calibri' })],
    }),

    new Paragraph({ text: '' }),

    // §19
    new Paragraph({
      children: [new TextRun({
        text: 'Gemäß §19 UStG wird keine Umsatzsteuer ausgewiesen.',
        font: 'Calibri', size: 18, italics: true, color: '6B7280',
      })],
    }),

    new Paragraph({ text: '' }),

    // Payment info
    new Paragraph({
      children: [new TextRun({ text: 'Zahlungsinformationen', bold: true, font: 'Calibri', size: 22 })],
    }),
    new Paragraph({
      children: [new TextRun({
        text: 'Bitte überweisen Sie den Betrag innerhalb der Zahlungsfrist.',
        font: 'Calibri', size: 20,
      })],
    }),
    new Paragraph({
      children: [new TextRun({
        text: 'IBAN: [wird ergänzt] · Bank: [wird ergänzt]',
        font: 'Calibri', size: 20, color: '9CA3AF',
      })],
    }),
  ]

  const doc = new Document({ sections: [{ properties: {}, children }] })
  const buffer = await Packer.toBuffer(doc)
  const uint8  = new Uint8Array(buffer)
  const filename = `${invoice.rechnungsnummer ?? 'Rechnung'}.docx`

  return new NextResponse(uint8, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
