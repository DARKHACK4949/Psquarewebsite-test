"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactIndustries,
  enquiryTypes,
  FILE_ACCEPT,
  FILE_MAX_BYTES,
  MESSAGE_MAX,
  products,
  teamSizes,
} from "@/content/contact";
import {
  contactSchema,
  type ContactInput,
  type EnquiryType,
  type ProductKey,
} from "@/lib/contact-schema";
import { track } from "@/lib/analytics";
import { countries, dialFor } from "@/content/countries";
import { CONTACT_EMAIL, routesFor } from "@/lib/site";
import { regions, type Region } from "@/lib/region";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import styles from "./ContactForm.module.css";

type HashState = { type: EnquiryType; products: ProductKey[] };

function fromHash(): HashState {
  const h = window.location.hash.slice(1);
  if (products.some((p) => p.k === h)) return { type: "products", products: [h as ProductKey] };
  if (enquiryTypes.some((t) => t.k === h)) return { type: h as EnquiryType, products: [] };
  return { type: "bespoke", products: [] };
}

const blank = (
  country: string,
  h: HashState = { type: "bespoke", products: [] },
): ContactInput => ({
  type: h.type,
  industry: "",
  products: h.products,
  size: "",
  name: "",
  email: "",
  company: "",
  country: country as ContactInput["country"],
  phone: "",
  message: "",
  company_website: "",
});

function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** The visitor's country from their browser languages ("en-GB" → "GB"), if we list it. */
function browserCountry() {
  for (const tag of navigator.languages ?? [navigator.language]) {
    try {
      const r = new Intl.Locale(tag).maximize().region;
      if (r && countries.some((c) => c[0] === r)) return r;
    } catch {}
  }
  return null;
}

