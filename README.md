# Guitar Chords Explorer

An interactive web application for exploring and learning guitar chords. This application provides a modern, user-friendly interface for guitar players of all levels.

## Features

- **Interactive Chord Diagrams**: Visual representation of chord fingerings with fret positions
- **Real Guitar Sound Playback**: Play chord sounds using MIDI.js
- **Chord Search & Filtering**: Search by name or root note
- **Popular Chords**: Quick access to commonly used chords
- **Chord Sequence Creator**: Create and save chord progressions
- **Bilingual Support**: English and Chinese interfaces
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- HTML5
- CSS3 (with modern features like Grid and Flexbox)
- JavaScript (ES6+)
- MIDI.js for sound playback

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/guitar-chords-web.git
   ```

2. Open `index.html` in your web browser

3. No build process or dependencies required - it's a pure frontend application!

## Usage

1. **Searching Chords**:
   - Use the search box to find specific chords
   - Filter by root note using the dropdown menu
   - Click on any chord in the list to view its diagram

2. **Viewing Chord Diagrams**:
   - Each diagram shows the fretboard with finger positions
   - Numbers indicate which finger to use
   - 'X' marks indicate muted strings
   - Click the play button to hear the chord

3. **Creating Chord Sequences**:
   - Click "Create Chord Sequence"
   - Select chords from the dropdown
   - Add them to your sequence
   - Remove chords using the '×' button
   - Clear the sequence with the "Clear Sequence" button

4. **Language Switch**:
   - Toggle between English and Chinese using the language buttons

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- MIDI.js for the sound playback functionality
- All contributors and users of this application

## 如何部署到 GitHub Pages

1. **Fork 或 Clone 本倉庫**
2. **將所有網站檔案（index.html, chords.js, chords.json, logo.jpeg, guitar-sounds/ 等）推送到 main 分支**
3. **進入 GitHub 倉庫 → Settings → Pages**
   - Source 選擇 `main` branch
   - Folder 選擇 `/ (root)`
   - 點 Save
4. 幾秒後會顯示一個網址，例如：
   `https://你的用戶名.github.io/倉庫名/`

## 注意事項
- 所有檔案（特別是 guitar-sounds/ 及音色檔）都要推送上去，路徑區分大小寫。
- GitHub Pages 只支援靜態網站（HTML/JS/CSS/圖片/音訊）。
- 單個檔案建議不要超過 100MB。

## 頁面預覽
![](logo.jpeg)

---

如需協助，請聯絡作者或在 Issues 留言。 # guitar-chords-web
