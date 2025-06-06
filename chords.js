// Translations for multilingual support
const translations = {
  en: {
    title: "Guitar Chords Explorer",
    intro: "Search and explore guitar chords with interactive diagrams and sound playback.",
    popularChords: "Popular Chords",
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
  fetch('chords.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const chordNames = Object.keys(data);
      const listDiv = document.getElementById('chord-list');
      const rootSelect = document.getElementById('root-select');
      const chordTypeSelect = document.getElementById('chord-type-select');
      const btnPopular = document.getElementById('btn-popular');
      const popularBtn = document.getElementById('popular-btn');
      let selectedChord = '';
      let mode = 'all';

      // Define popular chords
      const popularChords = [
        'C', 'G', 'D', 'A', 'E', 'F', 'Am', 'Em', 'Dm', 'G7', 'C7', 'D7',
        'E7', 'A7', 'B7', 'Fmaj7', 'Cmaj7', 'Gmaj7', 'Dmaj7', 'Amaj7',
        'Emaj7', 'Bmaj7', 'F#maj7', 'C#maj7', 'G#maj7', 'D#maj7', 'A#maj7',
        'Fm', 'Bm', 'Gm', 'Cm', 'Dm', 'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m',
        'D#m', 'A#m', 'F#', 'C#', 'G#', 'D#', 'A#', 'B', 'E', 'A', 'D', 'G'
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

      function renderList(root = '', chordType = '') {
        listDiv.innerHTML = '';
        
        if (!root) {
          const msg = document.createElement('div');
          msg.style.color = '#666';
          msg.style.padding = '20px';
          msg.style.textAlign = 'center';
          msg.style.fontSize = '1.1em';
          msg.textContent = 'Please select a root note to view chords';
          listDiv.appendChild(msg);
          return;
        }

        let filtered = chordNames;
        if (mode === 'popular') {
          filtered = filtered.filter(name => popularChords.includes(name));
        }
        filtered = filtered.filter(name => name[0].toUpperCase() === root);

        // Group chords by type with subcategories
        const chordGroups = {
          'Basic Chords': {
            'Major': filtered.filter(name => !name.includes('m') && !name.includes('7') && !name.includes('maj7') && !name.includes('dim') && !name.includes('aug')),
            'Minor': filtered.filter(name => name.includes('m') && !name.includes('7') && !name.includes('maj7') && !name.includes('dim')),
            'Diminished': filtered.filter(name => name.includes('dim')),
            'Augmented': filtered.filter(name => name.includes('aug'))
          },
          '7th Chords': {
            'Dominant 7th': filtered.filter(name => name.includes('7') && !name.includes('maj7') && !name.includes('m7')),
            'Major 7th': filtered.filter(name => name.includes('maj7')),
            'Minor 7th': filtered.filter(name => name.includes('m7')),
            'Diminished 7th': filtered.filter(name => name.includes('dim7'))
          },
          'Extended Chords': {
            '9th': filtered.filter(name => name.includes('9')),
            '11th': filtered.filter(name => name.includes('11')),
            '13th': filtered.filter(name => name.includes('13')),
            '6th': filtered.filter(name => name.includes('6') && !name.includes('m6'))
          },
          'Suspended Chords': {
            'Sus2': filtered.filter(name => name.includes('sus2')),
            'Sus4': filtered.filter(name => name.includes('sus4'))
          },
          'Other': {
            'Add Chords': filtered.filter(name => name.includes('add')),
            'Altered': filtered.filter(name => name.includes('alt')),
            'Miscellaneous': filtered.filter(name => {
              const isBasic = !name.includes('m') && !name.includes('7') && !name.includes('maj7') && !name.includes('dim') && !name.includes('aug');
              const isMinor = name.includes('m') && !name.includes('7') && !name.includes('maj7') && !name.includes('dim');
              const isDim = name.includes('dim');
              const isAug = name.includes('aug');
              const is7th = name.includes('7') && !name.includes('maj7') && !name.includes('m7');
              const isMaj7 = name.includes('maj7');
              const isMin7 = name.includes('m7');
              const isDim7 = name.includes('dim7');
              const is9th = name.includes('9');
              const is11th = name.includes('11');
              const is13th = name.includes('13');
              const is6th = name.includes('6') && !name.includes('m6');
              const isSus2 = name.includes('sus2');
              const isSus4 = name.includes('sus4');
              const isAdd = name.includes('add');
              const isAlt = name.includes('alt');
              return !isBasic && !isMinor && !isDim && !isAug && !is7th && !isMaj7 && !isMin7 && !isDim7 && 
                     !is9th && !is11th && !is13th && !is6th && !isSus2 && !isSus4 && !isAdd && !isAlt;
            })
          }
        };

        // Filter by chord type if selected
        if (chordType) {
          const typeMap = {
            'basic': 'Basic Chords',
            '7th': '7th Chords',
            'extended': 'Extended Chords',
            'suspended': 'Suspended Chords',
            'other': 'Other'
          };
          const selectedType = typeMap[chordType];
          if (selectedType) {
            const filteredGroups = {};
            filteredGroups[selectedType] = chordGroups[selectedType];
            chordGroups = filteredGroups;
          }
        }

        // Create container for all groups
        const allGroupsContainer = document.createElement('div');
        allGroupsContainer.style.display = 'flex';
        allGroupsContainer.style.flexDirection = 'column';
        allGroupsContainer.style.gap = '30px';
        allGroupsContainer.style.padding = '0 10px';

        // Render each main category
        Object.entries(chordGroups).forEach(([mainType, subCategories]) => {
          // Check if any subcategory has chords
          const hasChords = Object.values(subCategories).some(chords => chords.length > 0);
          if (!hasChords) return;

          // Create main category container
          const mainCategoryContainer = document.createElement('div');
          mainCategoryContainer.style.display = 'flex';
          mainCategoryContainer.style.flexDirection = 'column';
          mainCategoryContainer.style.gap = '15px';

          // Add main category header
          const mainHeader = document.createElement('div');
          mainHeader.textContent = mainType;
          mainHeader.style.fontSize = '1.4em';
          mainHeader.style.fontWeight = 'bold';
          mainHeader.style.color = '#2c3e50';
          mainHeader.style.padding = '5px 0';
          mainHeader.style.borderBottom = '3px solid #2d8cf0';
          mainCategoryContainer.appendChild(mainHeader);

          // Render each subcategory
          Object.entries(subCategories).forEach(([subType, chords]) => {
            if (chords.length === 0) return;

            // Create subcategory container
            const subCategoryContainer = document.createElement('div');
            subCategoryContainer.style.display = 'flex';
            subCategoryContainer.style.flexDirection = 'column';
            subCategoryContainer.style.gap = '8px';
            subCategoryContainer.style.marginLeft = '15px';

            // Add subcategory header
            const subHeader = document.createElement('div');
            subHeader.textContent = subType;
            subHeader.style.fontSize = '1.1em';
            subHeader.style.fontWeight = '500';
            subHeader.style.color = '#34495e';
            subHeader.style.padding = '3px 0';
            subHeader.style.borderBottom = '1px solid #bdc3c7';
            subCategoryContainer.appendChild(subHeader);

            // Create grid for chords
            const gridContainer = document.createElement('div');
            gridContainer.style.display = 'grid';
            gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
            gridContainer.style.gap = '8px';
            gridContainer.style.marginTop = '5px';
            
            chords.forEach(name => {
              const chordItem = document.createElement('div');
              chordItem.className = 'chord-item' + (name === selectedChord ? ' selected' : '');
              chordItem.textContent = name;
              chordItem.style.cursor = 'pointer';
              chordItem.style.padding = '10px';
              chordItem.style.textAlign = 'center';
              chordItem.style.background = name === selectedChord ? '#d0e6fa' : '#f4f4f4';
              chordItem.style.borderRadius = '6px';
              chordItem.style.transition = 'all 0.2s';
              chordItem.style.fontSize = '1em';
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
                renderList(rootSelect.value, chordTypeSelect.value);
              };
              gridContainer.appendChild(chordItem);
            });

            subCategoryContainer.appendChild(gridContainer);
            mainCategoryContainer.appendChild(subCategoryContainer);
          });

          allGroupsContainer.appendChild(mainCategoryContainer);
        });
        
        listDiv.appendChild(allGroupsContainer);
        
        if (filtered.length === 0) {
          const msg = document.createElement('div');
          msg.style.color = 'gray';
          msg.style.padding = '8px';
          msg.style.textAlign = 'center';
          msg.style.marginTop = '10px';
          msg.textContent = translations['en'].noChordsFound;
          listDiv.appendChild(msg);
        }
        
        listDiv.style.display = 'block';
      }

      // Add event listeners for root and chord type selectors
      rootSelect.addEventListener('change', () => {
        const selectedRoot = rootSelect.value;
        const selectedType = chordTypeSelect.value;
        renderList(selectedRoot, selectedType);
      });

      chordTypeSelect.addEventListener('change', () => {
        const selectedRoot = rootSelect.value;
        const selectedType = chordTypeSelect.value;
        renderList(selectedRoot, selectedType);
      });

      // Add event listener for Popular Chords button
      popularBtn.addEventListener('click', () => {
        mode = mode === 'popular' ? 'all' : 'popular';
        popularBtn.textContent = mode === 'popular' ? 'Show All Chords' : 'Popular Chords';
        const selectedRoot = rootSelect.value;
        const selectedType = chordTypeSelect.value;
        renderList(selectedRoot, selectedType);
      });

      renderChord(selectedChord);
      renderList(rootSelect.value);
    })
    .catch(err => {
      console.error('Failed to load chords.json', err);
      document.getElementById('chords').innerHTML = '<div style="color:red">Failed to load chords.json</div>';
    });
}); 