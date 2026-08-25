export const mockProjects = [
  {
    id: 'p1',
    name: 'Rate Limiter',
    description: 'High-throughput distributed API rate limiting system with token bucket and sliding window algorithms.',
    detailedDescription: `A distributed rate limiting system designed to protect microservices from cascading failures and abusive traffic spikes. 

### Problem
Without rate limiting, public and internal endpoints are vulnerable to DoS attacks, resource starvation, and unexpected client request bursts.

### Solution
Engineered a scalable rate limiting middleware supporting multiple algorithms (Token Bucket, Leaky Bucket, Sliding Window Log). Utilizes Redis for shared global state across multiple horizontally scaled application instances.

### Architecture
Clients send HTTP requests through the gateway layer where the rate limiter interceptor inspects IP/API key tokens against configured bucket capacities stored in Redis cache with sub-millisecond latency.`,
    status: 'in-progress',
    techStack: ['Java', 'Spring Boot', 'Redis', 'Docker', 'Maven'],
    tags: ['Backend', 'System Design', 'Distributed Systems', 'Performance'],
    links: {
      github: 'https://github.com/example/rate-limiter',
      liveDemo: 'https://rate-limiter-demo.example.com',
      documentation: 'https://docs.example.com/rate-limiter',
      figma: ''
    },
    team: ['Arun (Lead Backend)', 'Dev Team'],
    pinned: true,
    relatedProjects: ['p2'],
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-19T14:30:00Z'
  },
  {
    id: 'p2',
    name: 'ReliefLink',
    description: 'Real-time disaster relief coordination platform connecting volunteers, NGOs, and affected citizens.',
    detailedDescription: `A community emergency coordination platform built for rapid response during floods, earthquakes, and humanitarian crises.

### Problem
During crises, communication breaks down. Existing social media channels are fragmented, noisy, and lack location verification for supplies and rescues.

### Solution
ReliefLink provides interactive live crisis heatmaps, verified supply inventory logging, and volunteer assignment dispatching with offline-first PWA support.

### Architecture
React frontend with Mapbox/Google Maps integration, Node.js + Express REST API, MongoDB spatial geospatial indexing ($near queries), and WebSockets for real-time SOS broadcast pings.`,
    status: 'completed',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Google Maps', 'Tailwind CSS', 'WebSockets'],
    tags: ['Full Stack', 'Social Impact', 'Geospatial', 'Real-time'],
    links: {
      github: 'https://github.com/example/relieflink',
      liveDemo: 'https://relieflink.org',
      documentation: 'https://docs.relieflink.org',
      figma: 'https://figma.com/@relieflink'
    },
    team: ['Arun (Full Stack)', 'Priya (UI/UX)', 'Rahul (Backend)'],
    pinned: true,
    relatedProjects: ['p1'],
    createdAt: '2026-06-15T08:00:00Z',
    updatedAt: '2026-08-10T16:00:00Z'
  }
];

export const mockResources = [
  {
    id: 'r1',
    projectId: 'p1',
    title: 'Redis Rate Limiting Patterns',
    url: 'https://redis.io/glossary/rate-limiting/',
    type: 'documentation',
    description: 'Official Redis documentation outlining token bucket and sliding window log implementations using Redis hashes and sorted sets.',
    tags: ['redis', 'algorithms', 'caching'],
    createdAt: '2026-08-02T11:00:00Z'
  },
  {
    id: 'r2',
    projectId: 'p1',
    title: 'Token Bucket Algorithm Explained',
    url: 'https://en.wikipedia.org/wiki/Token_bucket',
    type: 'article',
    description: 'Mathematical foundation of the Token Bucket and comparison with Leaky Bucket burst capacities.',
    tags: ['algorithms', 'theory', 'networking'],
    createdAt: '2026-08-03T14:30:00Z'
  },
  {
    id: 'r3',
    projectId: 'p1',
    title: 'Spring Boot Redis Lettuce Connection Pooling',
    url: 'https://docs.spring.io/spring-data/redis/docs/current/reference/html/',
    type: 'documentation',
    description: 'Reference guide for configuring Lettuce non-blocking client pool for high-concurrency throughput in Spring Boot.',
    tags: ['spring-boot', 'java', 'redis'],
    createdAt: '2026-08-06T09:15:00Z'
  },
  {
    id: 'r4',
    projectId: 'p1',
    title: 'Uber Engineering: Better Rate Limiting in Distributed Systems',
    url: 'https://www.uber.com/blog/better-rate-limiting-distributed-systems/',
    type: 'article',
    description: 'Case study on building ring-pop cluster rate limiting across thousands of microservices.',
    tags: ['system-design', 'architecture', 'case-study'],
    createdAt: '2026-08-10T16:00:00Z'
  },
  {
    id: 'r5',
    projectId: 'p2',
    title: 'MongoDB Geospatial Queries ($near & 2dsphere)',
    url: 'https://www.mongodb.com/docs/manual/geospatial-queries/',
    type: 'documentation',
    description: 'Guide on setting up 2dsphere indexes and querying spatial points within coordinate radiuses.',
    tags: ['mongodb', 'database', 'geospatial'],
    createdAt: '2026-06-20T10:00:00Z'
  },
  {
    id: 'r6',
    projectId: 'p2',
    title: 'Google Maps JavaScript API Markers & Clustering',
    url: 'https://developers.google.com/maps/documentation/javascript/marker-clustering',
    type: 'documentation',
    description: 'High-density incident marker clustering on live interactive maps.',
    tags: ['maps', 'frontend', 'google-maps'],
    createdAt: '2026-06-25T13:45:00Z'
  },
  {
    id: 'r7',
    projectId: 'p2',
    title: 'Offline-First Progressive Web Apps with Workbox',
    url: 'https://developer.chrome.com/docs/workbox/',
    type: 'tutorial',
    description: 'Setting up service workers for background sync when cellular towers fail during crises.',
    tags: ['pwa', 'frontend', 'offline'],
    createdAt: '2026-07-02T15:30:00Z'
  }
];

