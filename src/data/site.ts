// ─────────────────────────────────────────────────────────────────────────────
//  All of the site's text and links live in this one file.
//  To update the portfolio: edit here, commit, push to main. GitHub Actions
//  rebuilds and redeploys https://monkeydcoder.github.io/ automatically.
//
//  Inline markup (rendered by components/Rich.tsx):
//    **key fact**  brighter text for skimmers     {{phrase}}  accent italic
//    [label](https://...)  external link
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  url: 'https://monkeydcoder.github.io',
  title: 'Satyam Sharma · Reinforcement Learning',
  description:
    "Satyam Sharma is a master's student and MEXT scholar at the Institute of Science Tokyo, researching memory and sparse-reward reinforcement learning in the Ichise Laboratory. Research, projects and résumé.",
};

export const profile = {
  name: 'Satyam Sharma',
  location: 'Meguro, Tokyo',
  status: "M.S. student · Ichise Lab, Institute of Science Tokyo",
  tagline: 'I build learning agents that work out {{what matters}} when the reward almost never comes.',
  intro:
    "**Master's student and MEXT scholar** in Tokyo. I research **memory for sparse-reward reinforcement learning**, and I care as much about reproducible experiments as about the ideas they test.",
  glance: [
    { value: 'MEXT 2025', label: 'scholar, 1 of 25 from India' },
    { value: '3.83 / 4.5', label: 'M.S. GPA, first semester' },
    { value: '6,000+', label: 'seeded RL training runs' },
  ],
  email: 'satyamsharma3002@gmail.com',
  github: 'https://github.com/monkeydcoder',
  linkedin: 'https://www.linkedin.com/in/satyam-sharma-24463522a/',
  resume: '/Satyam_Sharma_Resume.pdf',
  photo: '/images/profile.jpg',
  lab: { name: 'Ichise Laboratory', url: 'https://www.ai.iee.eng.isct.ac.jp/' },
  supervisor: 'Prof. Ryutaro Ichise',
};

export const about = {
  heading: 'I study reinforcement learning at the Institute of Science Tokyo.',
  paragraphs: [
    "I'm a **first-year master's student** in Industrial Engineering and Economics at the Institute of Science Tokyo (formerly Tokyo Tech), working in [Prof. Ryutaro Ichise's lab](https://www.ai.iee.eng.isct.ac.jp/). I came to Japan in October 2025 on the **MEXT scholarship**, one of 25 Indian nationals selected that year, and spent six months as a research student before the master's program began in April 2026.",
    'Before that I studied computer science at SLIET in Punjab (**B.E. Honours, CGPA 8.9/10**). I ran the robotics club and built **Earth Docker**, a field robot that spots diseased cotton plants and won institute funding in my second year. Building things that had to work outside a notebook taught me to test ideas hard before trusting them.',
    "These days I work on agents that make good decisions from very little feedback. I'm also interested in where reinforcement learning meets large language models.",
  ],
  facts: [
    { label: 'Based in', value: 'Meguro, Tokyo' },
    { label: 'Studying', value: "M.S., Institute of Science Tokyo (2026–2028)" },
    { label: 'Lab', value: 'Ichise Laboratory', href: 'https://www.ai.iee.eng.isct.ac.jp/' },
    { label: 'Scholarship', value: 'MEXT, Government of Japan' },
    { label: 'Languages', value: 'English · Japanese (around JLPT N4)' },
  ],
  offTheClock:
    'Away from the lab I hike (I trekked Rupin Pass in Himachal), ski, explore Tokyo and towns like Kawagoe on foot, and keep up with One Piece, Attack on Titan and Naruto.',
};

export type ResearchStage = {
  step: string;
  period: string;
  title: string;
  body: string;
  findings: string[];
  current?: boolean;
};

