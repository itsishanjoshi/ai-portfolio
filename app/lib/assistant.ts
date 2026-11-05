/*
 * The chat "brain". It matches the question to a topic and answers with text written from
 * the resume, plus a rich card. It runs entirely in the browser: no API key, no LLM, and it
 * can never say anything that is not in profile.ts.
 *
 * To add a topic: add an entry to `topics` (patterns are tested in order, first match wins).
 */
import { education, experience, profile, projects, publications, skills } from "./profile";

export type CardKind =
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "research"
  | "education"
  | "contact"
  | "resume";

export type Answer = { text: string; card?: CardKind; followUps: string[] };

type Topic = { match: RegExp; answer: () => Answer };

const [amity, plancover, aapki, cognizant] = experience;
const [insight, fer, sentiment] = projects;
const [pubEmotion, pubSleep, pubWatermark] = publications;
const [mtech, btech] = education;

const topics: Topic[] = [
  {
    match: /^\s*(thanks|thank you|thx|ty|cool|great|nice|awesome|ok|okay|got it)\b/,
    answer: () => ({
      text: "You're welcome! Anything else you'd like to know about my work?",
      followUps: ["What projects have you built?", "What research have you published?", "How can I contact you?"],
    }),
  },
  {
    match: /(hobb|free time|spare time|weekend|fun fact|salary|\bctc\b|compensation|expected pay|how old|\bage\b|married|family|birthday|religion|favou?rite)/,
    answer: () => ({
      text: "That isn't something I've put on my resume, so I'd rather answer it personally. Drop me an email and I'm happy to chat.",
      card: "contact",
      followUps: ["What do you do?", "What projects have you built?"],
    }),
  },
  {
    match: /(phone|mobile|call you|whatsapp|contact number|\bcall\b)/,
    answer: () => ({
      text: `My phone number is on my resume (you can download it below), but email is the quickest way to reach me: **${profile.email}**.`,
      card: "resume",
      followUps: ["How can I contact you?", "Who are you?"],
    }),
  },
  {
    match: /(why (should|would) (we|i|you)|what makes you|stand out|\bunique\b|your pitch|sell yourself|value (do|would) you)/,
    answer: () => ({
      text: `I work across the whole AI stack. I run the infrastructure (**two NVIDIA DGX A100 servers**, Kubernetes, **30+ concurrent workloads**), build and deploy LLM applications on it (a **multi-agent clinical decision-support platform** at **99%+ uptime**), and do published research (**${publications.length} peer-reviewed papers** in 2025). Before that I worked in pricing analytics, data-driven content and front-end engineering, so I'm used to turning model output into something a business can use.`,
      card: "about",
      followUps: ["Where have you worked?", "What research have you published?"],
    }),
  },
  {
    match: /(open to|available|availability|opportunit|freelance|relocat|notice period)/,
    answer: () => ({
      text: `I'm currently an AI Engineer at ${amity.org}. For opportunities or questions about availability, the best way to reach me is email: **${profile.email}**.`,
      card: "contact",
      followUps: ["What do you do?", "Can I see your resume?"],
    }),
  },
  {
    match: /\b(certif\w*|course|courses|udemy|iit delhi)\b/,
    answer: () => ({
      text: "I hold four certifications: **AI with Machine Learning** from IIT Delhi, the **NVIDIA Deep Learning Certificate Program**, and two from Udemy, **Power BI Masterclass** and **Machine Learning A-Z: AI, Python & R**.",
      card: "education",
      followUps: ["What did you study?", "What are your skills?"],
    }),
  },
  {
    match: /(clinical|decision[- ]support|multi[- ]?agent|ollama|healthcare|medical)/,
    answer: () => ({
      text: `At ${amity.org} I engineered and host a **multi-agent clinical decision-support platform** built with Ollama and Docker. It runs on an NVIDIA DGX A100 **MIG 7g.40gb** partition, and I've kept it at **99%+ uptime** while optimizing VRAM utilization.`,
      card: "experience",
      followUps: ["How do you manage the DGX A100 servers?", "What are your skills?"],
    }),
  },
  {
    match: /(dgx|a100|gpu|kubernetes|k8s|docker|grafana|\bmig\b|infra\w*|mlops|cluster management|pods?\b)/,
    answer: () => ({
      text: `I manage containerized AI research workloads across **two NVIDIA DGX A100 servers** with Kubernetes and Docker, covering pod lifecycle, GPU allocation, job scheduling and resource monitoring for **30+ concurrent AI workloads**. I also designed Kubernetes pod monitoring and automated fault-recovery workflows with **Grafana**, which reduced unresponsive-pod incidents and improved platform uptime.`,
      card: "skills",
      followUps: ["Tell me about the clinical decision-support platform", "Where have you worked?"],
    }),
  },
  {
    match: /(sleep)/,
    answer: () => ({
      text: `**${pubSleep.title}** (${pubSleep.venue}, ${pubSleep.publisher}). ${pubSleep.summary}`,
      card: "research",
      followUps: ["Tell me about your multimodal emotion recognition paper", "What projects have you built?"],
    }),
  },
  {
    match: /(watermark)/,
    answer: () => ({
      text: `**${pubWatermark.title}** (${pubWatermark.venue}, ${pubWatermark.publisher}). ${pubWatermark.summary}`,
      card: "research",
      followUps: ["What research have you published?", "What are your skills?"],
    }),
  },
  {
    match: /(cross-?modal|multi-?modal|bert|audio|spectrogram|emotion.*(paper|research|text)|(paper|research).*emotion)/,
    answer: () => ({
      text: `**${pubEmotion.title}**, published at ${pubEmotion.venue} (${pubEmotion.publisher}). ${pubEmotion.summary}`,
      card: "research",
      followUps: ["What other research have you published?", "Tell me about the facial emotion recognition project"],
    }),
  },
  {
    match: /(\bfer\b|fer-2013|facial|\bfaces?\b|vgg|resnet|computer vision)/,
    answer: () => ({
      text: `**${fer.title}**: ${fer.points.join(" ")}`,
      card: "projects",
      followUps: ["Tell me about your multimodal emotion recognition paper", "What are your skills?"],
    }),
  },
  {
    match: /(sentiment|restaurant|review|naive bayes|svm)/,
    answer: () => ({
      text: `**${sentiment.title}**: ${sentiment.points.join(" ")}`,
      card: "projects",
      followUps: ["What projects have you built?", "What are your skills?"],
    }),
  },
  {
    match: /(kpmg|pwc|minilm|insight|k-?means|clustering|esg|competitive)/,
    answer: () => ({
      text: `**${insight.title}**: ${insight.points.join(" ")}`,
      card: "projects",
      followUps: ["What projects have you built?", "What research have you published?"],
    }),
  },
  {
    match: /(publi|paper|research|scholar|doi|journal|conference)/,
    answer: () => ({
      text: `I have **${publications.length} peer-reviewed publications** from 2025: multimodal emotion recognition with BERT and CNN (Springer, ICCCNet), predictive modelling of sleep efficiency (IEEE, ICETM), and a hybrid approach to digital image watermarking (Springer, CRM2025).`,
      card: "research",
      followUps: ["Tell me about your multimodal emotion recognition paper", "What projects have you built?"],
    }),
  },
  {
    match: /(project|built|build|made|portfolio)/,
    answer: () => ({
      text: `Here are my key projects: an **LLM-driven workflow for competitive insight extraction** from KPMG and PwC reports, **facial emotion recognition** with VGG-16 and ResNet-50, and **restaurant review sentiment analysis**. Tap a card for the details.`,
      card: "projects",
      followUps: ["Tell me about the clinical decision-support platform", "What are your skills?"],
    }),
  },
  {
    match: /(plancover|pricing|insurance)/,
    answer: () => ({
      text: `From ${plancover.start} to ${plancover.end} I was a **${plancover.role}** at ${plancover.org}, ${plancover.place}. ${plancover.points[0]} I also applied Impact Factor metrics to claims MIS data to segment customers and flag high-risk policyholders, and worked with the tech team on a Quote Management System.`,
      card: "experience",
      followUps: ["What do you do at Amity University?", "What are your skills?"],
    }),
  },
  {
    match: /(aapki|content manager|edtech)/,
    answer: () => ({
      text: `From ${aapki.start} to ${aapki.end} I was **${aapki.role}** at ${aapki.org}. ${aapki.points.join(" ")}`,
      card: "experience",
      followUps: ["Where have you worked?", "What do you do at Amity University?"],
    }),
  },
  {
    match: /(cognizant|trainee|front-?end|web dev)/,
    answer: () => ({
      text: `I started my career as a **${cognizant.role}** at ${cognizant.org}, ${cognizant.place} (${cognizant.start} – ${cognizant.end}). ${cognizant.points.join(" ")}`,
      card: "experience",
      followUps: ["Where have you worked?", "What do you do at Amity University?"],
    }),
  },
  {
    match: /(educat|qualif|study|studied|degree|m\.?tech|b\.?tech|cgpa|gpa|grade|school|college|\bvit\b|vellore|master|bachelor)/,
    answer: () => ({
      text: `I hold an **${mtech.degree}** from ${mtech.school}, ${mtech.place} (${mtech.start} – ${mtech.end}, ${mtech.grade}), and a **${btech.degree}** from ${btech.school}, ${btech.place} (${btech.start} – ${btech.end}, ${btech.grade}).`,
      card: "education",
      followUps: ["Which certifications do you have?", "What research have you published?"],
    }),
  },
  {
    match: /(skill|stack|\btech\b|technolog|tool|framework|language|python|pytorch|tensorflow|\bknow\b|expert|good at|strength|strong|best at|\bnlp\b|machine learning|deep learning|\bllms?\b)/,
    answer: () => ({
      text: "My toolkit spans **Generative AI & NLP** (LLM applications, multi-agent AI, Ollama, BERT, MiniLM), **machine learning** (Scikit-learn), **deep learning** (PyTorch, TensorFlow, CNNs, transfer learning, cross-modal attention), and **MLOps** (Docker, Kubernetes, NVIDIA DGX A100, Grafana, Streamlit). I also work with SQL, Power BI and Excel for analytics.",
      card: "skills",
      followUps: ["What projects have you built?", "How do you manage the DGX A100 servers?"],
    }),
  },
  {
    match: /(amity|\bcurrent\w*|\bnow\b|\btoday\b|\bpresent\b|day job|ai engineer|what do you do|for a living|profession|occupation|working on|position|designation|job title|\bjob\b)/,
    answer: () => ({
      text: `Since ${amity.start} I've been an **${amity.role}** at ${amity.org}, ${amity.place}. I run AI research infrastructure on two NVIDIA DGX A100 servers, host a multi-agent clinical decision-support platform, develop models in PyTorch and TensorFlow, and deploy Streamlit AI/LLM apps for industry demos and research workflows.`,
      card: "experience",
      followUps: ["Tell me about the clinical decision-support platform", "How do you manage the DGX A100 servers?"],
    }),
  },
  {
    match: /(experience|work|job|career|employ|company|companies|role|internship|worked)/,
    answer: () => ({
      text: `I've worked across four roles: **AI Engineer** at Amity University (current), **Product Pricing Analyst** at PlanCover, **Content Manager** at Aapki Education, and **Programmer Analyst Trainee** at Cognizant. Tap a role to expand it.`,
      card: "experience",
      followUps: ["What do you do at Amity University?", "What projects have you built?"],
    }),
  },
  {
    match: /(resume|\bcv\b|download)/,
    answer: () => ({
      text: "Sure, here's my resume as a PDF.",
      card: "resume",
      followUps: ["How can I contact you?", "Where have you worked?"],
    }),
  },
  {
    match: /(contact|email|mail|reach|hire|linkedin|github|connect|touch|social)/,
    answer: () => ({
      text: `The best way to reach me is email: **${profile.email}**. You can also find me on LinkedIn, GitHub and Google Scholar.`,
      card: "contact",
      followUps: ["Can I see your resume?", "Who are you?"],
    }),
  },
  {
    match: /(where|location|based|live|city|noida|india)/,
    answer: () => ({
      text: `I'm based in **${profile.location}**.`,
      card: "contact",
      followUps: ["What do you do at Amity University?", "How can I contact you?"],
    }),
  },
  {
    match: /(\bwho\b|\bname\b|about|yourself|introduce|hello|\bhi\b|\bhey\b|focus|background|summary|tell me)/,
    answer: () => ({
      text: `Hi, I'm **${profile.name}**, an AI Engineer and researcher based in ${profile.location}. ${profile.summary.replace(/^AI Engineer with/, "I have")}`,
      card: "about",
      followUps: ["Where have you worked?", "What research have you published?"],
    }),
  },
];

