// Translations for multilingual support
const translations = {
  en: {
    title: "Guitar Chords Explorer",
    intro: "Search and explore guitar chords with interactive diagrams and sound playback.",
    popularChords: "Popular Chords",
    searchPlaceholder: "Search chords...",
    allRoots: "All Roots",
    selectChord: "Select a chord...",
    tooManyResults: "Too many results. Please refine your search.",
    noChordsFound: "No chords found."
  }
};

let guitarSoundfont = null;

function switchLanguage(lang) {
  document.getElementById('title').textContent = translations[lang].title;
  document.getElementById('intro').textContent = translations[lang].intro;
  document.getElementById('btn-popular').textContent = translations[lang].popularChords;
  document.getElementById('chord-search').placeholder = translations[lang].searchPlaceholder;
  document.getElementById('root-select').options[0].text = translations[lang].allRoots;
  document.documentElement.lang = lang;
}

function loadSoundfont() {
  if (window.MIDI && window.MIDI.Soundfont && window.MIDI.Soundfont.acoustic_guitar_nylon) {
    guitarSoundfont = window.MIDI.Soundfont.acoustic_guitar_nylon;
    return;
  }
  const script = document.createElement('script');
  script.src = 'guitar-sounds/acoustic_guitar_nylon-mp3.js';
  script.onload = () => {
    guitarSoundfont = window.MIDI.Soundfont.acoustic_guitar_nylon;
  };
  script.onerror = () => {
    console.error('Failed to load soundfont script!');
  };
  document.body.appendChild(script);
}

const stringNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];

function getNoteName(stringIdx, fret) {
  if (fret < 0) return null;
  const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const open = stringNotes[stringIdx];
  const note = open.match(/([A-G]#?)(\d)/);
  let idx = noteOrder.indexOf(note[1]);
  let octave = parseInt(note[2], 10);
  idx += fret;
  while (idx >= 12) { idx -= 12; octave += 1; }
  return noteOrder[idx] + octave;
}

function playChord(positions) {
  if (!guitarSoundfont) {
    loadSoundfont();
    alert('Guitar sound loading, please try again.');
    return;
  }
  let delay = 0;
  for (let i = 0; i < 6; i++) {
    const fret = positions[i];
    if (fret < 0 || fret > 5) continue;
    const note = getNoteName(i, fret);
    const url = guitarSoundfont[note];
    if (!url) continue;
    setTimeout(() => {
      try {
        const audio = new Audio(url);
        audio.play();
      } catch (err) {
        console.error('Exception playing note: ' + note, err);
      }
    }, delay);
    delay += 120;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSoundfont();
  fetch('https://kenkwan101.github.io/guitar-chords-web/chords.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.arrayBuffer();
    })
    .then(buffer => {
      // Decompress the gzipped data
      const decompressed = pako.inflate(new Uint8Array(buffer), { to: 'string' });
      return JSON.parse(decompressed);
    })
    .then(data => {
      const chordNames = Object.keys(data);
      const searchInput = document.getElementById('chord-search');
      const listDiv = document.getElementById('chord-list');
      const rootSelect = document.getElementById('root-select');
      const btnPopular = document.getElementById('btn-popular');
      const btnAll = document.getElementById('btn-all');
      let selectedChord = chordNames[0];
      const MAX_RESULTS = 100;
      let mode = 'all';
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
        });
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
        container.style.fontSize = '1.5em';
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
          // Create a grid container for root-specific chords
          const gridContainer = document.createElement('div');
          gridContainer.style.display = 'grid';
          gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
          gridContainer.style.gap = '10px';
          gridContainer.style.marginTop = '20px';
          
          filtered.forEach(name => {
            const chordItem = document.createElement('div');
            chordItem.className = 'chord-item' + (name === selectedChord ? ' selected' : '');
            chordItem.textContent = name;
            chordItem.style.cursor = 'pointer';
            chordItem.style.padding = '8px';
            chordItem.style.textAlign = 'center';
            chordItem.style.background = name === selectedChord ? '#d0e6fa' : '#f4f4f4';
            chordItem.style.borderRadius = '6px';
            chordItem.style.transition = 'all 0.2s';
            chordItem.onmouseover = () => {
              if (name !== selectedChord) {
                chordItem.style.background = '#e0eafc';
              }
            };
            chordItem.onmouseout = () => {
              if (name !== selectedChord) {
                chordItem.style.background = '#f4f4f4';
              }
            };
            chordItem.onclick = () => {
              selectedChord = name;
              renderChord(name);
              renderList(searchInput.value, rootSelect.value);
              searchInput.value = '';
              listDiv.style.display = 'none';
            };
            gridContainer.appendChild(chordItem);
          });
          
          listDiv.appendChild(gridContainer);
          listDiv.style.display = 'block';
          return;
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
            searchInput.value = '';
            listDiv.style.display = 'none';
          };
          listDiv.appendChild(item);
        });
        if (filtered.length > MAX_RESULTS) {
          const msg = document.createElement('div');
          msg.style.color = 'gray';
          msg.style.padding = '8px';
          msg.textContent = translations['en'].tooManyResults;
          listDiv.appendChild(msg);
        } else if (filtered.length === 0) {
          const msg = document.createElement('div');
          msg.style.color = 'gray';
          msg.style.padding = '8px';
          msg.textContent = translations['en'].noChordsFound;
          listDiv.appendChild(msg);
        }
        listDiv.style.display = 'block';
      }

      searchInput.addEventListener('input', function() {
        renderList(this.value, rootSelect.value);
        listDiv.style.display = this.value ? 'block' : 'none';
      });

      searchInput.addEventListener('focus', function() {
        if (this.value) {
          listDiv.style.display = 'block';
        }
      });

      document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !listDiv.contains(e.target)) {
          listDiv.style.display = 'none';
        }
      });

      rootSelect.addEventListener('change', function() {
        renderList(searchInput.value, this.value);
        listDiv.style.display = 'block';
      });
      btnPopular.addEventListener('click', function() {
        mode = 'popular';
        btnPopular.style.background = '#d0e6fa';
        btnAll.style.background = '';
        rootSelect.value = '';
        searchInput.value = '';
        renderList();
        rootSelect.dispatchEvent(new Event('change'));
      });
      btnAll.addEventListener('click', function() {
        mode = 'all';
        btnAll.style.background = '#d0e6fa';
        btnPopular.style.background = '';
        rootSelect.value = '';
        searchInput.value = '';
        renderList();
        rootSelect.dispatchEvent(new Event('change'));
      });
      renderChord(selectedChord);
      renderList();
    })
    .catch(err => {
      console.error('Failed to load chords.json', err);
      document.getElementById('chords').innerHTML = '<div style="color:red">Failed to load chords.json</div>';
    });
}); 