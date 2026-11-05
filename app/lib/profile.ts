/*
 * Single source of truth for everything the site says about Ishan.
 * Every fact here comes from Resume/Ishan_Joshi_AI_Engineer_Resume.pdf, except `interests`, which
 * Ishan provided directly. Update the resume first, then mirror the change here; never add facts
 * that are not in the resume or given by Ishan.
 */

export const profile = {
  name: "Ishan Joshi",
  firstName: "Ishan",
  initials: "IJ",
  role: "AI Engineer",
  headline: "AI Engineer · Generative AI · NLP · Machine Learning · MLOps",
  tagline:
    "I build and deploy AI and LLM systems, from multimodal research models to multi-agent platforms running on NVIDIA DGX A100.",
  location: "Noida, India",
  email: "ishan.joshi2016@gmail.com",
  resume: "/Ishan_Joshi_AI_Engineer_Resume.pdf",
  summary:
    "AI Engineer with an M.Tech in Data Science and hands-on experience across machine learning, NLP, computer vision, multimodal AI, and GPU infrastructure. I build and deploy AI/LLM applications using Python, PyTorch, TensorFlow, Docker, Kubernetes, and Ollama, including a multi-agent clinical decision-support platform on NVIDIA DGX A100. I'm experienced in extracting insights from structured and unstructured data, developing analytical workflows, and translating model outputs into interactive applications and business-facing demonstrations.",
  focus: [
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "Multimodal AI",
    "LLM Applications",
  ],
};

export const links = {
  email: `mailto:${profile.email}`,
  linkedin: "https://www.linkedin.com/in/ishan-joshi-755326147/",
  github: "https://github.com/itsishanjoshi",
  scholar: "https://scholar.google.com/citations?user=tuT3OagAAAAJ&hl=en",
  // provided by Ishan (not on the resume); the place to send personal questions
  instagram: "https://www.instagram.com/ishanjoshi_007/",
};

export const instagramHandle = "@ishanjoshi_007";

/* Figures that appear in the resume, used as quick highlights. */
export const highlights = [
  { value: "2×", label: "NVIDIA DGX A100 servers managed" },
  { value: "30+", label: "concurrent AI workloads" },
  { value: "99%+", label: "uptime on a multi-agent LLM platform" },
  { value: "3", label: "peer-reviewed publications" },
];

export type Experience = {
  role: string;
  org: string;
  place: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  points: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    role: "AI Engineer",
    org: "Amity University",
    place: "Noida",
    start: "June 2025",
    end: "Present",
    current: true,
    summary:
      "Run GPU infrastructure for AI research and build and deploy the LLM applications on top of it.",
    points: [
      "Manage containerized AI research workloads across two NVIDIA DGX A100 servers using Kubernetes and Docker, including pod lifecycle, GPU allocation, job scheduling, and resource monitoring for 30+ concurrent AI workloads.",
      "Designed Kubernetes pod monitoring and automated fault-recovery workflows with Grafana, reducing unresponsive-pod incidents and improving platform uptime.",
      "Engineered and hosted a multi-agent clinical decision-support platform using Ollama and Docker on an NVIDIA DGX A100 MIG 7g.40gb partition, maintaining 99%+ uptime while optimizing VRAM utilization.",
      "Develop and optimize AI models with Python, TensorFlow, and PyTorch using feature engineering, hyperparameter tuning, and model evaluation.",
      "Deploy secure Streamlit AI/LLM applications for real-time inference and interactive data visualization used in industry demonstrations and research workflows.",
      "Collaborate with faculty and research teams to translate analytical and AI requirements into deployable solutions and automated workflows.",
    ],
    stack: ["Kubernetes", "Docker", "NVIDIA DGX A100", "MIG", "Ollama", "Grafana", "PyTorch", "TensorFlow", "Streamlit"],
  },
  {
    role: "Product Pricing Analyst",
    org: "PlanCover",
    place: "Gurgaon",
    start: "Apr 2023",
    end: "Aug 2023",
    summary: "Turned claims and market data into pricing insight for health insurance.",
    points: [
      "Performed market and competitor analysis for health-insurance pricing using Excel and Power BI, converting claims and market data into actionable pricing insights.",
      "Applied Impact Factor metrics to claims MIS data for customer segmentation and identification of high-risk policyholders, supporting risk-adjusted pricing and underwriting decisions.",
      "Collaborated with the technology team on a Quote Management System that streamlined quote generation across multiple insurers and improved coordination between sales and underwriting.",
    ],
    stack: ["Power BI", "MS Excel", "Customer segmentation", "Claims MIS"],
  },
  {
    role: "Content Manager",
    org: "Aapki Education",
    place: "",
    start: "Jan 2021",
    end: "Feb 2023",
    summary: "Used learner-engagement data to shape how STEM content was planned and delivered.",
    points: [
      "Managed STEM content planning and delivery while using learner engagement data to optimize content formats, difficulty, and sequencing.",
      "Analyzed completion rates, time-on-task, click-through rates, drop-off rates, and session duration to drive data-informed content decisions.",
      "Collaborated with technology teams to design performance dashboards supporting content lifecycle management.",
    ],
    stack: ["Engagement analytics", "Dashboards", "STEM content"],
  },
  {
    role: "Programmer Analyst Trainee",
    org: "Cognizant Technology Solutions",
    place: "Chennai",
    start: "Jul 2020",
    end: "Nov 2020",
    summary: "Built responsive internal interfaces within an agile team.",
    points: [
      "Developed responsive internal e-library interfaces using HTML, CSS, JavaScript, and Bootstrap within an agile team.",
      "Supported UI/UX improvements with attention to responsive design and accessibility.",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Bootstrap"],
  },
];

