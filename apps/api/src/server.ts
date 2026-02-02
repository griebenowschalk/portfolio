import dotenv from 'dotenv';

dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Portfolio CMS API running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
});
