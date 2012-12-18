if (typeof AudioContext == "function" || typeof webkitAudioContext == "function")
{
	/* Create the context */
	var context = new webkitAudioContext();
	
	var volume_controls = new Array();

	/* Oscillator types */
	var o_types = ['sine', 'square', 'sawtooth', 'triangle'];

	/* Array to store the oscillators */
	var oscillators = new Object;

	/* Array to store controls */
	var controls = new Object;

	/* Set the default frequency */
	var default_frequency = 261.33; // Middle C

	/* How low can you go? Answer: Low C. */
	var base_frequency = 16.35;

	/* Multiple for calculating octaves */
	var octave_ratio = 1.88776495622381;

	var octave_adjustment = 0;
}
else
{
	$('body').html('<h1>Error</h1><p>Web Audio API not supported.');
}

$(function()
{
	/* Set up the oscillators */
	$.each(o_types, function (key, oscillator)
	{
		oscillators[oscillator] = context.createOscillator();
		controls[oscillator] = new Object;
		controls[oscillator].type = key;
		controls[oscillator].volume_input = $('#' + oscillator + '-volume');
		controls[oscillator].panner_input = $('#' + oscillator + '-pan');
		controls[oscillator].gain_node = context.createGainNode();
		controls[oscillator].gain_node.gain.value = controls[oscillator].volume_input.val();
		controls[oscillator].panner = context.createPanner();
		controls[oscillator].panner.setPosition(controls[oscillator].panner_input.val(), 0, 0);
	});

	/* Control the volume */
	$('.control.volume').change(function ()
	{
		o = $(this).data('oscillator');
		controls[o].gain_node.gain.value = $(this).val();
	});

	/* Control the pan */
	$('.control.pan').change(function ()
	{
		o = $(this).data('oscillator');
		controls[o].panner.setPosition($(this).val(), 0, 0);
	});

	/* On/Off Controls */
	$('.control').on('click', function()
	{
		var c = $(this);
		var control = c.data('control');
		var action = c.data('action');
		var o = c.data('oscillator');

		if (control == "stop")
		{
			oscillators[o].disconnect();

		}
		else if (control == 'all-stop')
		{
			$.each(oscillators, function (key, oscillator)
			{
				oscillator.disconnect();
			});
		}

		if (control == "start")
		{
			var frequency = $('ol.' + o + ' li.playing').data('frequency');
			var panner_input = $('#' + o + '-pan');

			// Turn the oscillator on
			oscillators[o].noteOn(0);

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
	});

	/* Change the frequency (note) */
	$('li').on('mousedown', function()
	{
		var li = $(this);
		var frequency = li.data('frequency');
		var o = li.parent('ol').data('oscillator');
		oscillators[o].frequency.value = frequency;
		$('.' + o + ' .playing').removeClass('playing');
		li.addClass('playing');
	});

});
