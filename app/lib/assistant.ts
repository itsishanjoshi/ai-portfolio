/*
 * The chat "brain". It matches the question to a topic and answers with text written from
 * the resume, plus a rich card. It runs entirely in the browser: no API key, no LLM, and it
 * can never say anything that is not in profile.ts.
 *
 * To add a topic: add an entry to `topics` (patterns are tested in order, first match wins).
 */
import { education, experience, instagramHandle, interests, profile, projects, publications, skills } from "./profile";

export type CardKind =
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "research"
  | "education"
  | "contact"
  | "resume"
  | "role"
  | "interests"
  | "instagram";

/* `focus` opens one role in the experience card (index into `experience`). */
export type Answer = { text: string; card?: CardKind; focus?: number; followUps: string[] };

/* `answer` receives the lower-cased question, for topics that tailor the reply to it. */
type Topic = { match: RegExp; answer: (q: string) => Answer };

const THANKS = /^\s*(thanks|thank you|thx|ty|cool|great|nice|awesome|ok|okay|got it)(\s+(a lot|so much|very much|again|you))*[\s.!]*$/;
const LEADING_FILLER = /^\s*(?:(?:thanks|thank you|thx|ty|cool|great|nice|awesome|ok|okay|got it|alright|so|and)\b[\s,.!:-]*)+/i;

const interestList = (() => {
  const names = interests.map((i) => i.name.toLowerCase());
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
})();

/* Which interest a question names, if any ("do you play chess?" -> Chess). */
const interestWords: [RegExp, string][] = [
  [/cricket/, "Cricket"],
  [/chess/, "Chess"],
  [/cook|food|recipe|kitchen/, "Cooking"],
  [/music|song|listen/, "Listening to music"],
];

const [amity, plancover, aapki, cognizant] = experience;
const [, insight, fer, sentiment] = projects;
const [pubEmotion, pubSleep, pubWatermark] = publications;
const [mtech, btech] = education;

const clinicalText = `At ${amity.org} I engineered and host a **multi-agent clinical decision-support platform** built with Ollama and Docker. It runs on an NVIDIA DGX A100 **MIG 7g.40gb** partition, and I've kept it at **99%+ uptime** while optimizing VRAM utilization.`;