export const research = {
  title: 'What should an agent remember when rewards are rare?',
  intro: [
    'In many real decision problems, the signal that you did well arrives only at the end, after a long chain of correct steps. Standard deep RL methods such as PPO learn slowly or not at all in these **sparse-reward** settings, because until the agent stumbles through the whole chain by luck there is nothing to learn from.',
    "My master's research asks **what kind of memory helps** here, and whether an agent can **find the important steps by itself**, without a person telling it what matters.",
  ],
  status:
    "Ongoing master's thesis in the Ichise Laboratory. The code and data stay private until publication, but I'm happy to walk through the work in a conversation.",
  stages: [
    {
      step: '01',
      period: 'Jul – Aug 2026',
      title: 'Memory as a learning signal',
      body: 'I built a modular PPO codebase in Python and PyTorch with swappable memories: a knowledge graph, a flat episodic memory and a visit counter. Each one plugs in through the same potential-based reward-shaping interface, so they can be compared fairly and none can change which behaviour is optimal.',
      findings: [
        'A memory bonus turned DoorKey-8x8 from **3 to 22+ successful runs** out of 24 seeds.',
        'The knowledge graph beat flat memory on DoorKey-6x6 (**48 seeds, p\u00a0=\u00a00.0026**) and reached the success threshold **about 1.4x faster** than plain PPO.',
        'It did not carry over to other environments, because the graph only noticed events it had been told to look for. So the next step was to find events automatically.',
      ],
    },
    {
      step: '02',
      period: 'Oct 2026',
      title: 'Finding the important events automatically',
      body: 'Next I built a domain-agnostic event detector. It knows nothing about keys, doors or goals: it sees the environment only as values that change, and has to recover the chain of events that success depends on. I scored it against true chains written down before collecting any data, including control environments where the right answer is "nothing".',
      findings: [
        'Recovered **7 of 7** ground-truth event chains.',
        '**Zero false chains** on 3 of 3 control environments, across 10 environments and 50,000 random-play episodes each.',
      ],
    },
    {
      step: '03',
      period: 'Oct 2026',
      title: 'Does a discovered chain help an agent learn?',
      body: "I moved the detector inside training. Once the PPO agent has some successful episodes, the detector finds the chain of events behind them, and progress along that chain earns a small reward bonus. I tested this in a **pre-registered experiment of 3,552 training runs** across 11 MiniGrid environments, 48 seeds each, over three and a half days on two of the lab's servers. Every run finished, and a second, independent scoring program agreed on every number.",
      findings: [
        'Inside training, the detector found the **correct chain in 48 of 48 runs** in each of five environments, and invented **no chain in any of 432 control runs**.',
        'The discovered chain made PPO learn faster in **5 of 8** chain environments. In UnlockPickup and ObstructedMaze it **cut learning time roughly in half** (median 8.8M to 4.4M and 8.2M to 4.6M steps) and was faster on **47 of 48 seeds** in each.',
        'Given the correct chain from the first step, PPO learned those two environments **6.5x and 7.5x faster**, and reached the success threshold in BlockedUnlockPickup in **48 of 48 runs**, where plain PPO never did. So turning a chain into a bonus works, and there is a clear gap left to close.',
      ],
    },
    {
      step: '04',
      period: 'Now',
      title: 'Closing the gap to a perfect chain',
      body: "The chains the agent finds are almost always correct, yet the perfect chain, given from the first step, still helps much more. My leading explanation is timing: the agent's own chain only appears after its first successes, about 3M steps into UnlockPickup and ObstructedMaze, when an agent with the perfect chain has already learned them. I'm now writing up the results and running three follow-up analyses, declared before any result came in, to test this run by run. Then I plan to take the detector beyond MiniGrid to other kinds of observations.",
      findings: [],
      current: true,
    },
  ] satisfies ResearchStage[],
  stats: [
    { value: '6,000+', label: 'seeded training runs' },
    { value: '~2x', label: 'faster learning than plain PPO in two hard environments' },
    { value: '48 / 48', label: 'runs with the correct chain, in each of five environments' },
    { value: '0 / 432', label: 'false chains in control runs' },
  ],
  practice: [
    {
      title: 'Hypotheses written first',
      body: "Every experiment has written predictions and pass/fail rules before any result exists, so a result can't be explained away afterwards.",
    },
    {
      title: 'Replication on fresh seeds',
      body: 'Headline comparisons are re-run on **fresh seeds, 48 per condition**, and checked with paired statistical tests.',
    },
    {
      title: 'Retracting my own result',
      body: 'When a reproducibility check failed (146,896 vs 160,672 steps), I traced it to an episode-boundary bug worth **about 24,000 steps of false advantage**. I retracted the headline result, fixed the code and re-validated it on fresh seeds.',
    },
    {
      title: 'Bit-for-bit reproduction',
      body: 'After a full server wipe I restored every result and reproduced **32 of 32 runs exactly**. I also fixed a thread-oversubscription problem that had slowed runs on a shared 96-thread server to 20 steps per second.',
    },
  ],
  tools: [
    'Python',
    'PyTorch',
    'PPO',
    'Stable-Baselines3',
    'Gymnasium',
    'MiniGrid',
    'Potential-based reward shaping',
    'Linux servers & SSH',
    'Multi-core job scheduling',
    'Paired statistical tests',
  ],
  seminar: "I also present recent reinforcement learning and LLM papers in the lab's regular seminar.",
};