export const mockDecisions = [
  {
    id: 'd1',
    projectId: 'p1',
    title: 'Why choose Token Bucket over Leaky Bucket?',
    description: 'Selecting the primary rate limiting algorithm for API burst tolerance.',
    reason: 'Token Bucket naturally allows bursts of legitimate user traffic up to bucket capacity while maintaining an accurate average rate. Leaky Bucket forcefully throttles bursty users to a constant drip rate, leading to poor user experience on page loads.',
    alternatives: [
      'In-memory Fixed Window Counter',
      'Sliding Window Log',
      'Leaky Bucket',
      'Token Bucket'
    ],
    finalChoice: 'Token Bucket algorithm via Redis Lua scripts',
    createdAt: '2026-08-04T12:00:00Z'
  },
  {
    id: 'd2',
    projectId: 'p1',
    title: 'Why use Redis instead of PostgreSQL for rate counter storage?',
    description: 'Storage engine decision for global request counter tracking.',
    reason: 'Redis executes in-memory with sub-millisecond atomic INCR and EXPIRE operations. Writing every incoming HTTP request counter to PostgreSQL disk would create an extreme bottleneck and degrade overall API throughput.',
    alternatives: [
      'In-memory JVM ConcurrentHashMap (no multi-instance sync)',
      'PostgreSQL with row-level locks',
      'Redis in-memory store with Lua scripting'
    ],
    finalChoice: 'Redis with Lettuce connection pooling and Lua script atomicity',
    createdAt: '2026-08-05T15:30:00Z'
  },
  {
    id: 'd3',
    projectId: 'p2',
    title: 'Choosing MongoDB over PostgreSQL for Crisis Reports',
    description: 'Database selection for flexible incident schema and geospatial queries.',
    reason: 'During emergencies, incident report schemas evolve rapidly (adding shelter capacity, food dietary needs, rescue boat requirements). MongoDB allows schema-less flexibility and provides high-performance native 2dsphere geospatial search.',
    alternatives: [
      'PostgreSQL with PostGIS extension',
      'MongoDB Atlas with GeoJSON indexes',
      'Firebase Firestore'
    ],
    finalChoice: 'MongoDB with Mongoose schemas and 2dsphere indexes',
    createdAt: '2026-06-18T11:00:00Z'
  },
  {
    id: 'd4',
    projectId: 'p2',
    title: 'Using WebSockets for Live SOS Alerts',
    description: 'Communication protocol for instant emergency dispatcher notifications.',
    reason: 'Polling every 5 seconds drains mobile battery and causes up to 5 seconds of delay. WebSockets deliver SOS alerts immediately to all active dispatcher screens in under 100ms.',
    alternatives: [
      'Short HTTP Polling (5s interval)',
      'Server-Sent Events (SSE)',
      'Socket.io WebSockets'
    ],
    finalChoice: 'Socket.io with fallback to long polling',
    createdAt: '2026-06-28T16:20:00Z'
  }
];