/* ---------- "Do you know X?" lookups ---------- */

const TECH_QUESTION =
  /\b(?:do you know|do you use|have you (?:ever )?(?:used|worked with|worked on)|are you familiar with|familiar with|experience (?:with|in)|can you (?:use|code in|work with)|proficient (?:in|with)|skilled in|know how to use)\s+(.+?)[\s?.!]*$/i;

/* Short names people type, mapped to how the resume spells them. */
const aliases: Record<string, string> = {
  llm: "LLM applications",
  llms: "LLM applications",
  "large language models": "LLM applications",
  genai: "Generative AI & NLP",
  "generative ai": "Generative AI & NLP",
  k8s: "Kubernetes",
  sklearn: "Scikit-learn",
  "scikit learn": "Scikit-learn",
  ml: "Machine Learning",
  dl: "Deep Learning",
  cv: "Computer Vision",
  powerbi: "Power BI",
  excel: "MS Excel",
  html: "HTML/CSS",
  css: "HTML/CSS",
  js: "JavaScript",
  cnn: "CNNs",
  transformer: "BERT",
  transformers: "BERT",
  agents: "Multi-agent AI",
  "ai agents": "Multi-agent AI",
};

/* Every skill-like term in the resume: skills, the focus list, and the stacks of roles and projects. */
const vocabulary = Array.from(
  new Set([
    ...skills.flatMap((g) => [g.title, ...g.items]),
    ...profile.focus,
    ...experience.flatMap((e) => e.stack),
    ...projects.flatMap((p) => p.stack),
  ]),
);

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const mentions = (text: string, term: string) => new RegExp(`(^|[^a-z0-9])${escape(term.toLowerCase())}($|[^a-z0-9])`).test(text.toLowerCase());

