var context = new webkitAudioContext(),
    oscillator = context.createOscillator;
oscillator.type = 0;
oscillator.frequency.value = 500;
oscillator.connect(context.destination); // Connect to speakers
oscillator.noteOn(0); // Autoplay
