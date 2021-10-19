import { Router } from 'express'
import {
  AuthenticateUserController,
  CreateMessageController,
  ensureAutheticated,
  GetLastMessagesController,
  ProfileUserController,
} from '.'

const router = Router()

router.post('/authenticate', new AuthenticateUserController().handle)
router.post(
  '/messages',
  ensureAutheticated,
  new CreateMessageController().handle
)

router.get('/messages/last3', new GetLastMessagesController().handle)

router.get('/profile', ensureAutheticated, new ProfileUserController().handle)

export { router }
