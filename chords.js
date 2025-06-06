// Translations for multilingual support
const translations = {
  en: {
    title: "Guitar Chords Explorer",
    intro: "Search and explore guitar chords with interactive diagrams and sound playback.",
    popularChords: "Popular Chords",
<<<<<<< HEAD
    searchPlaceholder: "Search chords...",
    allRoots: "All Roots",
    selectChord: "Select a chord...",
=======
    createSequence: "Create Chord Sequence",
    searchPlaceholder: "Search chords...",
    allRoots: "All Roots",
    selectChord: "Select a chord...",
    addToSequence: "Add to Sequence",
    clearSequence: "Clear Sequence",
>>>>>>> b162bdd051c21fc55fee19aa6479994fa4c34728
    tooManyResults: "Too many results. Please refine your search.",
    noChordsFound: "No chords found."
  },
  zh: {
    title: "吉他和弦探索器",
    intro: "搜索和探索吉他和弦，包含交互式图表和声音播放功能。",
    popularChords: "常用和弦",
<<<<<<< HEAD
    searchPlaceholder: "搜索和弦...",
    allRoots: "所有根音",
    selectChord: "选择一个和弦...",
    tooManyResults: "结果太多，请优化搜索条件。",
    noChordsFound: "未找到和弦。"
  },
  'zh-TW': {
    title: "吉他和弦探索器",
    intro: "搜索和探索吉他和弦，包含交互式图表和声音播放功能。",
    popularChords: "常用和弦",
    searchPlaceholder: "搜索和弦...",
    allRoots: "所有根音",
    selectChord: "选择一个和弦...",
=======
    createSequence: "创建和弦序列",
    searchPlaceholder: "搜索和弦...",
    allRoots: "所有根音",
    selectChord: "选择一个和弦...",
    addToSequence: "添加到序列",
    clearSequence: "清除序列",
>>>>>>> b162bdd051c21fc55fee19aa6479994fa4c34728
    tooManyResults: "结果太多，请优化搜索条件。",
    noChordsFound: "未找到和弦。"
  }
};

// 全局變量
let guitarSoundfont = null;

// Language switching function
function switchLanguage(lang) {
  document.getElementById('title').textContent = translations[lang].title;
  document.getElementById('intro').textContent = translations[lang].intro;
  document.getElementById('btn-popular').textContent = translations[lang].popularChords;
<<<<<<< HEAD
  document.getElementById('chord-search').placeholder = translations[lang].searchPlaceholder;
  document.getElementById('root-select').options[0].text = translations[lang].allRoots;
  document.getElementById('sequence-chord-select').options[0].text = translations[lang].selectChord;
=======
  document.getElementById('btn-create-sequence').textContent = translations[lang].createSequence;
  document.getElementById('chord-search').placeholder = translations[lang].searchPlaceholder;
  document.getElementById('root-select').options[0].text = translations[lang].allRoots;
  document.getElementById('sequence-chord-select').options[0].text = translations[lang].selectChord;
  document.getElementById('add-to-sequence').textContent = translations[lang].addToSequence;
  document.getElementById('clear-sequence').textContent = translations[lang].clearSequence;
>>>>>>> b162bdd051c21fc55fee19aa6479994fa4c34728
  document.documentElement.lang = lang;
}

// 加载吉他音色（nylon）
function loadSoundfont() {
  if (window.MIDI && window.MIDI.Soundfont && window.MIDI.Soundfont.acoustic_guitar_nylon) {
    guitarSoundfont = window.MIDI.Soundfont.acoustic_guitar_nylon;
    console.log('[DEBUG] Soundfont loaded from window.MIDI.Soundfont:', guitarSoundfont);
    return;
  }
  const script = document.createElement('script');
  script.src = 'guitar-sounds/acoustic_guitar_nylon-mp3.js';
  script.onload = () => {
    guitarSoundfont = window.MIDI.Soundfont.acoustic_guitar_nylon;
    console.log('[DEBUG] Soundfont loaded via script:', guitarSoundfont);
  };
  script.onerror = () => {
    console.error('[DEBUG] Failed to load soundfont script!');
  };
  document.body.appendChild(script);
}

// 吉他标准音高（6-1弦）
const stringNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];

