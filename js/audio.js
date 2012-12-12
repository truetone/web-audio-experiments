if('webkitAudioContext' in window)
{
	var context = new webkitAudioContext();
	var oscillator_sine = context.createOscillator();
	var default_frequency = 261.33;
	oscillator_sine.type = 0; // 0 = sine wave
	oscillator_sine.frequency.value = default_frequency;
	oscillator_sine.connect(context.destination); // Connect to speakers
}
else
{
	$('body').append('<p>webkitAudioAPI not supported.');
}

$(function()
{
	$('button').on('click', function()
	{
		if ($(this).data('control') == "stop")
		{
			oscillator_sine.noteOff(0);
		}

		if ($(this).data('control') == "start")
		{
		//	oscillator_sine.noteOn();
			for (var i = 0; i < 8; i++)
			{
			    var rest = i / 16;
			    oscillator_sine.noteOn(context.currentTime + rest);
			}
		}
	});

	$('li').on('mousedown', function()
	{
		frequency = $(this).data('frequency');
		oscillator_sine.frequency.value = frequency;
		oscillator_sine.noteOn(0);
	});
});