function techAnswer(rawTerm: string): Answer | null {
  const term = rawTerm.toLowerCase().replace(/^(a|an|the|any|some)\s+/, "").trim();
  if (!term) return null;
  const resolved = aliases[term] ?? vocabulary.find((v) => v.toLowerCase() === term) ?? vocabulary.find((v) => mentions(term, v));

  if (resolved) {
    const groups = skills.filter((g) => g.title === resolved || g.items.includes(resolved)).map((g) => g.title);
    const roles = experience
      .filter((e) => e.stack.includes(resolved) || e.points.some((p) => mentions(p, resolved)))
      .map((e) => `${e.role} at ${e.org}`);
    const work = projects.filter((p) => p.stack.includes(resolved) || mentions(p.category, resolved) || p.points.some((x) => mentions(x, resolved)));

    const area = skills.find((g) => g.title === resolved);
    const parts = [
      area
        ? `Yes. **${resolved}** is one of my core skill areas: ${area.items.slice(0, 5).join(", ")}.`
        : `Yes. **${resolved}** is on my resume${groups.length ? `, under ${groups.join(" and ")}` : ""}.`,
    ];
    if (roles.length) parts.push(`I've used it as ${roles.join(" and as ")}.`);
    if (work.length) parts.push(`It's also part of ${work.length > 1 ? "my projects" : "my project"} ${work.map((p) => `**${p.title}**`).join(" and ")}.`);
    return {
      text: parts.join(" "),
      card: work.length && !roles.length ? "projects" : roles.length ? "experience" : "skills",
      followUps: ["What are your skills?", "What projects have you built?"],
    };
  }

  // not a resume term: let a topic answer it if the term itself is one (e.g. "gpu", "research")
  for (const t of topics) if (t.match.test(term)) return null;

  return {
    text: `**${rawTerm.trim()}** isn't on my resume, so I won't claim it. My core stack is Python, PyTorch, TensorFlow, Scikit-learn, Docker and Kubernetes, and on the web side I've used HTML/CSS and JavaScript.`,
    card: "skills",
    followUps: ["What are your skills?", "What projects have you built?"],
  };
}

export function answer(question: string): Answer {
  const q = question.toLowerCase();
  const tech = question.trim().match(TECH_QUESTION);
  if (tech) {
    const t = techAnswer(tech[1]);
    if (t) return t;
    const term = tech[1].toLowerCase();
    for (const topic of topics) if (topic.match.test(term)) return topic.answer();
  }
  for (const t of topics) if (t.match.test(q)) return t.answer();
  return {
    text: "I can only answer from my resume, and I couldn't find that in it. Try asking about my experience, projects, skills, research, education or how to contact me.",
    followUps: ["Who are you?", "What projects have you built?", "What research have you published?"],
  };
}
