if (typeof AudioContext == "function" || typeof webkitAudioContext == "function") {
    /* Create the context */
    var context = new AudioContext();

    var volume_controls = [];

    /* Oscillator types */
    var o_types = ['sine', 'square', 'sawtooth', 'triangle'];

    /* Object to store the oscillators */
    var oscillators = {};

    /* Object to store controls */
    var controls = {};

    /* Set the default frequency */
    var default_frequency = 261.33; // Middle C

    /* How low can you go? Answer: Low C. */
    var base_frequency = 16.35;

    /* Multiple for calculating octaves */
    var octave_ratio = 1.88776495622381;

    var octave_adjustment = 0;
} else {
    $('body').html('<h1>Error</h1><p>Web Audio API not supported.');
}

$(function() {
    /* Load the JSON */
    $.getJSON('/js/notes.json', function (json) {
        var notes = json;

        /* Set up the oscillators */
        $.each(o_types, function (key, oscillator) {
            oscillators[oscillator] = context.createOscillator();
            controls[oscillator] = {};
            controls[oscillator].type = oscillator;
            controls[oscillator].volume_input = $('#' + oscillator + '-volume');
            controls[oscillator].panner_input = $('#' + oscillator + '-pan');
            controls[oscillator].gain_node = context.createGain();
            controls[oscillator].gain_node.gain.value = controls[oscillator].volume_input.val();
            controls[oscillator].panner = context.createPanner();
            controls[oscillator].panner.setPosition(controls[oscillator].panner_input.val(), 0, 0);
            // Turn the oscillator on
            oscillators[oscillator].start()
        });

        /* Control the volume */
        $('.control.volume').change(function () {
            var volume = $(this);
            var o = volume.data('oscillator');
            controls[o].gain_node.gain.value = volume.val();
        });

        /* Control the pan */
        $('.control.pan').change(function () {
            var panner = $(this);
            var o = panner.data('oscillator');
            controls[o].panner.setPosition(panner.val(), 0, 0);
        });

        /* Change the frequency (note) */
        $('li').on('mousedown', function() {
            var li = $(this);
            var note = li.data('note');
            var frequency = notes[note];
            var o = li.parent('ol').data('oscillator');
            oscillators[o].frequency.value = frequency;
            $('.' + o + ' .playing').removeClass('playing');
            li.addClass('playing');
        });

        /* Control octaves */
        $('.control.octave').click(function () {
            var button = $(this);
            var o = button.data('oscillator');
            var shift = button.data('octave');
            var current_frequency = $('ol.' + o + ' .playing').data('frequency');
            var new_frequency = current_frequency * (shift * octave_ratio);
            $('.current-frequency').text(new_frequency);
            oscillators[o].frequency.value = new_frequency;
        });

        /* On/Off Controls */
        $('.control').on('click', function() {
            var c = $(this);
            var control = c.data('control');
            var action = c.data('action');
            var o = c.data('oscillator');

            if (control == "start") {
                // Get the note
                var playing = $('ol.' + o + ' li.playing').data('note');

                // Map the note to a frequency
                var frequency = notes[playing];

                // Set the panner input
                var panner_input = $('#' + o + '-pan');

                // Set the oscillator type
                oscillators[o].type = controls[o].type;

                // Set the frequency
                oscillators[o].frequency.value = frequency;

                // Set the pan value
                controls[o].panner.setPosition(panner_input.val(), 0, 0);

                // Connect the oscillator to the panner
                oscillators[o].connect(controls[o].panner);

                // Connect the panner to the gain-node (volume)
                controls[o].panner.connect(controls[o].gain_node);

                // Connect the gain node to the output (destination)
                controls[o].gain_node.connect(context.destination);
            }

            if (control == "stop") {
                oscillators[o].disconnect();
            } else if (control == 'all-stop') {
                $.each(oscillators, function (key, oscillator) {
                    oscillator.disconnect();
                });
            }
        });
    });
});
