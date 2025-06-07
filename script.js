const chords = [
    // Major Chords
    'C', 'G', 'D', 'A', 'E', 'F', 'B', 'C#', 'D#', 'F#', 'G#', 'A#',
    // Minor Chords
    'Am', 'Em', 'Dm', 'Gm', 'Bm', 'Cm', 'F#m', 'C#m', 'D#m', 'G#m', 'A#m',
    // 7th Chords
    'C7', 'G7', 'D7', 'A7', 'E7', 'F7', 'B7', 'C#7', 'D#7', 'F#7', 'G#7', 'A#7',
    // Major 7th Chords
    'Cmaj7', 'Gmaj7', 'Dmaj7', 'Amaj7', 'Emaj7', 'Fmaj7', 'Bmaj7',
    // Minor 7th Chords
    'Am7', 'Em7', 'Dm7', 'Gm7', 'Bm7', 'Cm7', 'F#m7',
    // Suspended Chords
    'Csus4', 'Gsus4', 'Dsus4', 'Asus4', 'Esus4', 'Fsus4',
    // Add9 Chords
    'Cadd9', 'Gadd9', 'Dadd9', 'Aadd9', 'Eadd9',
    // Power Chords
    'C5', 'G5', 'D5', 'A5', 'E5', 'F5', 'B5',
    // Diminished Chords
    'Cdim', 'Gdim', 'Ddim', 'Adim', 'Edim',
    // Augmented Chords
    'Caug', 'Gaug', 'Daug', 'Aaug', 'Eaug',
    // 6th Chords
    'C6', 'G6', 'D6', 'A6', 'E6',
    // 9th Chords
    'C9', 'G9', 'D9', 'A9', 'E9',
    // Minor 6th Chords
    'Am6', 'Em6', 'Dm6', 'Gm6',
    // Minor 9th Chords
    'Am9', 'Em9', 'Dm9', 'Gm9',
    // Major 9th Chords
    'Cmaj9', 'Gmaj9', 'Dmaj9', 'Amaj9',
    // 13th Chords
    'C13', 'G13', 'D13', 'A13',
    // Minor 11th Chords
    'Am11', 'Em11', 'Dm11',
    // Major 11th Chords
    'Cmaj11', 'Gmaj11', 'Dmaj11',
    // 7sus4 Chords
    'C7sus4', 'G7sus4', 'D7sus4',
    // 7b9 Chords
    'C7b9', 'G7b9', 'D7b9'
]; 

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the chord list container
    const chordList = document.getElementById('chord-list');
    const chordsContainer = document.getElementById('chords');
    
    // Add a title for the chord list
    const title = document.createElement('h2');
    title.textContent = 'Popular Guitar Chords';
    title.style.color = '#2c3e50';
    title.style.marginBottom = '16px';
    chordList.insertBefore(title, chordList.firstChild);

    // Add a message about the chord list
    const message = document.createElement('p');
    message.textContent = 'Click on any chord to see its diagram and play it.';
    message.style.color = '#666';
    message.style.marginBottom = '16px';
    chordList.insertBefore(message, chordList.firstChild);
}); 