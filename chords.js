fetch('chords.json')
  .then(response => response.json())
  .then(data => {
    // Filter out sharp chords from the data
    const filteredData = {};
    Object.keys(data).forEach(key => {
      if (!key.includes('#')) {
        filteredData[key] = data[key];
      }
    });
    // data is an object: { "C": [...], "Cm": [...], ... }
    const chordNames = Object.keys(filteredData);
    const searchInput = document.getElementById('chord-search');
    const listDiv = document.getElementById('chord-list');
    const rootSelect = document.getElementById('root-select');
    const categorySelect = document.getElementById('category-select');
    const chordTypeSelect = document.getElementById('chord-type-select');
    const btnPopular = document.getElementById('btn-popular');
    const btnAll = document.getElementById('btn-all');
    let selectedChord = chordNames[0];
    const MAX_RESULTS = 100;
    const popularChords = [
      // Major Chords
      'C', 'D', 'E', 'F', 'G', 'A', 'B',
      // Minor Chords
      'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm',
      // 7th Chords
      'C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7',
      // Major 7th Chords
      'Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7',
      // Minor 7th Chords
      'Cm7', 'Dm7', 'Em7', 'Fm7', 'Gm7', 'Am7', 'Bm7',
      // Suspended Chords
      'Csus2', 'Dsus2', 'Esus2', 'Fsus2', 'Gsus2', 'Asus2', 'Bsus2',
      'Csus4', 'Dsus4', 'Esus4', 'Fsus4', 'Gsus4', 'Asus4', 'Bsus4',
      // Diminished Chords
      'Cdim', 'Ddim', 'Edim', 'Fdim', 'Gdim', 'Adim', 'Bdim',
      // Augmented Chords
      'Caug', 'Daug', 'Eaug', 'Faug', 'Gaug', 'Aaug', 'Baug',
      // 6th Chords
      'C6', 'D6', 'E6', 'F6', 'G6', 'A6', 'B6',
      // 9th Chords
      'C9', 'D9', 'E9', 'F9', 'G9', 'A9', 'B9',
      // Add9 Chords
      'Cadd9', 'Dadd9', 'Eadd9', 'Fadd9', 'Gadd9', 'Aadd9', 'Badd9',
      // Power Chords
      'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5',
      // Additional Common Chords
      'Em7b5', 'Am7b5', 'Dm7b5', 'Gm7b5',
      'C7b9', 'D7b9', 'E7b9', 'F7b9', 'G7b9', 'A7b9', 'B7b9',
      'C7#9', 'D7#9', 'E7#9', 'F7#9', 'G7#9', 'A7#9', 'B7#9'
    ];

    function renderChord(name) {
      const chord = filteredData[name][0];
      const positions = chord.positions.map(p => p === "x" ? -1 : parseInt(p, 10)); // -1 for mute
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
      container.appendChild(playBtn);
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

    // Helper function to determine chord category
    function getChordCategory(chordName) {
      if (chordName.endsWith('maj7')) return 'maj7';
      if (chordName.endsWith('m7')) return 'm7';
      if (chordName.endsWith('7')) return '7';
      if (chordName.endsWith('m')) return 'minor';
      if (chordName.endsWith('sus2') || chordName.endsWith('sus4')) return 'sus';
      if (chordName.endsWith('dim')) return 'dim';
      if (chordName.endsWith('aug')) return 'aug';
      if (chordName.endsWith('6')) return '6';
      if (chordName.endsWith('9')) return '9';
      if (chordName.endsWith('add9')) return 'add9';
      if (chordName.endsWith('5')) return '5';
      return 'major';
    }

    // Helper function to determine chord type
    function getChordType(chordName, positions) {
      // Check if it's a power chord first
      if (chordName.endsWith('5')) return 'power';
      
      // Check if it's a barre chord (any position above fret 0)
      if (positions.some(p => p > 0)) return 'barre';
      
      // Check if it's a jazz chord (complex chord types)
      if (chordName.includes('maj7') || 
          chordName.includes('7') || 
          chordName.includes('9') || 
          chordName.includes('11') || 
          chordName.includes('13') || 
          chordName.includes('dim') || 
          chordName.includes('aug')) {
        return 'jazz';
      }
      
      // Default to open chord
      return 'open';
    }

    function renderList(filter = '', root = '', category = '', chordType = '') {
      listDiv.innerHTML = '';
      let filtered = popularChords.filter(name => !name.includes('#'));
      
      if (root) {
        filtered = filtered.filter(name => name[0].toUpperCase() === root);
      }
      
      if (category) {
        filtered = filtered.filter(name => getChordCategory(name) === category);
      }

      if (chordType) {
        filtered = filtered.filter(name => {
          const chord = filteredData[name][0];
          if (!chord) return false;
          const positions = chord.positions.map(p => p === "x" ? -1 : parseInt(p, 10));
          return getChordType(name, positions) === chordType;
        });
      }
      
      filtered = filtered.filter(name => name.toLowerCase().includes(filter.toLowerCase()));
      const toShow = filtered.slice(0, MAX_RESULTS);
      
      // Group chords by category
      const groupedChords = {};
      toShow.forEach(name => {
        const category = getChordCategory(name);
        if (!groupedChords[category]) {
          groupedChords[category] = [];
        }
        groupedChords[category].push(name);
      });

      // Render chords by category
      Object.entries(groupedChords).forEach(([category, chords]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.style.marginBottom = '16px';
        
        const categoryTitle = document.createElement('div');
        categoryTitle.style.fontWeight = 'bold';
        categoryTitle.style.color = '#2c3e50';
        categoryTitle.style.marginBottom = '8px';
        categoryTitle.style.padding = '4px 8px';
        categoryTitle.style.background = '#f0f0f0';
        categoryTitle.style.borderRadius = '4px';
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1) + ' Chords';
        categoryDiv.appendChild(categoryTitle);

        chords.forEach(name => {
          const item = document.createElement('div');
          item.className = 'chord-item' + (name === selectedChord ? ' selected' : '');
          item.textContent = name;
          item.onclick = () => {
            selectedChord = name;
            renderChord(name);
            renderList(searchInput.value, rootSelect.value, categorySelect.value, chordTypeSelect.value);
          };
          categoryDiv.appendChild(item);
        });

        listDiv.appendChild(categoryDiv);
      });

      if (filtered.length > MAX_RESULTS) {
        const msg = document.createElement('div');
        msg.style.color = 'gray';
        msg.style.padding = '8px';
        msg.textContent = `Too many results (${filtered.length}). Please refine your search.`;
        listDiv.appendChild(msg);
      } else if (filtered.length === 0) {
        const msg = document.createElement('div');
        msg.style.color = 'gray';
        msg.style.padding = '8px';
        msg.textContent = 'No chords found.';
        listDiv.appendChild(msg);
      }
    }

    searchInput.addEventListener('input', function() {
      renderList(this.value, rootSelect.value, categorySelect.value, chordTypeSelect.value);
    });
    
    rootSelect.addEventListener('change', function() {
      renderList(searchInput.value, this.value, categorySelect.value, chordTypeSelect.value);
    });
    
    categorySelect.addEventListener('change', function() {
      renderList(searchInput.value, rootSelect.value, this.value, chordTypeSelect.value);
    });

    chordTypeSelect.addEventListener('change', function() {
      renderList(searchInput.value, rootSelect.value, categorySelect.value, this.value);
    });

    // Remove the popular/all toggle functionality since we're only showing popular chords
    btnPopular.style.display = 'none';
    btnAll.style.display = 'none';

    // Chord progression playback
    function playProgression(chords) {
      let delay = 0;
      const chordDelay = 1000; // 1 second between chords
      
      chords.forEach(chordName => {
        setTimeout(() => {
          const chord = filteredData[chordName][0];
          if (chord) {
            const positions = chord.positions.map(p => p === "x" ? -1 : parseInt(p, 10));
            playChord(positions);
            // Highlight the chord in the list
            const items = document.getElementsByClassName('chord-item');
            Array.from(items).forEach(item => {
              item.classList.remove('selected');
              if (item.textContent === chordName) {
                item.classList.add('selected');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            });
          }
        }, delay);
        delay += chordDelay;
      });
    }

    // Show the first chord by default
    renderChord(selectedChord);
    renderList();

    // Play chord function
    function playChord(positions) {
      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Guitar string frequencies (from low E to high E)
      const stringFrequencies = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];
      
      // Play each string
      positions.forEach((fret, stringIndex) => {
        if (fret < 0) return; // Skip muted strings
        
        // Calculate frequency based on fret position
        const frequency = stringFrequencies[stringIndex] * Math.pow(2, fret / 12);
        
        // Create oscillator
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Set up oscillator
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        
        // Set up gain (volume) envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Start and stop the note
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
      });
    }
  })
  .catch(err => {
    document.getElementById('chords').innerHTML = '<div style="color:red">Failed to load chords.json</div>';
    console.error('Failed to load chords.json', err);
  }); 