export const mockTasks = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Implement Token Bucket algorithm with Redis Lua script',
    description: 'Write atomic Lua script to decrement token count and return remaining quota in a single network roundtrip.',
    status: 'completed',
    priority: 'high',
    createdAt: '2026-08-05T10:00:00Z'
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Add Spring Boot Filter Interceptor for API keys',
    description: 'Extract Authorization headers / X-API-Key and pass client ID into rate limiting service.',
    status: 'completed',
    priority: 'high',
    createdAt: '2026-08-07T11:30:00Z'
  },
  {
    id: 't3',
    projectId: 'p1',
    title: 'Add Sliding Window Log algorithm support',
    description: 'Implement sliding window log using Redis ZSET for strictly accurate rate limiting.',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2026-08-12T14:00:00Z'
  },
  {
    id: 't4',
    projectId: 'p1',
    title: 'Write load tests using Locust / JMeter (10k req/sec)',
    description: 'Benchmark latency overhead and CPU utilization under sustained 10,000 requests per second.',
    status: 'todo',
    priority: 'high',
    createdAt: '2026-08-15T09:00:00Z'
  },
  {
    id: 't5',
    projectId: 'p1',
    title: 'Create Docker Compose file for local multi-instance cluster',
    description: 'Configure 3 Spring Boot nodes behind Nginx reverse proxy connected to Redis.',
    status: 'todo',
    priority: 'medium',
    createdAt: '2026-08-17T16:00:00Z'
  },
  {
    id: 't6',
    projectId: 'p2',
    title: 'Implement interactive incident map with Google Maps API',
    description: 'Render color-coded markers for food, shelter, medical help, and flood rescue.',
    status: 'completed',
    priority: 'high',
    createdAt: '2026-06-22T09:00:00Z'
  },
  {
    id: 't7',
    projectId: 'p2',
    title: 'Set up MongoDB 2dsphere location indexes',
    description: 'Enable $near spatial queries to locate supplies within 5km radius of user location.',
    status: 'completed',
    priority: 'high',
    createdAt: '2026-06-24T14:30:00Z'
  },
  {
    id: 't8',
    projectId: 'p2',
    title: 'Build real-time volunteer dispatch notification system',
    description: 'Push emergency assignments via WebSockets and SMS fallbacks.',
    status: 'completed',
    priority: 'high',
    createdAt: '2026-07-05T11:00:00Z'
  }
];

export const mockProjectHistories = {
  p1: [
    { id: 'h1', projectId: 'p1', action: 'created', description: 'Project created with initial problem statement', timestamp: '2026-08-01T10:00:00Z' },
    { id: 'h2', projectId: 'p1', action: 'link_added', description: 'GitHub repository linked (github.com/example/rate-limiter)', timestamp: '2026-08-02T11:30:00Z' },
    { id: 'h3', projectId: 'p1', action: 'decision_added', description: 'Technical decision added: "Why Token Bucket over Leaky Bucket?"', timestamp: '2026-08-04T12:00:00Z' },
    { id: 'h4', projectId: 'p1', action: 'decision_added', description: 'Technical decision added: "Why use Redis for counter storage?"', timestamp: '2026-08-05T15:30:00Z' },
    { id: 'h5', projectId: 'p1', action: 'task_completed', description: 'Task completed: "Implement Token Bucket algorithm with Redis Lua script"', timestamp: '2026-08-09T18:00:00Z' },
    { id: 'h6', projectId: 'p1', action: 'resource_added', description: 'Resource added: "Spring Boot Redis Lettuce Connection Pooling"', timestamp: '2026-08-11T14:20:00Z' },
    { id: 'h7', projectId: 'p1', action: 'pinned', description: 'Project pinned to quick access', timestamp: '2026-08-19T14:30:00Z' }
  ],
  p2: [
    { id: 'h8', projectId: 'p2', action: 'created', description: 'ReliefLink project initiated', timestamp: '2026-06-15T08:00:00Z' },
    { id: 'h9', projectId: 'p2', action: 'decision_added', description: 'Technical decision added: "Choosing MongoDB for Crisis Reports"', timestamp: '2026-06-18T11:00:00Z' },
    { id: 'h10', projectId: 'p2', action: 'task_completed', description: 'Task completed: "Implement interactive incident map with Google Maps"', timestamp: '2026-07-01T17:00:00Z' },
    { id: 'h11', projectId: 'p2', action: 'updated', description: 'Status updated to Completed after successful beta deployment', timestamp: '2026-08-10T16:00:00Z' }
  ]
};

export const mockQuickNotes = [
  {
    id: 'qn1',
    projectId: 'p1',
    type: 'note',
    content: 'Need to investigate Redis distributed locking (Redlock) for multi-region active-active clusters.',
    createdAt: '2026-08-19T09:00:00Z'
  },
  {
    id: 'qn2',
    projectId: 'p2',
    type: 'resource',
    content: 'Check out Mapbox alternative tiles if Google Maps billing quota is exceeded.',
    createdAt: '2026-08-18T14:00:00Z'
  }
];

export const mockTechList = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript',
  'Node.js', 'Express', 'FastAPI', 'Python', 'Java', 'Spring Boot', 'Go',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS',
  'GraphQL', 'WebSockets', 'Tailwind CSS', 'PyTorch', 'OpenAI API'
];

export const mockStatusOptions = [
  { value: 'planning', label: 'Planning', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'on-hold', label: 'On Hold', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'archived', label: 'Archived', color: 'bg-gray-100 text-gray-700 border-gray-200' }
];

export const mockUser = {
  id: '1',
  name: 'Arun',
  email: 'arun@example.com'
};
