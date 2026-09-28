const axios = require('axios');

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }
});

githubApi.interceptors.request.use((config) => {
  if (process.env.GITHUB_TOKEN) {
    config.headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return config;
});

const parseGitHubUrl = (githubUrl) => {
  try {
    const url = new URL(githubUrl);
    const parts = url.pathname.replace(/^\//, '').replace(/\.git$/, '').split('/');
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
};

const fetchRepository = async (owner, repo) => {
  const response = await githubApi.get(`/repos/${owner}/${repo}`);
  return response.data;
};

const fetchCommits = async (owner, repo, perPage = 30) => {
  const response = await githubApi.get(`/repos/${owner}/${repo}/commits`, {
    params: { per_page: perPage }
  });
  return response.data;
};

const fetchCommitDetails = async (owner, repo, sha) => {
  const response = await githubApi.get(`/repos/${owner}/${repo}/commits/${sha}`);
  return response.data;
};

module.exports = { parseGitHubUrl, fetchRepository, fetchCommits, fetchCommitDetails };