export type ProjectLink = { label: string; href: string; kind: 'code' | 'video' | 'demo' | 'doc' };
export type ProjectMedia =
  | { type: 'video'; src: string; poster: string; alt: string }
  | { type: 'loom'; embed: string; poster: string; alt: string }
  | { type: 'gif'; src: string; poster: string; alt: string }
  | { type: 'pattern'; variant: 'route' | 'pipeline'; caption: string };

export type Project = {
  title: string;
  kind: string;
  summary: string;
  points: string[];
  tech: string[];
  links: ProjectLink[];
  media: ProjectMedia;
  note?: string;
};

export const projects: Project[] = [
  {
    title: 'EduMind AI',
    kind: 'Full-stack LLM app · 2025',
    summary:
      'An exam-preparation platform for Indian competitive exams (UPSC, SSC, GATE and more), built on **LLaMA 3.1 and 3.2 running locally** through Ollama.',
    points: [
      'AI tutor chat, practice tests, quiz generation, exam-pattern analysis and essay evaluation with structured feedback.',
      'React, TypeScript and Material UI front end; Node.js and Express back end with a **30-minute response cache** to avoid repeated model calls.',
    ],
    tech: ['React', 'TypeScript', 'Material UI', 'Node.js', 'Express', 'Ollama', 'LLaMA 3'],
    links: [
      { label: 'Code', href: 'https://github.com/monkeydcoder/EduMind-AI', kind: 'code' },
      {
        label: 'Demo video',
        href: 'https://www.loom.com/share/e604337fc4cf4cd2932a9fc64e80a56c',
        kind: 'video',
      },
    ],
    media: {
      type: 'loom',
      embed: 'https://www.loom.com/embed/e604337fc4cf4cd2932a9fc64e80a56c?hideEmbedTopBar=true&autoplay=1',
      poster: '/images/projects/edumind.jpg',
      alt: 'EduMind AI home screen with exam selection, AI assistant and essay evaluation',
    },
  },
  {
    title: 'Reel Vault',
    kind: 'Full-stack LLM tool · 2026',
    summary:
      'Turns saved Instagram reels and carousels into a searchable, mapped knowledge base: one "5 best ramen spots" post becomes five place cards, sorted into categories and pinned on a map.',
    points: [
      'Extraction escalates only when it must (caption, then speech transcription, then vision on slides or frames), with daily caps checked before every paid call so it runs **entirely on free tiers**.',
      'FastAPI and SQLite back end, React front end with a MapLibre map, installable on a phone as a share target; **293 automated tests**.',
    ],
    tech: ['Python', 'FastAPI', 'SQLite', 'React', 'Gemini', 'Whisper', 'MapLibre'],
    links: [],
    note: 'Personal tool · code private',
    media: { type: 'pattern', variant: 'pipeline', caption: 'reel → items → categories → map' },
  },
  {
    title: 'ResearchMate AI',
    kind: 'LLM app · 2025',
    summary:
      'A research assistant that **runs locally** on Ollama and Llama 3, so papers never have to leave your machine.',
    points: [
      'Paper analysis, research-trend tracking, citation generation, research-question brainstorming and literature maps in one interface.',
      'React and Redux front end with React Flow for literature maps; Node.js and Express back end talking to Ollama.',
    ],
    tech: ['React', 'Redux', 'React Flow', 'Node.js', 'Express', 'Ollama'],
    links: [
      { label: 'Code', href: 'https://github.com/monkeydcoder/researchmate-ai', kind: 'code' },
      {
        label: 'Demo video',
        href: 'https://www.loom.com/share/f0cf23e5e03546e5875df76d9d26199b',
        kind: 'video',
      },
    ],
    media: {
      type: 'loom',
      embed: 'https://www.loom.com/embed/f0cf23e5e03546e5875df76d9d26199b?hideEmbedTopBar=true&autoplay=1',
      poster: '/images/projects/researchmate.jpg',
      alt: 'ResearchMate AI landing page',
    },
  },
  {
    title: 'Earth Docker',
    kind: 'Robotics · computer vision · SLIET',
    summary: 'An autonomous farm robot that detects diseased cotton plants in the field.',
    points: [
      'Trained a ResNet152V2 classifier to **98% accuracy** on diseased vs healthy cotton plants and leaves.',
      'Ran perception and RP-LiDAR navigation on a Raspberry Pi 4, on a rocker-bogie chassis with planetary-gear drive.',
      'Won **₹50,000 of institute funding** as the only second-year team selected.',
    ],
    tech: ['Python', 'TensorFlow / Keras', 'ResNet152V2', 'Raspberry Pi 4', 'RP-LiDAR'],
    links: [
      {
        label: 'Full video',
        href: 'https://drive.google.com/file/d/1Da1-jJAbpxZg9HS9e9umZE9I9zp_5iUM/view',
        kind: 'video',
      },
    ],
    media: {
      type: 'video',
      src: '/videos/earth-docker.mp4',
      poster: '/images/projects/earth-docker.jpg',
      alt: 'Earth Docker classifier predicting a diseased cotton leaf',
    },
  },
  {
    title: 'KanjiPath',
    kind: 'Web app · 2026',
    summary: 'A JLPT N5 and N4 Japanese study app I built for my own learning, now open source.',
    points: [
      '**247 kanji, 500+ words** and about 100 grammar patterns, with readings, example sentences and audio.',
      'Spaced-repetition flashcards on a five-box Leitner schedule, JLPT-style quizzes, a study streak and progress export.',
    ],
    tech: ['React', 'Vite', 'Tailwind CSS'],
    links: [{ label: 'Code', href: 'https://github.com/monkeydcoder/KanjiPath', kind: 'code' }],
    media: {
      type: 'gif',
      src: '/images/projects/kanjipath.gif',
      poster: '/images/projects/kanjipath.jpg',
      alt: 'KanjiPath dashboard showing JLPT N5 and N4 progress',
    },
  },
  {
    title: '3D Anime Village',
    kind: 'Three.js · for fun · 2026',
    summary:
      'An experimental portfolio as a scroll-driven walk through an anime village at dusk: torii gate, lanterns, cherry blossoms, a reflective pond and fireflies.',
    points: ['Built to learn real-time 3D on the web with React Three Fiber, drei and post-processing.'],
    tech: ['Three.js', 'React Three Fiber', 'Vite', 'Tailwind CSS'],
    links: [{ label: 'Code', href: 'https://github.com/monkeydcoder/3js_Portfolio', kind: 'code' }],
    media: {
      type: 'gif',
      src: '/images/projects/anime-village.gif',
      poster: '/images/projects/anime-village.jpg',
      alt: 'Night-time 3D anime village with a torii gate and lanterns',
    },
  },
  {
    title: 'NLP & data notebooks',
    kind: 'NLP · data collection',
    summary: 'Notebooks from learning NLP and data collection.',
    points: [
      'Multi-class emotion detection with TF-IDF and n-gram features (Random Forest, Naive Bayes), reaching **94% accuracy**.',
      'Scraped and cleaned **10,000 company records** (ratings, reviews, salaries) from AmbitionBox with requests and BeautifulSoup.',
    ],
    tech: ['Python', 'scikit-learn', 'Pandas', 'BeautifulSoup'],
    links: [
      { label: 'NLP code', href: 'https://github.com/monkeydcoder/NLP/tree/main/Code%20basics', kind: 'code' },
      { label: 'Scraper', href: 'https://github.com/monkeydcoder/Web-Scrapping', kind: 'code' },
    ],
    media: { type: 'pattern', variant: 'pipeline', caption: 'text → features → classifier' },
  },
  {
    title: 'Two-Day Travel Planner',
    kind: 'Optimisation · course team project',
    summary:
      'A two-day Tokyo itinerary over **45 candidate places**, formulated as an integer linear program that trades off ratings, variety, energy and budget.',
    points: ['Found a **provably optimal plan**, cross-checked it with a dynamic-programming formulation and presented it with a live demo.'],
    tech: ['Python', 'Integer linear programming', 'Dynamic programming'],
    links: [],
    note: 'Course project · slides on request',
    media: { type: 'pattern', variant: 'route', caption: '45 places · 2 days · 1 optimal plan' },
  },
];