export type SkillGroup = { id: string; title: string; color: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    id: "genai",
    title: "Generative AI & NLP",
    color: "#856ED9",
    items: ["LLM applications", "Multi-agent AI", "Ollama", "BERT", "MiniLM", "Sentence embeddings", "NLP", "Text classification", "Information extraction"],
  },
  {
    id: "ml",
    title: "Machine Learning",
    color: "#3E9858",
    items: ["Scikit-learn", "Classification", "Clustering", "Predictive modeling", "Feature engineering", "Hyperparameter tuning", "Model evaluation"],
  },
  {
    id: "dl",
    title: "Deep Learning",
    color: "#0171E3",
    items: ["PyTorch", "TensorFlow", "CNNs", "VGG-16", "ResNet-50", "Transfer learning", "Multimodal learning", "Cross-modal attention"],
  },
  {
    id: "mlops",
    title: "MLOps & Infrastructure",
    color: "#D97706",
    items: ["Docker", "Kubernetes", "NVIDIA DGX A100", "MIG", "GPU utilization", "Pod management", "Grafana", "Job scheduling", "Streamlit"],
  },
  {
    id: "data",
    title: "Data & Analytics",
    color: "#329696",
    items: ["Python", "SQL", "Power BI", "MS Excel", "Interactive visualization", "Structured/unstructured data analysis"],
  },
  {
    id: "code",
    title: "Programming",
    color: "#B95F9C",
    items: ["Python", "Java", "SQL", "HTML/CSS", "JavaScript"],
  },
];

export type Project = {
  id: string;
  title: string;
  category: string;
  blurb: string;
  points: string[];
  stack: string[];
  /* Two colours for the card's generated cover art. */
  palette: [string, string];
};

