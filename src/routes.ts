import { Router } from 'express'
import {
  AuthenticateUserController,
  CreateMessageController,
  ensureAutheticated,
  GetLastMessagesController,
} from '.'

const router = Router()

router.post('/authenticate', new AuthenticateUserController().handle)
router.post(
  '/messages',
  ensureAutheticated,
  new CreateMessageController().handle
)

router.get('/messages/last3', new GetLastMessagesController().handle)

export { router }