export const education = [
  {
    school: 'Institute of Science Tokyo',
    note: 'formerly Tokyo Institute of Technology',
    degree: 'M.S., Industrial Engineering and Economics',
    focus: 'Machine learning and reinforcement learning',
    period: 'Apr 2026 – Mar 2028 (expected)',
    place: 'Tokyo, Japan',
    highlights: [
      '[Ichise Laboratory](https://www.ai.iee.eng.isct.ac.jp/), supervised by Prof. Ryutaro Ichise.',
      'GPA **3.83 / 4.5** after the first semester.',
    ],
    courses: [
      {
        group: 'Machine learning & AI',
        items: ['Intelligent Systems Engineering', 'From Data Analytics to Machine Learning'],
      },
      {
        group: 'Research',
        items: ['Seminar in Industrial Engineering and Economics', 'Reading in Industrial Engineering and Economics'],
      },
      {
        group: 'Engineering & economics',
        items: ['Affect in Social Context', 'Value Creation', 'Financial Literacy'],
      },
      {
        group: 'Japanese language & culture',
        items: ['Basic Japanese 4', 'Basic Japanese 3', 'Japanese Culture 2'],
      },
    ],
  },
  {
    school: 'Institute of Science Tokyo',
    note: 'MEXT research student',
    degree: 'Research Student, Ichise Laboratory',
    focus: 'Reinforcement learning',
    period: 'Oct 2025 – Mar 2026',
    place: 'Tokyo, Japan',
    highlights: [
      'Surveyed recent reinforcement learning and LLM literature, presented it in lab seminars and shaped the thesis direction.',
    ],
    courses: [],
  },
  {
    school: 'Sant Longowal Institute of Engineering and Technology (SLIET)',
    note: '',
    degree: 'B.E. (Honours), Computer Science and Engineering',
    focus: '',
    period: 'Jul 2021 – Jun 2025',
    place: 'Longowal, Punjab, India',
    highlights: ['Graduated with a CGPA of **8.9 / 10**.', 'Completed the additional Honours track alongside the B.E. (2023 to 2025).'],
    courses: [
      {
        group: 'Core',
        items: [
          'Machine Learning',
          'Artificial Intelligence',
          'Data Structures & Algorithms',
          'Database Management Systems',
          'Operating Systems',
          'Computer Networks',
        ],
      },
      {
        group: 'Honours',
        items: ['Optimization Techniques', 'Data Analytics', 'Internet of Things', 'Cryptography & Network Security'],
      },
    ],
  },
];

