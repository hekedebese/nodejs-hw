import createHttpError from 'http-errors';

import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { accessToken } = req.cookies;

  // Перевіряємо наявність accessToken
  if (!accessToken) {
    throw createHttpError(401, 'Missing access token');
  }

  // Шукаємо сесію за accessToken
  const session = await Session.findOne({
    accessToken,
  });

  // Якщо сесію не знайдено
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // Перевіряємо термін дії accessToken
  if (session.accessTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Access token expired');
  }

  // Шукаємо користувача
  const user = await User.findById(session.userId);

  // Якщо користувача не знайдено
  if (!user) {
    throw createHttpError(401);
  }

  // Передаємо користувача далі
  req.user = user;

  next();
};
