"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Words } from "@/components/ui/Words";
import { team } from "@/content/about";
import { LoopVideo } from "./LoopVideo";
import styles from "./Team.module.css";

/**
 * "The people behind it": the founders' intro video (muted loop; one tap plays
 * it from the start with sound), the people & culture lead, and the leads grid.
 */
export function Team() {
  const video = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const f = team.founders;

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (sound) {
      v.muted = true;
      v.loop = true;
      v.onended = null;
      setSound(false);
      return;
    }
    v.currentTime = 0;
    v.muted = false;
    v.loop = false;
    v.onended = () => {
      v.muted = true;
      v.loop = true;
      v.currentTime = 0;
      v.play().catch(() => {});
      setSound(false);
    };
    v.play().catch(() => {});
    setSound(true);
  };

  return (
    <section id="team" data-screen-label="05 Team" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 className={styles.h2} data-split="" aria-label={team.title.join(" ")}>
            <Words text={team.title[0]} />{" "}
            <span className={styles.accent}>
              <Words text={team.title[1]} />
            </span>
          </h2>
          <p className={styles.lead} data-reveal="">
            {team.lead}
          </p>
        </div>

        <div className={styles.founders} data-reveal="">
          <div className={styles.fMedia}>
            <div className={styles.fZoom}>
              <LoopVideo
                ref={video}
                src={f.video}
                label="The founders introduce PSQUARE"
                className={styles.cover}
              />
            </div>
            <div aria-hidden="true" className={styles.fShade} />
            <button type="button" aria-pressed={sound} onClick={toggle} className={styles.sound}>
              <span className={styles.soundIcon}>
                {sound ? <span className={styles.pause} /> : <span className={styles.play} />}
              </span>
              {sound ? "Mute" : "Meet PSQUARE"}
            </button>
          </div>
          <div className={styles.fCopy}>
            <h3 className={styles.fTitle}>
              {f.title[0]}
              <br />
              <span className={styles.accent}>{f.title[1]}</span>
            </h3>
            <blockquote className={styles.quote}>“{f.quote}”</blockquote>
            <div className={styles.names}>
              {f.people.map((p) => (
                <div key={p.name} className={styles.name}>
                  <span>{p.name}</span>
                  <span>{p.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.lower}>
          <aside className={styles.hr} data-reveal="">
            <div className={styles.colHead}>
              <h3 className={styles.colTitle}>{team.culture.title}</h3>
            </div>
            <div className={styles.hrFrame}>
              <span className={styles.hrCard}>
                <span className={styles.hrZoom}>
                  <Image
                    src={team.culture.photo}
                    alt={team.culture.name}
                    fill
                    sizes="(min-width: 1100px) 30vw, 440px"
                    className={styles.hrImg}
                  />
                </span>
                <span aria-hidden="true" className={styles.hrShade} />
                <span className={styles.hrText}>
                  <span className={styles.hrQuote}>“{team.culture.quote}”</span>
                  <span className={styles.hrName}>{team.culture.name}</span>
                  <span className={styles.hrRole}>{team.culture.role}</span>
                </span>
              </span>
            </div>
          </aside>

          <div className={styles.leads}>
            <div className={styles.colHead}>
              <h3 className={styles.colTitle}>
                {team.leads.title}
                <span className={styles.count}>
                  {String(team.leads.people.length).padStart(2, "0")}
                </span>
              </h3>
              <span className={styles.colMeta}>{team.leads.meta}</span>
            </div>
            <div role="list" className={styles.crew}>
              {team.leads.people.map((p) => (
                <figure key={p.name} role="listitem" data-reveal="" className={styles.person}>
                  <span className={styles.face}>
                    <span className={styles.faceZoom}>
                      <Image
                        src={p.photo}
                        alt={p.name}
                        fill
                        sizes="136px"
                        className={styles.faceImg}
                      />
                    </span>
                  </span>
                  <figcaption className={styles.who}>
                    <span className={styles.whoName}>{p.name}</span>
                    <span className={styles.whoRole}>{p.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
