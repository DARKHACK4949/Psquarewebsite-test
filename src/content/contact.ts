export const contactHero = {
  eyebrow: "Get in touch",
  title: ["Tell us how your", "business works."],
  lead: "See a product, start a custom build or get a second opinion. Every enquiry is read by a person.",
};

export const enquiryTypes = [
  {
    k: "bespoke",
    name: "Bespoke development",
    short: "Bespoke",
    hint: "Custom software built around how your business runs.",
    msg: "What do you need built?",
    ph: "We track site requests in spreadsheets and approvals take days.",
    next: "to set up a first consultation.",
    sub: "Send enquiry",
    aside:
      "A member of our team reads every enquiry and replies personally. On the first call we map how your operation runs today and where it slows down. Then we send a clear proposal.",
    req: true,
    file: true,
  },
  {
    k: "products",
    name: "Our products",
    short: "Products",
    hint: "See one of our platforms running on a workflow like yours.",
    msg: "Anything we should know before the demo?",
    ph: "We dispatch technicians by phone and track visits on paper.",
    next: "to schedule your demo.",
    sub: "Book a demo",
    aside:
      "We set up a live walkthrough shaped around how your team works today, then answer questions on setup, migration and pricing.",
    req: false,
    file: false,
  },
  {
    k: "consulting",
    name: "Software consultancy",
    short: "Consultancy",
    hint: "Independent advice on systems, architecture and what to build next.",
    msg: "What should we help you think through?",
    ph: "We are deciding between extending our ERP and building a field app.",
    next: "to arrange a consultation.",
    sub: "Request a consultation",
    aside:
      "A senior consultant reviews your note, then meets you to work through the question, the options and the trade-offs.",
    req: true,
    file: true,
  },
] as const;

export const products = [
  {
    k: "sline-sales",
    name: "Sline Sales",
    ind: "Sales",
    d: "Leads, quotes and orders for elevator companies.",
  },
  {
    k: "arcgrow",
    name: "ArcGrow",
    ind: "Studios",
    d: "Projects, teams and deadlines for design studios.",
  },
  {
    k: "sline-services",
    name: "Sline Services",
    ind: "Service",
    d: "Breakdowns, dispatch and visits for elevator service.",
  },
] as const;

export const teamSizes = ["1-10", "11-50", "51-200", "200+"] as const;
export const contactIndustries = [
  "Field service management",
  "Architecture",
  "Realtors & real estate",
  "Something else",
] as const;
export const dialCodes = ["+1", "+44", "+61", "+91", "+971"] as const;

export const FILE_MAX_BYTES = 10 * 1024 * 1024;
export const FILE_ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.key,.png,.jpg,.jpeg";
