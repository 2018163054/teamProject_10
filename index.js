const express = require('express');
const cors = require('cors');
const app = express();
const commentRoutes = require('./routes/comments');

app.use(cors());
app.use(express.json());
app.use('/api', commentRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
