import api from './api'

interface Repository {
  full_name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  }
}

class GithubService {
  getRepository(repositoryName: string) {
    return api.get<Repository>(`repos/${repositoryName}`)
  }
}

export default new GithubService()
