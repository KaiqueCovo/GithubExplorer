import React, { useState, useEffect, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'

import logo from '../../assets/logo.svg'
import { Title, Form, Repositories, Message } from './styles'

import GithubService from '../../services/GithubService'

interface Repository {
  full_name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('')
  const [newRepository, setNewRepository] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(
      '@GitHubExplorer:repositories'
    )

    if (storagedRepositories) return JSON.parse(storagedRepositories)

    return []
  })

  /**
   * Add Repository from localStorage
   */
  useEffect(() => {
    localStorage.setItem(
      '@GitHubExplorer:repositories',
      JSON.stringify(repositories)
    )
  }, [repositories])

  /**
   * Add Repository
   * @param event
   */
  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()

    if (!newRepository)
      return setInputMessage('Tente digitar autor/nome do repositório')

    try {
      const { data } = await GithubService.getRepository(newRepository)

      setRepositories([...repositories, data])
      setNewRepository('')
      setInputMessage('')
    } catch (error) {
      setInputMessage('Desculpe, não encontramos esse repositório!')
    }
  }

  return (
    <>
      <img src={logo} alt="GitHub Explorer" />
      <Title>Explore repositórios no GitHub</Title>
      <Form hasError={!!inputMessage} onSubmit={handleAddRepository}>
        <input
          type="text"
          placeholder="Digite o nome do repositório"
          value={newRepository}
          onChange={(e) => setNewRepository(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>
      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.full_name}
            to={`repository/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
        {!repositories.length || inputMessage ? (
          <Message>
            {inputMessage || 'Explore seus repositórios favoritos'}
          </Message>
        ) : (
          ''
        )}
      </Repositories>
    </>
  )
}

export default Dashboard
