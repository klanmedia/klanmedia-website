// Parst einen plain-text Hero-Titel aus der DB
// Unterstützt: \n = Zeilenumbruch, [blue]...[/blue] = Markenfarbe
export default function HeroTitle({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => {
        // Splitte an [blue]...[/blue] Markierungen
        const parts = line.split(/(\[blue\].*?\[\/blue\])/g)
        return (
          <span key={i}>
            {parts.map((part, j) => {
              if (part.startsWith('[blue]') && part.endsWith('[/blue]')) {
                return (
                  <em key={j} className="not-italic text-brand">
                    {part.slice(6, -7)}
                  </em>
                )
              }
              return <span key={j}>{part}</span>
            })}
            {i < lines.length - 1 && <br />}
          </span>
        )
      })}
    </>
  )
}
