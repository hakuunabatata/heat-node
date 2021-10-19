import axios from 'axios'
import prismaClient from '../prisma'
import { sign } from 'jsonwebtoken'

interface IAccessTokenResponse {
  access_token: string
}

interface IUserResponse {
  avatar_url: string
  login: string
  id: number
  name: string
}

export class AuthenticateUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token'

    const { data: tokenResponse } = await axios.post<IAccessTokenResponse>(
      url,
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      }
    )

    const { access_token } = tokenResponse

    const { data: userResponse } = await axios.get<IUserResponse>(
      'https://api.github.com/user',
      {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      }
    )

    const { login, id, avatar_url, name } = userResponse

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    })

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          login,
          github_id: id,
          avatar_url,
          name,
        },
      })
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '1d',
      }
    )

    return { token, user }
  }
}
