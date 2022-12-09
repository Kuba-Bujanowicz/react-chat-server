import { router as authRouter } from './auth.routes';
import { router as userRouter } from './user.routes';
import { router as emailRouter } from './email.routes';

export const Routes = {
  AuthRoutes: authRouter,
  UserRoutes: userRouter,
  EmailRoutes: emailRouter,
};
