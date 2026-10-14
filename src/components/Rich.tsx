// Minimal inline markup for the copy in src/data/site.ts:
//   **key fact**        → brighter, medium weight (for skimmers)
//   {{phrase}}          → accent italic (used once, in the hero tagline)
//   [label](https://…)  → external link
// Rendered at build time only (server component), so none of this ships to the browser.

const TOKEN = /\*\*(.+?)\*\*|\{\{(.+?)\}\}|\[(.+?)\]\((https?:\/\/[^)\s]+)\)/g;

export default function Rich({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    if (m[1]) {
      parts.push(
        <strong key={at} className="font-medium text-paper">
          {m[1]}
        </strong>,
      );
    } else if (m[2]) {
      parts.push(
        <em key={at} className="font-serif text-[1.08em] italic text-accent">
          {m[2]}
        </em>,
      );
    } else {
      parts.push(
        <a key={at} href={m[4]} target="_blank" rel="noopener noreferrer" className="link-underline text-paper">
          {m[3]}
        </a>,
      );
    }
    last = at + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
