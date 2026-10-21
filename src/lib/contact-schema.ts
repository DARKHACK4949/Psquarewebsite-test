import { z } from "zod";
import { contactIndustries, dialCodes, enquiryTypes, products, teamSizes } from "@/content/contact";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type EnquiryType = (typeof enquiryTypes)[number]["k"];
export type ProductKey = (typeof products)[number]["k"];

const typeKeys = enquiryTypes.map((t) => t.k) as [EnquiryType, ...EnquiryType[]];
const productKeys = products.map((p) => p.k) as [ProductKey, ...ProductKey[]];

export const messageRequired = (type: EnquiryType) =>
  enquiryTypes.find((t) => t.k === type)?.req ?? true;

/**
 * Shared by the form (React Hook Form resolver) and the route handler, so the
 * client and server enforce the same rules. Messages match the design copy.
 */
export const contactSchema = z
  .object({
    type: z.enum(typeKeys),
    industry: z.union([z.enum(contactIndustries), z.literal("")]).optional(),
    products: z.array(z.enum(productKeys)),
    size: z.union([z.enum(teamSizes), z.literal("")]).optional(),
    name: z.string().trim().min(1, "Please add your name.").max(200),
    email: z.string().trim().max(320).regex(EMAIL_RE, "Please add a valid email."),
    company: z.string().trim().max(200).optional(),
    dial: z.enum(dialCodes),
    phone: z.string().trim().max(40).optional(),
    message: z.string().trim().max(5000).optional(),
    company_website: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (messageRequired(v.type) && (v.message ?? "").trim().length < 8) {
      ctx.addIssue({
        code: "custom",
        path: ["message"],
        message: "A sentence or two helps us prepare.",
      });
    }
    if (v.type === "products" && v.products.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["products"],
        message: "Pick at least one product so we can prepare the right demo.",
      });
    }
  });

export type ContactInput = z.input<typeof contactSchema>;
export type ContactValues = z.output<typeof contactSchema>;