export const awards = [
  {
    title: 'MEXT (Monbukagakusho) Scholarship',
    org: 'Ministry of Education, Culture, Sports, Science and Technology, Japan',
    year: '2025',
    body: 'Fully funded graduate study at the Institute of Science Tokyo; **one of 25 Indian nationals** selected in 2025.',
  },
];

export const certifications = [
  {
    title: 'Machine Learning Specialization',
    org: 'Andrew Ng · DeepLearning.AI & Stanford, Coursera',
    href: 'https://www.coursera.org/account/accomplishments/specialization/HHUT67NDZ23T',
  },
  {
    title: 'Natural Language Processing',
    org: 'Coursera',
    href: 'https://coursera.org/share/09ccdcb57fee232ca69cbd9b84b29beb',
  },
];

export const skills = [
  {
    group: 'Reinforcement learning',
    items: ['PPO', 'Reward shaping', 'DQN', 'SAC', 'Stable-Baselines3', 'Gymnasium', 'MiniGrid'],
  },
  {
    group: 'Machine learning',
    items: ['PyTorch', 'TensorFlow / Keras', 'scikit-learn', 'NumPy', 'Pandas', 'Matplotlib'],
  },
  {
    group: 'Research engineering',
    items: [
      'Pre-registered evaluation',
      'Seeded, reproducible experiments',
      'Statistical testing',
      'Linux servers & SSH',
      'Multi-core job scheduling',
      'MLflow',
    ],
  },
  {
    group: 'Software',
    items: ['Python', 'TypeScript', 'JavaScript', 'C / C++', 'React', 'Node.js', 'Express', 'FastAPI', 'REST APIs'],
  },
  {
    group: 'LLMs & tooling',
    items: ['Ollama', 'LLaMA', 'Gemini API', 'Docker', 'Git & GitHub', 'Prefect', 'Raspberry Pi'],
  },
  {
    group: 'Languages',
    items: ['English', 'Japanese (around JLPT N4)'],
  },
];

export const leadership = [
  {
    role: 'Convenor, Robotics Club',
    org: 'SLIET',
    period: 'Feb 2022 – Jul 2025',
    body: 'Led club projects spanning drones, line-following robots and a hovercraft, and represented the club at IIT-BHU Technex 2023.',
    href: 'https://www.endeavoursliet.in/pages/teams',
  },
  {
    role: 'Event Coordinator, TechFest 2023 (Robozar)',
    org: 'SLIET',
    period: '2023',
    body: 'Planned and ran inter-college robotics events end to end, coordinating teams from several colleges.',
  },
  {
    role: 'Hackathons & challenges',
    org: 'Smart India Hackathon 2023 · ISRO Robotics Challenge (URSC)',
    body: 'A national hackathon and a robotics design and engineering challenge.',
  },
];

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Research', href: '#research' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];
