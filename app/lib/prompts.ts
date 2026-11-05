import type { IconName } from "../Icons";

/* The quick-question tiles on the landing page and in the chat. Colours match the reference palette. */
export const quickPrompts: { label: string; icon: IconName; color: string; question: string }[] = [
  { label: "Me", icon: "smile", color: "#329696", question: "Who are you?" },
  { label: "Experience", icon: "briefcase", color: "#3E9858", question: "Where have you worked?" },
  { label: "Projects", icon: "code", color: "#0171E3", question: "What projects have you built?" },
  { label: "Skills", icon: "layers", color: "#856ED9", question: "What are your skills?" },
  { label: "Research", icon: "book", color: "#D97706", question: "What research have you published?" },
  { label: "Contact", icon: "mail", color: "#C19433", question: "How can I contact you?" },
];

/* Longer list of suggested questions shown in the chat's "Need inspiration?" drawer. */
export const suggestedQuestions: { group: string; questions: string[] }[] = [
  {
    group: "About",
    questions: ["Who are you?", "What do you focus on?", "What do you do for fun?", "Where are you based?", "Can I see your resume?"],
  },
  {
    group: "Work",
    questions: [
      "What do you do at Amity University?",
      "Tell me about the clinical decision-support platform",
      "How do you manage the DGX A100 servers?",
      "Where have you worked?",
    ],
  },
  {
    group: "AI & Research",
    questions: [
      "What research have you published?",
      "Tell me about your multimodal emotion recognition paper",
      "What projects have you built?",
      "What are your skills?",
    ],
  },
  {
    group: "Background",
    questions: ["What did you study?", "Which certifications do you have?", "How can I contact you?"],
  },
];
