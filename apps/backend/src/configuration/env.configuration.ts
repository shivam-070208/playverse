export const PORT = process.env.PORT || 3001;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',').map((origin) =>
  origin.trim(),
) || ['http://localhost:3000', 'http://localhost:3001'];
