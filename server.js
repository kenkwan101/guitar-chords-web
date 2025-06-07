const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 提供靜態文件
app.use(express.static('.'));

// API 端點
app.get('/api/chords', async (req, res) => {
  try {
    const chordsData = await fs.readFile(path.join(__dirname, 'chords.json'), 'utf8');
    const chords = JSON.parse(chordsData);
    
    // 添加緩存控制
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1小時緩存
    res.json(chords);
  } catch (error) {
    console.error('Error reading chords.json:', error);
    res.status(500).json({ error: 'Failed to load chord data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 