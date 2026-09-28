const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Resource = require('./models/Resource');
const Decision = require('./models/Decision');
const Task = require('./models/Task');
const GitHubActivity = require('./models/GitHubActivity');
const QuickNote = require('./models/QuickNote');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/contextvault');
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Project.deleteMany({});
    await Resource.deleteMany({});
    await Decision.deleteMany({});
    await Task.deleteMany({});
    await GitHubActivity.deleteMany({});
    await QuickNote.deleteMany({});

    console.log('Cleared existing data.');

    const user = await User.create({
      name: 'Arun',
      email: 'arun@example.com',
      password: 'password123'
    });
    console.log(`Created demo user: ${user.email}`);

    const project1 = await Project.create({
      userId: user._id,
      name: 'Rate Limiter',
      description: 'High-throughput distributed API rate limiting system with token bucket and sliding window algorithms.',
      detailedDescription: `A distributed rate limiting system designed to protect microservices from cascading failures and abusive traffic spikes.\n\n### Problem\nWithout rate limiting, public and internal endpoints are vulnerable to DoS attacks, resource starvation, and unexpected client request bursts.\n\n### Solution\nEngineered a scalable rate limiting middleware supporting multiple algorithms (Token Bucket, Leaky Bucket, Sliding Window Log). Utilizes Redis for shared global state across multiple horizontally scaled application instances.\n\n### Architecture\nClients send HTTP requests through the gateway layer where the rate limiter interceptor inspects IP/API key tokens against configured bucket capacities stored in Redis cache with sub-millisecond latency.`,
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
      relatedProjects: []
    });

    const project2 = await Project.create({
      userId: user._id,
      name: 'ReliefLink',
      description: 'Real-time disaster relief coordination platform connecting volunteers, NGOs, and affected citizens.',
      detailedDescription: `A community emergency coordination platform built for rapid response during floods, earthquakes, and humanitarian crises.\n\n### Problem\nDuring crises, communication breaks down. Existing social media channels are fragmented, noisy, and lack location verification for supplies and rescues.\n\n### Solution\nReliefLink provides interactive live crisis heatmaps, verified supply inventory logging, and volunteer assignment dispatching with offline-first PWA support.\n\n### Architecture\nReact frontend with Mapbox/Google Maps integration, Node.js + Express REST API, MongoDB spatial geospatial indexing ($near queries), and WebSockets for real-time SOS broadcast pings.`,
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
      relatedProjects: [project1._id]
    });

    project1.relatedProjects = [project2._id];
    await project1.save();

    await Resource.insertMany([
      {
        userId: user._id,
        projectId: project1._id,
        title: 'Redis Rate Limiting Patterns',
        url: 'https://redis.io/glossary/rate-limiting/',
        type: 'documentation',
        description: 'Official Redis documentation outlining token bucket and sliding window log implementations using Redis hashes and sorted sets.',
        tags: ['redis', 'algorithms', 'caching']
      },
      {
        userId: user._id,
        projectId: project1._id,
        title: 'Token Bucket Algorithm Explained',
        url: 'https://en.wikipedia.org/wiki/Token_bucket',
        type: 'article',
        description: 'Mathematical foundation of the Token Bucket and comparison with Leaky Bucket burst capacities.',
        tags: ['algorithms', 'theory', 'networking']
      },
      {
        userId: user._id,
        projectId: project1._id,
        title: 'Spring Boot Redis Lettuce Connection Pooling',
        url: 'https://docs.spring.io/spring-data/redis/docs/current/reference/html/',
        type: 'documentation',
        description: 'Reference guide for configuring Lettuce non-blocking client pool for high-concurrency throughput in Spring Boot.',
        tags: ['spring-boot', 'java', 'redis']
      },
      {
        userId: user._id,
        projectId: project2._id,
        title: 'MongoDB Geospatial Queries ($near & 2dsphere)',
        url: 'https://www.mongodb.com/docs/manual/geospatial-queries/',
        type: 'documentation',
        description: 'Guide on setting up 2dsphere indexes and querying spatial points within coordinate radiuses.',
        tags: ['mongodb', 'database', 'geospatial']
      },
      {
        userId: user._id,
        projectId: project2._id,
        title: 'Google Maps JavaScript API Markers & Clustering',
        url: 'https://developers.google.com/maps/documentation/javascript/marker-clustering',
        type: 'documentation',
        description: 'High-density incident marker clustering on live interactive maps.',
        tags: ['maps', 'frontend', 'google-maps']
      }
    ]);

    await Decision.insertMany([
      {
        userId: user._id,
        projectId: project1._id,
        title: 'Why choose Token Bucket over Leaky Bucket?',
        description: 'Selecting the primary rate limiting algorithm for API burst tolerance.',
        reason: 'Token Bucket naturally allows bursts of legitimate user traffic up to bucket capacity while maintaining an accurate average rate. Leaky Bucket forcefully throttles bursty users to a constant drip rate, leading to poor user experience on page loads.',
        alternatives: ['In-memory Fixed Window Counter', 'Sliding Window Log', 'Leaky Bucket', 'Token Bucket'],
        finalChoice: 'Token Bucket algorithm via Redis Lua scripts',
        relatedFiles: ['src/main/resources/token_bucket.lua', 'src/main/java/com/ratelimiter/filter/RateLimitFilter.java']
      },
      {
        userId: user._id,
        projectId: project1._id,
        title: 'Why use Redis instead of PostgreSQL for rate counter storage?',
        description: 'Storage engine decision for global request counter tracking.',
        reason: 'Redis executes in-memory with sub-millisecond atomic INCR and EXPIRE operations. Writing every incoming HTTP request counter to PostgreSQL disk would create an extreme bottleneck and degrade overall API throughput.',
        alternatives: ['In-memory ConcurrentHashMap', 'PostgreSQL row locks', 'Redis in-memory store'],
        finalChoice: 'Redis with Lettuce connection pooling and Lua script atomicity',
        relatedFiles: ['src/main/java/com/ratelimiter/config/RedisConfig.java']
      },
      {
        userId: user._id,
        projectId: project2._id,
        title: 'Choosing MongoDB over PostgreSQL for Crisis Reports',
        description: 'Database selection for flexible incident schema and geospatial queries.',
        reason: 'During emergencies, incident report schemas evolve rapidly. MongoDB allows schema-less flexibility and provides high-performance native 2dsphere geospatial search.',
        alternatives: ['PostgreSQL with PostGIS', 'MongoDB Atlas with GeoJSON', 'Firebase Firestore'],
        finalChoice: 'MongoDB with Mongoose schemas and 2dsphere indexes',
        relatedFiles: ['models/Incident.js', 'controllers/incidentController.js']
      }
    ]);

    await Task.insertMany([
      {
        userId: user._id,
        projectId: project1._id,
        title: 'Implement Token Bucket algorithm with Redis Lua script',
        description: 'Write atomic Lua script to decrement token count and return remaining quota in a single network roundtrip.',
        status: 'completed',
        priority: 'high'
      },
      {
        userId: user._id,
        projectId: project1._id,
        title: 'Add Spring Boot Filter Interceptor for API keys',
        description: 'Extract Authorization headers / X-API-Key and pass client ID into rate limiting service.',
        status: 'completed',
        priority: 'high'
      },
      {
        userId: user._id,
        projectId: project1._id,
        title: 'Add Sliding Window Log algorithm support',
        description: 'Implement sliding window log using Redis ZSET for strictly accurate rate limiting.',
        status: 'in-progress',
        priority: 'medium'
      },
      {
        userId: user._id,
        projectId: project1._id,
        title: 'Write load tests using Locust / JMeter (10k req/sec)',
        description: 'Benchmark latency overhead and CPU utilization under sustained 10,000 requests per second.',
        status: 'todo',
        priority: 'high'
      },
      {
        userId: user._id,
        projectId: project2._id,
        title: 'Implement interactive incident map with Google Maps API',
        description: 'Render color-coded markers for food, shelter, medical help, and flood rescue.',
        status: 'completed',
        priority: 'high'
      },
      {
        userId: user._id,
        projectId: project2._id,
        title: 'Set up MongoDB 2dsphere location indexes',
        description: 'Enable $near spatial queries to locate supplies within 5km radius of user location.',
        status: 'completed',
        priority: 'high'
      }
    ]);

    await GitHubActivity.insertMany([
      {
        projectId: project1._id,
        repository: 'example/rate-limiter',
        commitSha: 'a1b2c3d4e5f67890123456789abcdef012345678',
        commitMessage: 'Implement Token Bucket algorithm using Redis Lua script',
        author: 'Arun',
        authorUsername: 'arun-dev',
        commitDate: new Date('2026-08-05T10:00:00Z'),
        commitUrl: 'https://github.com/example/rate-limiter/commit/a1b2c3d',
        changedFiles: [
          'src/main/resources/token_bucket.lua',
          'src/main/java/com/ratelimiter/filter/RateLimitFilter.java'
        ],
        additions: 84,
        deletions: 12
      },
      {
        projectId: project1._id,
        repository: 'example/rate-limiter',
        commitSha: 'b2c3d4e5f67890123456789abcdef0123456789a',
        commitMessage: 'Configure Lettuce non-blocking connection pool in RedisConfig',
        author: 'Arun',
        authorUsername: 'arun-dev',
        commitDate: new Date('2026-08-07T14:30:00Z'),
        commitUrl: 'https://github.com/example/rate-limiter/commit/b2c3d4e',
        changedFiles: [
          'src/main/java/com/ratelimiter/config/RedisConfig.java',
          'src/main/resources/application.yml'
        ],
        additions: 45,
        deletions: 6
      }
    ]);

    await QuickNote.insertMany([
      {
        userId: user._id,
        projectId: project1._id,
        type: 'note',
        content: 'Need to investigate Redis distributed locking (Redlock) for multi-region active-active clusters.'
      },
      {
        userId: user._id,
        projectId: project2._id,
        type: 'resource',
        content: 'Check out Mapbox alternative tiles if Google Maps billing quota is exceeded.'
      }
    ]);

    console.log('Sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