export function ContactForm({ region }: { region: Region }) {
  const { defaultCountry } = regions[region];
  const [sent, setSent] = useState<{ name: string; email: string; next: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileErr, setFileErr] = useState(false);
  const [sendErr, setSendErr] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const radios = useRef<(HTMLButtonElement | null)[]>([]);
  const { scrollTo } = useSmoothScroll();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: blank(defaultCountry),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const type = useWatch({ control, name: "type" });
  const picked = useWatch({ control, name: "products" });
  const industry = useWatch({ control, name: "industry" });
  const country = useWatch({ control, name: "country" });
  const message = useWatch({ control, name: "message" });
  const size = useWatch({ control, name: "size" });
  const idx = Math.max(
    0,
    enquiryTypes.findIndex((t) => t.k === type),
  );
  const t = enquiryTypes[idx];

  // Global edition: start the phone picker on the visitor's own country.
  useEffect(() => {
    if (region === "ca") return;
    const c = browserCountry();
    if (c) setValue("country", c as ContactInput["country"]);
  }, [region, setValue]);

  // Deep links (#products, #sline-sales, ...) pre-select the form.
  useEffect(() => {
    const apply = () => {
      const h = fromHash();
      setValue("type", h.type);
      if (h.products.length) setValue("products", h.products);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [setValue]);

  const pickType = useCallback(
    (k: EnquiryType) => {
      if (k === type) return;
      clearErrors();
      setValue("type", k);
      try {
        history.replaceState(null, "", k === "bespoke" ? window.location.pathname : `#${k}`);
      } catch {}
      track("contact_type_change", { type: k });
    },
    [type, clearErrors, setValue],
  );

  const onTypeKey = (e: React.KeyboardEvent) => {
    const d =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!d) return;
    e.preventDefault();
    const n = (idx + d + enquiryTypes.length) % enquiryTypes.length;
    pickType(enquiryTypes[n].k);
    radios.current[n]?.focus();
  };

  const toggleProduct = (k: ProductKey) => {
    const cur = picked ?? [];
    setValue("products", cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k], {
      shouldValidate: !!errors.products,
    });
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > FILE_MAX_BYTES) {
      setFileErr(true);
      e.target.value = "";
      return;
    }
    setFileErr(false);
    setFile(f);
  };
  const clearFile = () => {
    if (fileRef.current) fileRef.current.value = "";
    setFileErr(false);
    setFile(null);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSendErr(false);
    // Honeypot: silently drop.
    if (values.company_website) return;
    const body = new FormData();
    body.set("payload", JSON.stringify(values));
    if (file && t.file) body.set("file", file);
    try {
      const res = await fetch("/api/contact", { method: "POST", body });
      if (res.status !== 200) throw new Error(String(res.status));
      track("contact_submit_success", { type: values.type });
      setSent({ name: values.name, email: values.email.trim(), next: t.next });
      scrollTo(0);
    } catch (err) {
      track("contact_submit_error", { type: values.type, reason: String(err) });
      setSendErr(true);
    }
  });

  const again = () => {
    reset(blank(country, fromHash()));
    clearFile();
    setSent(null);
  };

  const field = (name: "name" | "email" | "message") => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-err` : undefined,
    className: cx(
      name === "message" ? styles.textarea : styles.input,
      !!errors[name] && styles.invalid,
    ),
  });

  return (
    <div className={styles.card}>
      {sent ? (
        <div role="status" className={styles.success}>
          <span aria-hidden="true" className={styles.check}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <h2 className={styles.successH}>
            Thanks, {sent.name.trim().split(" ")[0] || "there"}. <span>We’ve got it.</span>
          </h2>
          <p className={styles.successP}>
            We’ll reply to {sent.email} {sent.next}
          </p>
          <button type="button" onClick={again} className={styles.again}>
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className={styles.form} aria-label="Start a project">
          <div className={styles.group}>
            <span id="type-l" className={styles.label}>
              I’m interested in
            </span>
            <div
              role="radiogroup"
              aria-labelledby="type-l"
              onKeyDown={onTypeKey}
              className={styles.segment}
            >
              <span
                aria-hidden="true"
                className={styles.knob}
                style={{ transform: `translateX(${idx * 100}%)` }}
              />
              {enquiryTypes.map((x, i) => (
                <button
                  key={x.k}
                  ref={(el) => {
                    radios.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={i === idx}
                  tabIndex={i === idx ? 0 : -1}
                  onClick={() => pickType(x.k)}
                  className={styles.segBtn}
                >
                  <span className={styles.long}>{x.name}</span>
                  <span className={styles.short} aria-hidden="true">
                    {x.short}
                  </span>
                </button>
              ))}
            </div>
            <span key={t.k} aria-live="polite" className={styles.hint}>
              {t.hint}
            </span>
          </div>

          {type === "bespoke" && (
            <div role="radiogroup" aria-labelledby="ind-l" className={styles.group}>
              <span id="ind-l" className={styles.label}>
                Your industry <span className={styles.opt}>(optional)</span>
              </span>
              <div className={styles.pills}>
                {contactIndustries.map((z) => (
                  <button
                    key={z}
                    type="button"
                    role="radio"
                    aria-checked={industry === z}
                    onClick={() => setValue("industry", industry === z ? "" : z)}
                    className={styles.pill}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>
          )}

          {type === "products" && (
            <>
              <div
                role="group"
                aria-labelledby="prod-l"
                aria-describedby={errors.products ? "prod-err" : undefined}
                className={styles.group}
              >
                <div className={styles.prodHead}>
                  <span id="prod-l" className={styles.label}>
                    Which product?
                  </span>
                  <span className={styles.prodNote}>
                    {picked?.length ? `${picked.length} selected` : "Pick one or more"}
                  </span>
                </div>
                <div className={styles.prodGrid}>
                  {products.map((p) => {
                    const on = (picked ?? []).includes(p.k);
                    return (
                      <button
                        key={p.k}
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        onClick={() => toggleProduct(p.k)}
                        className={styles.prod}
                      >
                        <span className={styles.prodText}>
                          <span className={styles.prodName}>{p.name}</span>
                          <span className={styles.prodTag}>{p.tag}</span>
                        </span>
                        <span aria-hidden="true" className={styles.tick}>
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.products && (
                  <span id="prod-err" role="alert" className={styles.error}>
                    {errors.products.message}
                  </span>
                )}
              </div>
              <div role="radiogroup" aria-labelledby="size-l" className={styles.group}>
                <span id="size-l" className={styles.label}>
                  Team size <span className={styles.opt}>(optional)</span>
                </span>
                <div className={styles.pills}>
                  {teamSizes.map((z) => (
                    <button
                      key={z}
                      type="button"
                      role="radio"
                      aria-checked={size === z}
                      onClick={() => setValue("size", size === z ? "" : z)}
                      className={cx(styles.pill, styles.num)}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className={styles.fields}>
            <label className={styles.field}>
              <span className={styles.label}>Full name</span>
              <input
                type="text"
                autoComplete="name"
                required
                placeholder="Your full name"
                {...field("name")}
                {...register("name")}
              />
              {errors.name && (
                <span id="name-err" role="alert" className={styles.error}>
                  {errors.name.message}
                </span>
              )}
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Work email</span>
              <input
                type="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
                {...field("email")}
                {...register("email")}
              />
              {errors.email && (
                <span id="email-err" role="alert" className={styles.error}>
                  {errors.email.message}
                </span>
              )}
            </label>
            <label className={styles.field}>
              <span className={styles.label}>
                Company <span className={styles.opt}>(optional)</span>
              </span>
              <input
                type="text"
                autoComplete="organization"
                placeholder="Company name"
                className={styles.input}
                {...register("company")}
              />
            </label>
            <div className={styles.field}>
              <span id="ph-l" className={styles.label}>
                Phone <span className={styles.opt}>(optional)</span>
              </span>
              <div className={styles.phone}>
                <label className={styles.dial}>
                  <span className="sr-only">Country code</span>
                  {/* The native picker sits invisibly over a compact "CA +1" face. */}
                  <span aria-hidden="true" className={`${styles.input} ${styles.dialFace}`}>
                    <span className={styles.dialIso}>{country}</span> {dialFor(country)}
                  </span>
                  <select {...register("country")}>
                    {countries.map(([iso, name, dial]) => (
                      <option key={iso} value={iso}>
                        {name} ({dial})
                      </option>
                    ))}
                  </select>
                  <span aria-hidden="true" className={styles.caret} />
                </label>
                <input
                  type="tel"
                  aria-labelledby="ph-l"
                  autoComplete="tel-national"
                  placeholder={region === "ca" ? "416 555 0142" : "Phone number"}
                  className={styles.input}
                  {...register("phone")}
                />
              </div>
            </div>
          </div>

          <label className={styles.field}>
            <span className={styles.msgHead}>
              <span className={styles.label}>
                {t.msg} {!t.req && <span className={styles.opt}>(optional)</span>}
              </span>
              <span aria-live="polite" className={styles.count}>
                {(message ?? "").length} / {MESSAGE_MAX}
              </span>
            </span>
            <textarea
              rows={3}
              maxLength={MESSAGE_MAX}
              placeholder={t.ph}
              required={t.req}
              {...field("message")}
              {...register("message")}
            />
            {errors.message && (
              <span id="message-err" role="alert" className={styles.error}>
                {errors.message.message}
              </span>
            )}
          </label>

          <input
            ref={fileRef}
            type="file"
            name="brief"
            accept={FILE_ACCEPT}
            onChange={onFile}
            hidden
            aria-label="Attach a file"
          />
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className={styles.honeypot}
            {...register("company_website")}
          />

          <div className={styles.footer}>
            {t.file &&
              (file ? (
                <span className={styles.fileChip}>
                  <span className={styles.fileName}>{file.name}</span>
                  <button
                    type="button"
                    aria-label="Remove file"
                    onClick={clearFile}
                    className={styles.fileX}
                  >
                    ×
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={styles.fileAdd}
                >
                  <span aria-hidden="true">+</span> Add a file{" "}
                  <span className={styles.opt}>(optional)</span>
                </button>
              ))}
            <button
              type="submit"
              className={styles.submit}
              style={{ opacity: isSubmitting ? 0.7 : 1 } as CSSProperties}
              aria-disabled={isSubmitting || undefined}
            >
              {isSubmitting ? "Sending…" : t.sub}
            </button>
          </div>
          {fileErr && (
            <span role="alert" className={styles.error}>
              That file is over 10 MB. Try a smaller one or email it to us.
            </span>
          )}
          {sendErr && (
            <span role="alert" className={styles.error}>
              We couldn’t send that just now. Please try again, or email {CONTACT_EMAIL}.
            </span>
          )}
          <span className={styles.privacy}>
            We only use your details to reply.{" "}
            <a href={routesFor(region).privacy}>Privacy policy</a>
          </span>
        </form>
      )}
    </div>
  );
}
