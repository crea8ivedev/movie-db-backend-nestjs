import { registerAs } from '@nestjs/config';

export default registerAs('session', () => {
  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  };
});