export const projects: Project[] = [
  {
    id: "insight-extraction",
    title: "LLM-Driven Workflow for Competitive Insight Extraction",
    category: "NLP · Analytics",
    blurb:
      "An NLP pipeline that reads KPMG and PwC research reports and organizes what they say into Finance, Technology, and ESG themes.",
    points: [
      "Built an NLP analytics pipeline using MiniLM sentence embeddings and K-Means clustering to extract and organize insights from KPMG and PwC research reports.",
      "Mapped clustered content to Finance, Technology, and ESG domains for competitive benchmarking and surfaced results through interactive sunburst and similarity visualizations.",
    ],
    stack: ["MiniLM", "Sentence embeddings", "K-Means", "Python", "Interactive visualization"],
    palette: ["#856ED9", "#0171E3"],
  },
  {
    id: "fer",
    title: "Deep Learning Facial Emotion Recognition",
    category: "Computer Vision",
    blurb:
      "VGG-16 and ResNet-50 compared on FER-2013 to find the model that balances accuracy against compute for real-time use.",
    points: [
      "Implemented VGG-16 and ResNet-50 models on FER-2013 for facial-emotion classification, applying normalization, resizing, augmentation, and comparative model evaluation.",
      "Assessed accuracy versus computational cost to identify a model suitable for real-time inference.",
    ],
    stack: ["VGG-16", "ResNet-50", "FER-2013", "Transfer learning", "Data augmentation"],
    palette: ["#329696", "#3E9858"],
  },
  {
    id: "sentiment",
    title: "Restaurant Review Sentiment Analysis",
    category: "NLP · Classification",
    blurb:
      "A text-classification workflow that sorts restaurant reviews into positive, neutral, and negative, comparing classical classifiers.",
    points: [
      "Built an NLP classification workflow for positive, neutral, and negative restaurant reviews using tokenization, lemmatization, Naive Bayes, and SVM.",
      "Compared classifier performance to identify an effective text-classification approach.",
    ],
    stack: ["Tokenization", "Lemmatization", "Naive Bayes", "SVM", "Python"],
    palette: ["#D97706", "#B95F9C"],
  },
];

export type Publication = {
  title: string;
  venue: string;
  year: string;
  doi: string;
  url: string;
  publisher: string;
  summary: string;
  tags: string[];
};

export const publications: Publication[] = [
  {
    title: "Emotion Recognition Using BERT and CNN: A Deep Learning Approach for Crossmodal Fusion of Text and Audio",
    venue: "ICCCNet 2025, Manchester Metropolitan University",
    year: "2025",
    doi: "10.1007/978-3-032-18910-3_19",
    url: "https://link.springer.com/chapter/10.1007/978-3-032-18910-3_19",
    publisher: "Springer",
    summary:
      "Developed a multimodal model combining BERT text representations and CNN-based mel-spectrogram features with cross-modal attention and fusion.",
    tags: ["Multimodal AI", "BERT", "CNN", "Cross-modal attention"],
  },
  {
    title: "Predictive Modelling of Sleep Efficiency Using Machine Learning",
    venue: "ICETM 2025",
    year: "2025",
    doi: "10.1109/ICETM63734.2025.11051741",
    url: "https://ieeexplore.ieee.org/abstract/document/11051741",
    publisher: "IEEE",
    summary:
      "Developed Random Forest, Gradient Boosting, and related models; achieved R² = 0.85 and MSE ≈ 0.0027.",
    tags: ["Machine Learning", "Random Forest", "Gradient Boosting"],
  },
  {
    title: "Hybrid Approach to Digital Image Watermarking",
    venue: "CRM2025, SR University",
    year: "2025",
    doi: "10.1007/978-981-96-9771-7_28",
    url: "https://link.springer.com/chapter/10.1007/978-981-96-9771-7_28",
    publisher: "Springer",
    summary:
      "Developed a hybrid multi-domain approach for robust watermarking with improved security and imperceptibility.",
    tags: ["Image processing", "Security"],
  },
];

export const education = [
  {
    degree: "M.Tech in Data Science",
    school: "Amity University",
    place: "Noida",
    start: "Aug 2023",
    end: "Jun 2025",
    grade: "CGPA 8.98",
  },
  {
    degree: "B.Tech in Civil Engineering",
    school: "Vellore Institute of Technology",
    place: "Chennai",
    start: "Jul 2016",
    end: "Jun 2020",
    grade: "CGPA 8.36",
  },
];

/* Interests outside work. Not on the resume: provided directly by Ishan. Keep to what he listed. */
export const interests = [
  { name: "Cricket", emoji: "🏏", color: "#3E9858" },
  { name: "Chess", emoji: "♟️", color: "#856ED9" },
  { name: "Cooking", emoji: "🍳", color: "#D97706" },
  { name: "Listening to music", emoji: "🎧", color: "#0171E3" },
];

export const certifications = [
  { issuer: "IIT Delhi", name: "AI with Machine Learning" },
  { issuer: "NVIDIA", name: "Deep Learning Certificate Program" },
  { issuer: "Udemy", name: "Power BI Masterclass" },
  { issuer: "Udemy", name: "Machine Learning A-Z: AI, Python & R" },
];
