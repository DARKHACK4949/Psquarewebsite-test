"use client";

import { useRef } from "react";
import Image from "next/image";
import type { whatWeDo } from "@/content/home/preview";
import styles from "./IndustryRow.module.css";

type Industries = (typeof whatWeDo)["industries"];

/**
 * The industries we build for, as a horizontal row after the disciplines: a
 * two-line statement, then cards that run off the right edge. Touch and
 * trackpads scroll it natively; a mouse can also grab and drag it, 1:1 from the
 * point it took hold of. Each card is a colour plate (or an object render once
 * one exists), the industry's name and one line.
 */
export function IndustryRow({ industries }: { industries: Industries }) {
  const row = useRef<HTMLUListElement>(null);
  const drag = useRef({ on: false, x: 0, left: 0, moved: false });

  const down = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !row.current) return;
    drag.current = { on: true, x: e.clientX, left: row.current.scrollLeft, moved: false };
    row.current.setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.on || !row.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    row.current.scrollLeft = d.left - dx;
  };
  const up = () => {
    drag.current.on = false;
  };

  return (
    <section
      data-screen-label="05b Industries"
      data-noband=""
      data-nav-dark=""
      className={styles.section}
    >
      <h2 className={styles.statement} data-reveal="">
        <span>{industries.statement[0]}</span>{" "}
        <span className={styles.dim}>{industries.statement[1]}</span>
      </h2>
      <ul
        ref={row}
        className={styles.row}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        aria-label="Industries"
      >
        {industries.items.map((it, i) => (
          <li key={it.name} className={styles.card} data-reveal="">
            <div className={styles.plate} style={{ background: it.plate }} aria-hidden="true">
              {it.image ? (
                <Image src={it.image} alt="" fill sizes="340px" className={styles.img} />
              ) : (
                <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
              )}
            </div>
            <h3 className={styles.name}>{it.name}</h3>
            <p className={styles.line}>{it.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
