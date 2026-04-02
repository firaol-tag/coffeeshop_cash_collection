import 'dotenv/config';
import { createApp } from './backend/app.js';

const app = createApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
