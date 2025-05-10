// Mock data for AI Assistant
export const subjects = [
  { id: "math", name: "Mathematics" },
  { id: "physics", name: "Physics" },
  { id: "chemistry", name: "Chemistry" },
  { id: "biology", name: "Biology" },
  { id: "computer-science", name: "Computer Science" },
  { id: "history", name: "History" },
  { id: "geography", name: "Geography" },
  { id: "english", name: "English" },
];

export const mockSuggestions = {
  math: [
    "Explain the quadratic formula",
    "Help me solve integration problems",
    "What is calculus?",
    "Explain trigonometric functions",
    "How to solve linear equations?",
  ],
  physics: [
    "Explain Newton's laws of motion",
    "What is quantum mechanics?",
    "How does a transformer work?",
    "Explain the theory of relativity",
    "What are the laws of thermodynamics?",
  ],
  chemistry: [
    "Explain periodic table trends",
    "What is chemical bonding?",
    "How does titration work?",
    "Explain organic chemistry basics",
    "What is the mole concept?",
  ],
  biology: [
    "Explain photosynthesis",
    "How does DNA replication work?",
    "Explain cell division",
    "What is natural selection?",
    "How does the immune system work?",
  ],
  "computer-science": [
    "Explain how algorithms work",
    "What is object-oriented programming?",
    "How does machine learning work?",
    "Explain data structures",
    "What is the difference between HTTP and HTTPS?",
  ],
  history: [
    "What caused World War I?",
    "Explain the French Revolution",
    "Who was Alexander the Great?",
    "What was the Renaissance period?",
    "How did the Roman Empire fall?",
  ],
  geography: [
    "Explain plate tectonics",
    "What causes climate change?",
    "What are the main types of rocks?",
    "How do rivers shape landscapes?",
    "What are the major biomes on Earth?",
  ],
  english: [
    "Help me analyze this poem",
    "Explain figures of speech",
    "What is the difference between a simile and metaphor?",
    "How do I write a persuasive essay?",
    "Explain the structure of a sonnet",
  ],
};

export const autoCompleteMap = {
  how: [
    "how do I solve",
    "how does this work",
    "how can I understand",
    "how to learn",
    "how to memorize",
  ],
  what: [
    "what is the definition of",
    "what are the key concepts",
    "what is the formula for",
    "what does this mean",
    "what are the steps to",
  ],
  explain: [
    "explain the concept of",
    "explain how to solve",
    "explain the difference between",
    "explain the process of",
    "explain why",
  ],
  can: [
    "can you help me understand",
    "can you explain",
    "can you show an example of",
    "can you solve this problem",
    "can you simplify",
  ],
  why: [
    "why does this happen",
    "why is this important",
    "why should I learn",
    "why is this the case",
    "why do we use",
  ],
};

export const mockSessions = [
  {
    id: "session-1",
    name: "Math Help - Calculus",
    lastUpdated: "2025-05-09T10:30:00Z",
    subject: "math",
  },
  {
    id: "session-2",
    name: "Physics Problems",
    lastUpdated: "2025-05-08T14:20:00Z",
    subject: "physics",
  },
  {
    id: "session-3",
    name: "Chemistry Study Session",
    lastUpdated: "2025-05-07T09:15:00Z",
    subject: "chemistry",
  },
  {
    id: "session-4",
    name: "Biology Review",
    lastUpdated: "2025-05-06T16:45:00Z",
    subject: "biology",
  },
  {
    id: "session-5",
    name: "Computer Science Concepts",
    lastUpdated: "2025-05-05T11:20:00Z",
    subject: "computer-science",
  },
];

// Mock function to generate AI responses based on subject
export const getMockResponse = (message, subject) => {
  const responses = {
    math: [
      "In mathematics, that's an interesting question. Let me explain...",
      "When approaching this math problem, we should consider...",
      "The mathematical concept you're asking about involves...",
      "This can be solved using the following mathematical approach...",
    ],
    physics: [
      "In physics, this phenomenon is explained by...",
      "According to the laws of physics, we can understand this by...",
      "The physical interpretation of this problem involves...",
      "This is related to a fundamental concept in physics called...",
    ],
    chemistry: [
      "From a chemical perspective, this process works by...",
      "In chemistry, this reaction occurs because...",
      "The chemical properties at play here are...",
      "When analyzing this from a chemistry standpoint...",
    ],
    biology: [
      "In biological systems, this process functions through...",
      "The biological mechanism behind this involves...",
      "From an evolutionary perspective, this developed because...",
      "This biological concept is essential because...",
    ],
    "computer-science": [
      "In computer science, this algorithm works by...",
      "The programming concept you're asking about involves...",
      "When designing this system, developers typically consider...",
      "This computational approach is efficient because...",
    ],
    history: [
      "Historically, this event was significant because...",
      "Throughout history, this development influenced...",
      "Historical records indicate that this occurred due to...",
      "From a historical perspective, we can understand this by...",
    ],
    geography: [
      "This geographical feature forms when...",
      "In geographical terms, this region is characterized by...",
      "The geographical processes at work here include...",
      "From a geographical standpoint, this phenomenon occurs because...",
    ],
    english: [
      "In literary analysis, this technique is used to...",
      "The linguistic concept you're asking about involves...",
      "This writing style developed during the period of...",
      "When interpreting this text, consider the context of...",
    ],
  };

  const subjectResponses = responses[subject] || responses.math;
  const randomIndex = Math.floor(Math.random() * subjectResponses.length);

  return subjectResponses[randomIndex] + " " + message;
};

// Mock data for conversation history
export const getMockConversationHistory = (sessionId) => {
  const sessions = {
    "session-1": [
      {
        role: "assistant",
        content:
          "Hello! I'm your math study assistant. How can I help you with calculus today?",
      },
      { role: "user", content: "I'm having trouble understanding derivatives" },
      {
        role: "assistant",
        content:
          "Derivatives measure the rate of change of a function. The derivative of f(x) is defined as the limit of [f(x+h) - f(x)]/h as h approaches 0. Would you like me to explain with some examples?",
      },
    ],
    "session-2": [
      {
        role: "assistant",
        content:
          "Welcome to your physics study session! What physics topic are you studying?",
      },
      { role: "user", content: "I need help with kinematics" },
      {
        role: "assistant",
        content:
          "Kinematics describes the motion of objects. The key equations are: displacement = velocity × time and velocity = initial velocity + acceleration × time. What specific problem are you trying to solve?",
      },
    ],
    "session-3": [
      {
        role: "assistant",
        content:
          "Welcome to your chemistry study session! How can I help you today?",
      },
    ],
    "session-4": [
      {
        role: "assistant",
        content:
          "Welcome to your biology review session! What topic would you like to study?",
      },
    ],
    "session-5": [
      {
        role: "assistant",
        content:
          "Hello! Ready to explore computer science concepts? What would you like to learn about?",
      },
    ],
  };

  return (
    sessions[sessionId] || [
      {
        role: "assistant",
        content: "Welcome to your new study session! How can I help you today?",
      },
    ]
  );
};
