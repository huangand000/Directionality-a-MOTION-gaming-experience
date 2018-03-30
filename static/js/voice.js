var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;
// recognition.continuous = true;
recognition.start();
console.log("Listening");
recognition.onresult = function(event) {
    console.log(event.results[event.results.length - 1][0].transcript);
    if (event.results[event.results.length - 1][0].transcript == 'difficulty easy'|| 
        event.results[event.results.length - 1][0].transcript == 'difficulty medium'|| 
        event.results[event.results.length - 1][0].transcript == 'difficulty hard'|| 
        event.results[event.results.length - 1][0].transcript == 'difficulty legendary'
        ) {
            console.log(event.results[event.results.length - 1][0].transcript);

            var arr = event.results[event.results.length - 1][0].transcript.split(' ');
            console.log(arr)
        $("#difficulty").val(arr[1])
    }
    if (event.results[event.results.length - 1][0].transcript == 'normal mode'|| 
        event.results[event.results.length - 1][0].transcript == 'motion mode'
        ) {
            var arr = event.results[event.results.length - 1][0].transcript.split(' ');

        $("#mode").val(arr[0])
    }

    if (event.results[event.results.length - 1][0].transcript == 'song walk it' )  {
        let arr = event.results[event.results.length - 1][0].transcript.split(' ');
        $('#song').val(arr[1] + " " +arr[2])
    }
    
    if (event.results[event.results.length - 1][0].transcript == 'song psycho') {
        let arr = event.results[event.results.length - 1][0].transcript.split(' ');
        $('#song').val(arr[1])
    }


    if (event.results[event.results.length - 1][0].transcript == 'start game'
        ) {
            $('#start').click();
    }
    // if (event.results[event.results.length - 1][0].transcript == 'search Google'
    // 	) {
    // 		var arr = event.results[event.results.length - 1][0].transcript.split(' ');
    // 	window.location.url = arr[1]
    // }
    recognition.onend = function() {
        recognition.start();
    }
}