// 计算音高
function getNoteName(stringIdx, fret) {
  if (fret < 0) return null; // 静音
  // MIDI音高表
  const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  // 解析如 E2
  const open = stringNotes[stringIdx];
  const note = open.match(/([A-G]#?)(\d)/);
  let idx = noteOrder.indexOf(note[1]);
  let octave = parseInt(note[2], 10);
  idx += fret;
  while (idx >= 12) { idx -= 12; octave += 1; }
  return noteOrder[idx] + octave;
}

// 播放和弦
function playChord(positions) {
  console.log('[DEBUG] playChord called, guitarSoundfont:', guitarSoundfont);
  if (!guitarSoundfont) { 
    loadSoundfont(); 
    alert('Guitar sound loading, please try again.'); 
    return; 
  }
  // 扫弦效果，6-1弦依次播放
  let delay = 0;
  for (let i = 0; i < 6; i++) {
    const fret = positions[i];
    if (fret < 0 || fret > 5) continue; // 只支持0-5品
    const note = getNoteName(i, fret);
    const url = guitarSoundfont[note];
    console.log(`[DEBUG] String ${i+1}, fret ${fret}, note: ${note}, url:`, url);
    if (!url) continue;
    setTimeout(() => {
      try {
        const audio = new Audio(url);
        audio.onplay = () => console.log(`[DEBUG] Playing note: ${note}`);
        audio.onerror = (e) => console.error(`[DEBUG] Audio error for note: ${note}`, e);
        audio.play();
      } catch (err) {
        console.error(`[DEBUG] Exception playing note: ${note}`, err);
      }
    }, delay);
    delay += 120; // 每根弦间隔120ms
  }
}

// Load chord data and initialize the application
async function loadChordData() {
  try {
    console.log('Attempting to load chord data from GitHub Pages...');
    const response = await fetch('https://kenkwan101.github.io/guitar-chords-web/chords.json');
    if (!response.ok) {
      throw new Error(`GitHub Pages request failed with status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Successfully loaded chord data from GitHub Pages');
    return data;
  } catch (error) {
    console.error('Error loading chord data from GitHub Pages:', error);
    // 如果GitHub Pages加載失敗，嘗試從本地文件加載
    try {
      console.log('Attempting to load chord data from local file...');
      const response = await fetch('/chords.json');
      if (!response.ok) {
        throw new Error(`Local file request failed with status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Successfully loaded chord data from local file');
      return data;
    } catch (fallbackError) {
      console.error('Error loading fallback chord data:', fallbackError);
      // 顯示錯誤信息給用戶
      const errorMessage = document.createElement('div');
      errorMessage.style.color = 'red';
      errorMessage.style.padding = '20px';
      errorMessage.style.textAlign = 'center';
      errorMessage.style.backgroundColor = '#fff3f3';
      errorMessage.style.borderRadius = '8px';
      errorMessage.style.margin = '20px';
      errorMessage.innerHTML = `
        <h3>Error Loading Chord Data</h3>
        <p>Failed to load chord data from both GitHub Pages and local file.</p>
        <p>Please try refreshing the page or contact support if the problem persists.</p>
      `;
      document.body.insertBefore(errorMessage, document.body.firstChild);
      throw new Error('Failed to load chord data from both GitHub Pages and local file');
    }
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // 預先加載音色
  loadSoundfont();
  
  loadChordData()
    .then(data => {
      // data is an object: { "C": [...], "Cm": [...], ... }
      const chordNames = Object.keys(data);
      const searchInput = document.getElementById('chord-search');
      const listDiv = document.getElementById('chord-list');
      const rootSelect = document.getElementById('root-select');
      const btnPopular = document.getElementById('btn-popular');
      const btnAll = document.getElementById('btn-all');
<<<<<<< HEAD
      let selectedChord = chordNames[0];
      const MAX_RESULTS = 100;
      let mode = 'all'; // 'all' or 'popular'
=======
      const btnCreateSequence = document.getElementById('btn-create-sequence');
      const chordSequenceCreator = document.getElementById('chord-sequence-creator');
      const sequenceChordSelect = document.getElementById('sequence-chord-select');
      const addToSequenceBtn = document.getElementById('add-to-sequence');
      const clearSequenceBtn = document.getElementById('clear-sequence');
      const sequenceChordsDiv = document.getElementById('sequence-chords');
      let selectedChord = chordNames[0];
      const MAX_RESULTS = 100;
      let mode = 'all'; // 'all' or 'popular'
      let currentSequence = [];
>>>>>>> b162bdd051c21fc55fee19aa6479994fa4c34728
      const popularChords = [
        'C', 'D', 'E', 'F', 'G', 'A', 'B',
        'Am', 'Dm', 'Em',
        'C7', 'D7', 'E7', 'G7', 'A7',
        'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm',
        'F#m', 'B7', 'Emaj7', 'Amaj7', 'Dmaj7', 'Gmaj7'
      ];

      function renderChord(name) {
        const chord = data[name][0];
        const positions = chord.positions.map(p => {
          const num = parseInt(p, 10);
          return isNaN(num) ? -1 : num;
        }); // -1 for mute
        const fingerings = chord.fingerings && chord.fingerings[0] ? chord.fingerings[0] : [];
        const chordsDiv = document.getElementById('chords');
        chordsDiv.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'chord-diagram';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.margin = '0 auto';
        container.style.fontSize = '1.5em'; // 放大整体
        container.style.background = '#f4f4f4';
        container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
        container.style.padding = '32px 24px';
        container.style.borderRadius = '12px';
        container.style.maxWidth = 'min(100%, 350px)';
        container.style.minWidth = '260px';
        container.style.marginTop = '32px';
        container.style.marginBottom = '32px';
        const chordName = document.createElement('div');
        chordName.className = 'chord-name';
        chordName.textContent = name;
        chordName.style.fontSize = '2em';
        chordName.style.marginBottom = '12px';
        chordName.style.fontWeight = 'bold';
        chordName.style.letterSpacing = '2px';
        container.appendChild(chordName);
        // 播放按钮
        const playBtn = document.createElement('button');
        playBtn.textContent = '▶️ Play';
        playBtn.style.marginBottom = '18px';
        playBtn.style.fontSize = '1.2em';
        playBtn.style.padding = '8px 28px';
        playBtn.style.borderRadius = '8px';
        playBtn.style.border = 'none';
        playBtn.style.background = '#2d8cf0';
        playBtn.style.color = '#fff';
        playBtn.style.cursor = 'pointer';
        playBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.10)';
        playBtn.onmouseover = () => playBtn.style.background = '#1766b3';
        playBtn.onmouseout = () => playBtn.style.background = '#2d8cf0';
        playBtn.onclick = () => playChord(positions);
        const playButtonContainer = document.createElement('div');
        playButtonContainer.className = 'play-button-container';
        playButtonContainer.appendChild(playBtn);
        container.appendChild(playButtonContainer);
        // Add X for muted strings
        const xRow = document.createElement('div');
        xRow.style.display = 'grid';
        xRow.style.gridTemplateColumns = 'repeat(6, 22px)';
        xRow.style.justifyContent = 'center';
        xRow.style.marginBottom = '2px';
        for (let string = 0; string < 6; string++) {
          const xCell = document.createElement('div');
          xCell.style.width = '22px';
          xCell.style.height = '18px';
          xCell.style.display = 'flex';
          xCell.style.alignItems = 'center';
          xCell.style.justifyContent = 'center';
          xCell.style.fontWeight = 'bold';
          xCell.style.color = '#e74c3c';
          xCell.style.fontSize = '1em';
          if (positions[string] === -1) {
            xCell.textContent = 'X';
          } else {
            xCell.textContent = '';
          }
          xRow.appendChild(xCell);
        }
        container.appendChild(xRow);
        const fretboard = document.createElement('div');
        fretboard.className = 'fretboard';
        fretboard.style.transform = 'scale(1.5)';
        fretboard.style.margin = '0 auto 10px auto';
        fretboard.style.background = '#fff';
        fretboard.style.borderRadius = '8px';
        fretboard.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
        for (let fret = 1; fret <= 5; fret++) {
          for (let string = 0; string < 6; string++) {
            const cell = document.createElement('div');
            cell.className = 'fret';
            if (positions[string] === fret) {
              const dot = document.createElement('div');
              dot.className = 'dot';
              // Show finger number if available and not 0
              if (fingerings[string] && fingerings[string] !== '0') {
                dot.textContent = fingerings[string];
                dot.style.color = '#fff';
                dot.style.fontSize = '0.95em';
                dot.style.textAlign = 'center';
                dot.style.lineHeight = '16px';
              }
              cell.appendChild(dot);
            }
            fretboard.appendChild(cell);
          }
        }
        container.appendChild(fretboard);
        chordsDiv.appendChild(container);
      }

      function renderList(filter = '', root = '') {
        listDiv.innerHTML = '';
        let filtered = chordNames;
        if (mode === 'popular') {
          filtered = filtered.filter(name => popularChords.includes(name));
        }
        if (root) {
          filtered = filtered.filter(name => name[0].toUpperCase() === root);
        }
        filtered = filtered.filter(name => name.toLowerCase().includes(filter.toLowerCase()));
        const toShow = filtered.slice(0, MAX_RESULTS);
        toShow.forEach(name => {
          const item = document.createElement('div');
          item.className = 'chord-item' + (name === selectedChord ? ' selected' : '');
          item.textContent = name;
          item.onclick = () => {
            selectedChord = name;
            renderChord(name);
            renderList(searchInput.value, rootSelect.value);
            // 選擇和弦後清空搜尋框並隱藏列表
            searchInput.value = '';
            listDiv.style.display = 'none';
          };
          listDiv.appendChild(item);
        });
        if (filtered.length > MAX_RESULTS) {
          const msg = document.createElement('div');
          msg.style.color = 'gray';
          msg.style.padding = '8px';
<<<<<<< HEAD
          const lang = document.documentElement.lang;
          msg.textContent = translations[lang] ? translations[lang].tooManyResults : translations['en'].tooManyResults;
=======
          msg.textContent = translations[document.documentElement.lang].tooManyResults;
>>>>>>> b162bdd051c21fc55fee19aa6479994fa4c34728
          listDiv.appendChild(msg);
        } else if (filtered.length === 0) {
          const msg = document.createElement('div');
          msg.style.color = 'gray';
          msg.style.padding = '8px';
<<<<<<< HEAD
          const lang = document.documentElement.lang;
          msg.textContent = translations[lang] ? translations[lang].noChordsFound : translations['en'].noChordsFound;
          listDiv.appendChild(msg);
        }
        listDiv.style.display = 'block';
=======
          msg.textContent = translations[document.documentElement.lang].noChordsFound;
          listDiv.appendChild(msg);
        }
>>>>>>> b162bdd051c21fc55fee19aa6479994fa4c34728
      }

      searchInput.addEventListener('input', function() {
        renderList(this.value, rootSelect.value);
        // 當輸入搜尋時顯示列表
        listDiv.style.display = this.value ? 'block' : 'none';
      });

      // 點擊搜尋框時顯示列表
      searchInput.addEventListener('focus', function() {
        if (this.value) {
          listDiv.style.display = 'block';
        }
      });

      // 點擊其他地方時隱藏列表
      document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !listDiv.contains(e.target)) {
          listDiv.style.display = 'none';
        }
      });

      rootSelect.addEventListener('change', function() {
        renderList(searchInput.value, this.value);
        // 當選擇根音時顯示列表
        listDiv.style.display = 'block';
      });
      btnPopular.addEventListener('click', function() {
        mode = 'popular';
        btnPopular.style.background = '#d0e6fa';
        btnAll.style.background = '';
        rootSelect.value = '';
        searchInput.value = '';
        renderList();
<<<<<<< HEAD
        rootSelect.dispatchEvent(new Event('change'));
=======
>>>>>>> b162bdd051c21fc55fee19aa6479994fa4c34728
      });
      btnAll.addEventListener('click', function() {
        mode = 'all';
        btnAll.style.background = '#d0e6fa';
        btnPopular.style.background = '';
        rootSelect.value = '';
        searchInput.value = '';
        renderList();
<<<<<<< HEAD
        rootSelect.dispatchEvent(new Event('change'));
      });
=======
      });
      btnCreateSequence.addEventListener('click', function() {
        chordSequenceCreator.style.display = 'block';
        document.getElementById('chord-search-container').style.display = 'none';
        document.getElementById('chords').style.display = 'none';
        btnCreateSequence.style.background = '#d0e6fa';
        btnPopular.style.background = '';
      });

      // 初始化和弦選擇下拉框
      chordNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        sequenceChordSelect.appendChild(option);
      });

      // 添加和弦到序列
      addToSequenceBtn.addEventListener('click', function() {
        const selectedChord = sequenceChordSelect.value;
        if (selectedChord) {
          currentSequence.push(selectedChord);
          updateSequenceDisplay();
        }
      });

      // 清除序列
      clearSequenceBtn.addEventListener('click', function() {
        currentSequence = [];
        updateSequenceDisplay();
      });

      // 更新序列顯示
      function updateSequenceDisplay() {
        sequenceChordsDiv.innerHTML = '';
        currentSequence.forEach((chord, index) => {
          const chordElement = document.createElement('div');
          chordElement.className = 'sequence-chord';
          chordElement.innerHTML = `
            <span>${chord}</span>
            <button class="remove-chord" data-index="${index}">×</button>
          `;
          sequenceChordsDiv.appendChild(chordElement);
        });

        // 添加刪除按鈕事件
        document.querySelectorAll('.remove-chord').forEach(button => {
          button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            currentSequence.splice(index, 1);
            updateSequenceDisplay();
          });
        });
      }
>>>>>>> b162bdd051c21fc55fee19aa6479994fa4c34728

      // Show the first chord by default
      renderChord(selectedChord);
      renderList();
    })
    .catch(err => {
      document.getElementById('chords').innerHTML = '<div style="color:red">Failed to load chords.json</div>';
      console.error('Failed to load chords.json', err);
    });
}); 