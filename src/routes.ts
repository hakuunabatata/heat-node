import { Router } from 'express'
import {
  AuthenticateUserController,
  CreateMessageController,
  ensureAutheticated,
} from '.'

const router = Router()

router.post('/authenticate', new AuthenticateUserController().handle)
router.post(
  '/messages',
  ensureAutheticated,
  new CreateMessageController().handle
)

export { router }