const topics: Topic[] = [
  {
    // only a message that is nothing but thanks; "ok, what's your email?" is a real question
    match: THANKS,
    answer: () => ({
      text: "You're welcome! Anything else you'd like to know about my work?",
      followUps: ["What projects have you built?", "What research have you published?", "How can I contact you?"],
    }),
  },
  {
    // "research interests" belongs to the research topic, not hobbies
    match: /(hobb|(?<!research )interests\b|free time|spare time|weekend|for fun|\bfun\b|outside (of )?work|pastime|passion|cricket|chess|\bcook|music|\bsongs?\b|\bsports?\b|\bdo you play\b)/,
    answer: (q) => {
      const named = interestWords.find(([re]) => re.test(q))?.[1];
      // "which / what kind / favourite ..." asks for specifics that aren't on the site
      const wantsDetail = /(favou?rite|which|what kind|what type|what sort|\bwho\b|\bbest\b)/.test(q);
      return {
        text:
          named && wantsDetail
            ? `**${named}** is one of my interests! For the details, connect with me on **Instagram (${instagramHandle})** and I'm happy to talk about it there.`
            : named
              ? `Yes! **${named}** is one of my interests. Outside work I enjoy ${interestList}.`
              : `Outside work I enjoy **${interestList}**.`,
        card: named && wantsDetail ? "instagram" : "interests",
        followUps: ["What do you do?", "What projects have you built?"],
      };
    },
  },
  {
    match: /(instagram|\binsta\b)/,
    answer: () => ({
      text: `Yes! I'm **${instagramHandle}** on Instagram. That's the best place to reach me for anything personal.`,
      card: "instagram",
      followUps: ["What do you do for fun?", "How can I contact you?"],
    }),
  },
  {
    match: /\b(this|the) (web)?site\b|\bthis (chat|chatbot|bot|portfolio|page|assistant)\b|\bare you (a |an )?(real |actual |really )*(ai|bot|robot|human|person|llm|chatbot|chatgpt|gpt)\b/,
    answer: () => ({
      text: "This site is built with **Next.js, React and Tailwind CSS**. The chat isn't an LLM: it matches your question to a topic and replies with answers written from my resume, so it only says what's in there.",
      followUps: ["What are your skills?", "What projects have you built?"],
    }),
  },
  {
    match: /\b(switch\w*|moved?|transition\w*|shift\w*|chang\w*|pivot\w*)\b.*\b(ai|data|ml|tech|career|civil)\b|career (change|switch|path)|from civil/,
    answer: () => ({
      text: `I started with a **${btech.degree}**, then moved through front-end work at Cognizant, data-driven content at ${aapki.org} and pricing analytics at ${plancover.org}. An **${mtech.degree}** took me into AI, and I've been an ${amity.role} since ${amity.start}.`,
      card: "experience",
      followUps: ["What do you do at Amity University?", "What did you study?"],
    }),
  },
  {
    match: /\bwhy\b.*\b(leave|leaving|left|quit)\b|reason for leaving/,
    answer: () => ({
      text: `I'd rather discuss that directly. Drop me an email at **${profile.email}** and I'm happy to talk.`,
      card: "contact",
      followUps: ["Where have you worked?", "What do you do?"],
    }),
  },
  {
    match: /\b(book|schedule|set up|arrange)\b.*\b(call|meeting|chat|interview|time|slot)\b|\b(meeting|interview)\b|\bcan (we|i) meet\b/,
    answer: () => ({
      text: `The easiest way to set up a call is email: **${profile.email}**. Let me know what you'd like to talk about.`,
      card: "contact",
      followUps: ["Can I see your resume?", "Where have you worked?"],
    }),
  },
  {
    match: /(open to|available|availability|opportunit|freelance|relocat|notice period|\bremote\b|(willing|able|ready) to travel|travel for work|looking for|next (role|step|job))/,
    answer: () => ({
      text: `I'm currently an AI Engineer at ${amity.org}. For opportunities or questions about availability, the best way to reach me is email: **${profile.email}**.`,
      card: "contact",
      followUps: ["What do you do?", "Can I see your resume?"],
    }),
  },
  {
    match: /(challeng|hardest|difficult|\btough\b|problems? (did|have) you)/,
    answer: () => ({
      text: `Two from my current role: keeping a **multi-agent clinical platform** at **99%+ uptime** while optimizing VRAM on a single MIG partition, and reducing unresponsive pods across **30+ concurrent AI workloads**, which I tackled with Grafana monitoring and automated fault recovery.`,
      card: "role",
      followUps: ["Tell me about the clinical decision-support platform", "How do you manage the DGX A100 servers?"],
    }),
  },
  {
    match: /(favou?rite|best|biggest|proudest|main|top|most \w+) (\w+ )?(project|work|achievement|accomplishment|build|thing)|proud(est)? of|\bachievements?\b|accomplish|shipped/,
    answer: () => ({
      text: `The one I'd point to first is my multi-agent clinical platform. ${clinicalText}`,
      card: "projects",
      followUps: ["How do you manage the DGX A100 servers?", "What research have you published?"],
    }),
  },
  {
    match: /favou?rite.*(language|framework|tool|stack|library|model)/,
    answer: () => ({
      text: "Most of my work is in **Python**, with **PyTorch** and **TensorFlow** for models and **Docker** and **Kubernetes** to deploy them.",
      card: "skills",
      followUps: ["What projects have you built?", "What are your skills?"],
    }),
  },
  {
    match: /\b(how (much|long)|how many years|years? of)\b.*\b(experience|working)\b/,
    answer: () => ({
      text: `I've been working since **${cognizant.start}**, across four roles, and I've been an **${amity.role}** at ${amity.org} since ${amity.start}.`,
      card: "experience",
      followUps: ["What do you do at Amity University?", "What projects have you built?"],
    }),
  },
  {
    match: /(github|source code|\byour code\b|\brepos?\b|repositor|code samples?)/,
    answer: () => ({
      text: "You'll find my code on **GitHub**. The link is on the card below, along with LinkedIn and Google Scholar.",
      card: "contact",
      followUps: ["What projects have you built?", "What research have you published?"],
    }),
  },
  {
    // personal questions go to Instagram
    match: /(personal(?! (projects?|work|website|site|portfolio))|fun fact|how old|\bage\b|\bdob\b|birthday|\bborn\b|married|marriage|\bsingle\b|relationship|girlfriend|boyfriend|wife|husband|\b(your|a|life) partner\b|kids|children|family|parents|siblings|religion|zodiac|hometown|grew up|favou?rite|\btravel|movies?|films?|\bbooks?\b|\bpets?\b|\bdogs?\b|\bcats?\b|\bgym\b|fitness|diet|vegetarian|weekend plans)/,
    answer: () => ({
      text: `That's a more personal question. I keep this site about my work, so for personal stuff, connect with me on **Instagram (${instagramHandle})** and I'm happy to chat there!`,
      card: "instagram",
      followUps: ["What do you do for fun?", "What do you do?"],
    }),
  },
  {
    // salary and similar are professional: email
    match: /(salary|\bctc\b|compensation|expected pay|pay expectation)/,
    answer: () => ({
      text: `I'd rather discuss that directly. Drop me an email at **${profile.email}** and I'm happy to talk.`,
      card: "contact",
      followUps: ["What do you do?", "Can I see your resume?"],
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
      text: clinicalText,
      card: "projects",
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
    match: /sleep (efficien|paper|model|research|predict|study|project)|(paper|research|publication|study|project|model).*\bsleep\b/,
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
    match: /(cross-?modal|multi-?modal|\bbert\b|\bmeld\b|audio|spectrogram|emotion.*(paper|research|text)|(paper|research).*emotion)/,
    answer: () => ({
      text: `**${pubEmotion.title}**, published at ${pubEmotion.venue} (${pubEmotion.publisher}). ${pubEmotion.summary}`,
      card: "research",
      followUps: ["What other research have you published?", "Tell me about the facial emotion recognition project"],
    }),
  },
  {
    match: /(\bfer\b|facial|\bfaces\b|face (recognition|emotion|detection)|vgg|resnet|computer vision|\bemotion\b)/,
    answer: () => ({
      text: `**${fer.title}**: ${fer.points.join(" ")}`,
      card: "projects",
      followUps: ["Tell me about your multimodal emotion recognition paper", "What are your skills?"],
    }),
  },
  {
    match: /(sentiment|restaurant|reviews? (analysis|classif)|naive bayes|svm)/,
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
    match: /(publi|paper|research|scholar|\bdoi\b|journal|conference)/,
    answer: () => ({
      text: `I have **${publications.length} peer-reviewed publications** from 2025: multimodal emotion recognition with BERT and CNN (Springer, ICCCNet), predictive modelling of sleep efficiency (IEEE, ICETM), and a hybrid approach to digital image watermarking (Springer, CRM2025).`,
      card: "research",
      followUps: ["Tell me about your multimodal emotion recognition paper", "What projects have you built?"],
    }),
  },
  {
    match: /(project|built|build|made|portfolio)/,
    answer: () => ({
      text: `Here are my key projects: a **multi-agent clinical decision-support platform**, an **NLP workflow for competitive insight extraction** from KPMG and PwC reports, **facial emotion recognition** with VGG-16 and ResNet-50, and **restaurant review sentiment analysis**. Tap a card for the details.`,
      card: "projects",
      followUps: ["Tell me about the facial emotion recognition project", "What are your skills?"],
    }),
  },
  {
    match: /(plancover|pricing|insurance)/,
    answer: () => ({
      text: `From ${plancover.start} to ${plancover.end} I was a **${plancover.role}** at ${plancover.org}, ${plancover.place}. ${plancover.points[0]} I also applied Impact Factor metrics to claims MIS data to segment customers and flag high-risk policyholders, and worked with the tech team on a Quote Management System.`,
      card: "experience",
      focus: 1,
      followUps: ["What do you do at Amity University?", "What are your skills?"],
    }),
  },
  {
    match: /(aapki|content manager|edtech)/,
    answer: () => ({
      text: `From ${aapki.start} to ${aapki.end} I was **${aapki.role}** at ${aapki.org}. ${aapki.points.join(" ")}`,
      card: "experience",
      focus: 2,
      followUps: ["Where have you worked?", "What do you do at Amity University?"],
    }),
  },
  {
    match: /(cognizant|trainee|front-?end|web dev)/,
    answer: () => ({
      text: `I started my career as a **${cognizant.role}** at ${cognizant.org}, ${cognizant.place} (${cognizant.start} – ${cognizant.end}). ${cognizant.points.join(" ")}`,
      card: "experience",
      focus: 3,
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
    match: /(amity|\bcurrent\w*|\bnow\b|\btoday\b|\bpresent\b|day job|ai engineer|what do you do|for a living|profession|occupation|working on|\bdoing\b|these days|position|designation|job title|\bjob\b)/,
    answer: () => ({
      text: `Since ${amity.start} I've been an **${amity.role}** at ${amity.org}, ${amity.place}. I run AI research infrastructure on two NVIDIA DGX A100 servers, host a multi-agent clinical decision-support platform, develop models in PyTorch and TensorFlow, and deploy Streamlit AI/LLM apps for industry demos and research workflows.`,
      card: "role",
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
    match: /(where|location|based|\blive\b|city|noida|india)/,
    answer: () => ({
      text: `I'm based in **${profile.location}**.`,
      card: "contact",
      followUps: ["What do you do at Amity University?", "How can I contact you?"],
    }),
  },
  {
    match: /(\bwho\b|\bname\b|about you|yourself|introduce|\bhello+\b|\bhi+\b|\bhey+\b|\byo+\b|namaste|\bmeet you\b|focus|background|summary|tell me more|interest(ed|s)? (you|in)|passionate)/,
    answer: () => ({
      text: `Hi, I'm **${profile.name}**, an AI Engineer and researcher based in ${profile.location}. ${profile.summary.replace(/^AI Engineer with/, "I have")}`,
      card: "about",
      followUps: ["Where have you worked?", "What research have you published?"],
    }),
  },
];

/* ---------- "Do you know X?" lookups ---------- */

const TECH_QUESTION =
  /\b(?:do you know|do you use|have you (?:ever )?(?:used|worked with|worked on)|are you familiar with|familiar with|experience (?:do you have )?(?:with|in)|can you (?:use|code in|work with)|proficient (?:in|with)|skilled in|know how to use)\s+(.+?)[\s?.!]*$/i;

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
    const usedIn = (e: (typeof experience)[number]) => e.stack.includes(resolved) || e.points.some((p) => mentions(p, resolved));
    const roles = experience.filter(usedIn).map((e) => `${e.role} at ${e.org}`);
    const firstRole = experience.findIndex(usedIn);
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
      focus: firstRole >= 0 ? firstRole : undefined,
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

export function answer(rawQuestion: string): Answer {
  // "ok so what are your projects" is the same question as "what are your projects"
  const stripped = rawQuestion.replace(LEADING_FILLER, "");
  const question = stripped.trim() && !THANKS.test(rawQuestion.toLowerCase()) ? stripped : rawQuestion;
  const q = question.toLowerCase();
  const tech = question.trim().match(TECH_QUESTION);
  if (tech) {
    const t = techAnswer(tech[1]);
    if (t) return t;
    const term = tech[1].toLowerCase();
    for (const topic of topics) if (topic.match.test(term)) return topic.answer(term);
  }
  for (const t of topics) if (t.match.test(q)) return t.answer(q);
  return {
    text: "I can only answer from my resume, and I couldn't find that in it. Try asking about my experience, projects, skills, research, education or how to contact me.",
    followUps: ["Who are you?", "What projects have you built?", "What research have you published?"],
  };
}
