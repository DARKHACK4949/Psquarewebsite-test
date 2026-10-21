import { Fragment } from "react";

/**
 * Server-rendered word spans for the scroll-linked heading reveal.
 * The heading that contains them carries `data-split` and an aria-label with
 * the full text; the words themselves are hidden from assistive tech.
 */
export function Words({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\s+)/);
  return (
    <>
      {parts.map((p, i) =>
        p.trim() ? (
          <span key={i} className="split-word" aria-hidden="true">
            <span data-word="" className={className}>
              {p}
            </span>
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}
