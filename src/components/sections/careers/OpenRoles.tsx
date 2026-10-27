"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import { openRoles, roleHref, roles } from "@/content/careers";
import { track } from "@/lib/analytics";
import styles from "./OpenRoles.module.css";

/**
 * Open roles, driven by careers-roles.json:
 * 0 roles → the "always glad to meet good people" empty state;
 * 1+ → the role list; 8+ across more than one team → team filter pills too.
 */
export function OpenRoles() {
  const [team, setTeam] = useState(openRoles.all);
  const names = [openRoles.all, ...new Set(roles.map((r) => r.team))];
  const showFilters = roles.length >= 8 && names.length > 2;
  const shown = roles.filter((r) => team === openRoles.all || r.team === team);
  const e = openRoles.empty;

  return (
    <section
      id="roles"
      data-screen-label="03 Open roles"
      aria-labelledby="roles-title"
      className={styles.section}
    >
      <div className={styles.head}>
        <h2 id="roles-title" className={styles.h2} data-split="" aria-label={openRoles.title}>
          <Words text={openRoles.title} />
        </h2>
        {showFilters && (
          <div role="group" aria-label="Filter by team" className={styles.filters}>
            {names.map((n) => {
              const count =
                n === openRoles.all ? roles.length : roles.filter((r) => r.team === n).length;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={team === n}
                  className={styles.pill}
                  onClick={() => setTeam(n)}
                >
                  <span className={styles.pillName}>{n}</span>
                  <span className={styles.count}>{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {roles.length > 0 ? (
        <ul className={styles.list} data-reveal="">
          {shown.map((r) => (
            <li key={`${r.t}-${r.team}`}>
              <a
                href={roleHref(r)}
                className={styles.role}
                onClick={() => track("careers_role_click", { role: r.t })}
              >
                <span className={styles.roleT}>{r.t}</span>
                <span className={styles.meta}>{r.team}</span>
                <span className={styles.meta}>{r.type}</span>
                <span aria-hidden="true" className={styles.go}>
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty} data-reveal="">
          <div className={styles.emptyMain}>
            <span className={styles.status}>
              <span aria-hidden="true" className={styles.statusDot} />
              {e.status}
            </span>
            <h3 className={styles.h3}>{e.title}</h3>
            <div className={styles.chips}>
              <span className={styles.chipsLabel}>{e.teamsLabel}</span>
              <ul className={styles.chipList}>
                {openRoles.teams.map((t) => (
                  <li key={t} className={styles.chip}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.emptyAside}>
            <p className={styles.lead}>{e.lead}</p>
            <ButtonLink href={e.href} arrow data-track="careers_introduce_click">
              {e.cta}
            </ButtonLink>
          </div>
        </div>
      )}
    </section>
  );
}
