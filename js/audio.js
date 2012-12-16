if (typeof AudioContext == "function" || typeof webkitAudioContext == "function")
{
	/* Create the context */
	var context = new webkitAudioContext();
	
	/* Set up volume controls */
	var sine_volume = context.createGainNode();
	var square_volume = context.createGainNode();
	var sawtooth_volume = context.createGainNode();
	var triangle_volume = context.createGainNode();

	/* Set panning controls */
	var sine_panner = context.createPanner();
	var square_panner = context.createPanner();
	var sawtooth_panner = context.createPanner();
	var triangle_panner = context.createPanner();
	
	/* Set up the oscillators */
	var oscillator_sine = context.createOscillator();
	var oscillator_square = context.createOscillator();
	var oscillator_sawtooth = context.createOscillator();
	var oscillator_triangle = context.createOscillator();

	/* Set the default frequency */
	var default_frequency = 261.33; // Middle C
}
else
{
	$('body').html('<h1>Error</h1><p>webkitAudioAPI not supported.');
}

$(function()
{
	var sine_volume_input = $('#sine-volume');
	var square_volume_input = $('#square-volume');
	var sawtooth_volume_input = $('#sawtooth-volume');
	var triangle_volume_input = $('#triangle-volume');

	sine_volume.gain.value = sine_volume_input.val();
	square_volume.gain.value = square_volume_input.val();
	sawtooth_volume.gain.value = sawtooth_volume_input.val();
	triangle_volume.gain.value = triangle_volume_input.val();

	sine_volume_input.change(function()
	{
		sine_volume.gain.value = $(this).val();
	});

	square_volume_input.change(function()
	{
		square_volume.gain.value = $(this).val();
	});

	sawtooth_volume_input.change(function()
	{
		sawtooth_volume.gain.value = $(this).val();
	});

	triangle_volume_input.change(function()
	{
		triangle_volume.gain.value = $(this).val();
	});

	$('.control').on('click', function()
	{
		var id = $(this).attr('id');

		if ($(this).data('control') == "stop")
		{

			if (id == 'sine-stop')
			{
				oscillator_sine.disconnect();
			}
			else if (id == 'square-stop')
			{
				oscillator_square.disconnect();
			}
			else if (id == 'sawtooth-stop')
			{
				oscillator_sawtooth.disconnect();
			}
			else if (id == 'triangle-stop')
			{
				oscillator_triangle.disconnect();
			}
			else if (id == 'all-stop')
			{
				oscillator_sine.disconnect();
				oscillator_square.disconnect();
				oscillator_sawtooth.disconnect();
				oscillator_triangle.disconnect();
			}
		}

		if ($(this).data('control') == "start")
		{
			if (id == 'sine-start')
			{
				oscillator_sine.noteOn(0);
				oscillator_sine.type = 0; // 0 = sine wave

				// Assign a frequency
				oscillator_sine.frequency.value = default_frequency;

				// Set the position of the panner (x, y, z)
				sine_panner.setPosition(-66, 0, 0);

				// Connect the oscillator to the panner
				oscillator_sine.connect(sine_panner);

				// Connect the panner to the volume control
				sine_panner.connect(sine_volume);

				sine_volume.connect(context.destination);
			}
			else if (id == 'square-start')
			{
				oscillator_square.noteOn(0);
				oscillator_square.type = 1; // 1 = square wave
				oscillator_square.frequency.value = 392; // G
				square_panner.setPosition(-33, 0 ,0);
				oscillator_square.connect(square_panner);
				square_panner.connect(square_volume);
				square_volume.connect(context.destination);
			}
			else if (id == 'sawtooth-start')
			{
				oscillator_sawtooth.noteOn(0);
				oscillator_sawtooth.type = 2; // 2 = sawtooth wave
				oscillator_sawtooth.frequency.value = 493.88; // B
				sawtooth_panner.setPosition(33, 0, 0);
				oscillator_sawtooth.connect(sawtooth_panner);
				sawtooth_panner.connect(sawtooth_volume);
				sawtooth_volume.connect(context.destination);
			}
			else if (id == 'triangle-start')
			{
				oscillator_triangle.noteOn(0);
				oscillator_triangle.type = 3; // 3 = triangle wave
				oscillator_triangle.frequency.value = 523.25; // C
				triangle_panner.setPosition(66, 0, 0);
				oscillator_triangle.connect(triangle_panner);
				triangle_panner.connect(triangle_volume);
				triangle_volume.connect(context.destination);
			}
		}
	});

	$('.sine li').on('mousedown', function()
	{
		frequency = $(this).data('frequency');
		oscillator_sine.frequency.value = frequency;
		$('.sine .playing').removeClass('playing');
		$(this).addClass('playing');
	});

	$('.square li').on('mousedown', function()
	{
		frequency = $(this).data('frequency');
		oscillator_square.frequency.value = frequency;
		$('.square .playing').removeClass('playing');
		$(this).addClass('playing');
	});

	$('.sawtooth li').on('mousedown', function()
	{
		frequency = $(this).data('frequency');
		oscillator_sawtooth.frequency.value = frequency;
		$('.sawtooth .playing').removeClass('playing');
		$(this).addClass('playing');
	});

	$('.triangle li').on('mousedown', function()
	{
		frequency = $(this).data('frequency');
		oscillator_triangle.frequency.value = frequency;
		$('.triangle .playing').removeClass('playing');
		$(this).addClass('playing');
	});

});
