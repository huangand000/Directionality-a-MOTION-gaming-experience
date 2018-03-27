$(document).ready(function () {
    
    var game = new Game();
    console.log(game.hitTypes)
    

    function updateScore() {
        if (notes[0].image.position().top > 5 && notes[0].image.position().top < 15) {
            // hitbox('PERFECT', 20);
            $('#type').html('PERFECT')
            if (game.streak) {
                game.score+= 20;
            }
            game.hitTypes['PERFECT']++;
            game.streak = true;
            notes[0].explode();
            game.score+=10;
        } else if (notes[0].image.position().top > 0 && notes[0].image.position().top < 20) {
            // hitbox('GREAT', 10);
            $('#type').html('GREAT')
            if (game.streak) {
                game.score+= 10;
            }
            game.hitTypes['GREAT']++;
            game.streak = true;
            notes[0].explode();
            game.score+=10;
        } else if (notes[0].image.position().top > 0 && notes[0].image.position().top < 30) {
            // hitbox('GOOD', 10);
            $('#type').html('GOOD')
            if (game.streak) {
                game.score+= 10;
            }
            game.hitTypes['GOOD']++;
            game.streak = true;
            notes[0].explode();
            game.score+=10;
        } else if (notes[0].image.position().top > 0 && notes[0].image.position().top < 35) {
            // hitbox('COOL', 5);
            $('#type').html('COOL')
            if (game.streak) {
                game.score+= 5;
            }
            game.hitTypes['COOL']++;
            game.streak = true;
            notes[0].explode();
            game.score+=10;
        } else if(notes[0].image.position().top > 0 && notes[0].image.position().top < 45) {
            // hitbox('BAD', 0);
            $('#type').html('BAD')
            if (game.streak) {
                game.score+= 0;
            }
            game.hitTypes['BAD']++;
            game.streak = true;
            notes[0].explode();
            game.score+=10;
        } else	{
            game.hitTypes['MISS']++;
            $("#type").html('MISS')
            game.streak = false;
            game.score -=10;
        }
    }
    // function updateBoard{
    //     $('#scoreboard').html(
    //         '<p>PERFECT: '+ game.hitTypes['PERFECT'] + '</p>' +
    //         '<p>GREAT: '+ game.hitTypes['GREAT'] + '</p>' +
    //         '<p>GOOD: '+ game.hitTypes['GOOD'] + '</p>' +
    //         '<p>COOL: '+ game.hitTypes['COOL'] + '</p>' +
    //         '<p>BAD: '+ game.hitTypes['BAD'] + '</p>' +
    //         '<p>MISS: '+ game.hitTypes['MISS'] + '</p>' 
    //     )	
    // }
    $('#start').on('click', function() {
        i = 5;
        var game = setInterval(function() {
            i--;
            console.log(i)
            if (i == 4) {
                $('#timer').html("READY!")	
            } else if (i > 0) {
                $('#timer').html(i)
            } else {
                $('#timer').html('')
                $('#start').attr('disabled', true)
            }
            if (i == 0) {
                var counter = 0;
                var loop = setInterval(function() {
                    counter++
                    // console.log("Counter = ", counter)
                    if (counter == 850) {
                        $('#timer').html('3');
                    } else if (counter == 900) {
                        $('#timer').html('2');
                    } else if (counter == 950) {
                        $('#timer').html('1');
                    }
                    if (counter < 1000) {
                        $('#audio')[0].play();
                        if ($('#difficulty').val() == 'easy') {
                            spawnRate = 100;
                            speed = '-=2px'
                        } else if ($('#difficulty').val() == 'medium') {
                            spawnRate = 40;
                            speed = '-=4px'
                        } else if ($('#difficulty').val() == 'hard') {
                            spawnRate = 20;
                            speed = '-=6px'
                        } else if ($('#difficulty').val() == 'legendary') {
                            spawnRate = 10;
                            speed = '-=10px'
                        }
                        render(spawnRate, speed);
                    } else {
                        $('#timer').html('');
                        $('.stage').html('')
                        $('#audio')[0].pause();
                        $('#audio')[0].currentTime = 0;
                        clearInterval(loop)
                        // create chart
                        var ctx = document.getElementById("myChart").getContext('2d');
                        var myChart = new Chart(ctx, {
                            type: 'doughnut',
                            data: {
                                labels: ["Miss", "Bad", "Cool", "Good", "Great", "Perfect"],
                                datasets: [{
                                    label: '# of Votes',
                                    data: [game.hitTypes['MISS'], game.hitTypes['BAD'], game.hitTypes['COOL'], game.hitTypes['GOOD'],game.hitTypes['GREAT'], game.hitTypes['PERFECT']],
                                    backgroundColor: [
                                        'rgb(124, 121, 122, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                    ],
                                    borderColor: [
                                        'rgb(124, 121, 122, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                    ],
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                            }
                        });
                        $('#start').attr('disabled', false);
                    }
                }, 20, counter);
            }
            if (i == -1) {
                clearInterval(game);
            }
        }, 1000)
    })
    $('#start').on('click', function() {
        
        if ($('#mode').val() == 'motion') {
            // var score = 0;
            // var game.streak = false;
            gest.options.subscribeWithCallback(function(gesture) {
                game.updateBoard();
                console.log(gesture.direction)
                console.log(score)	
                console.log(notes)
                $('#timer').html('');
                $("#type").html('')
                $('#score').html(score)

                if(notes[0]) {
                    if (gesture.direction == 'Left' && notes[0].direction == "left") {
                        updateScore();
                    } else if ((gesture.direction == 'Up' || gesture.direction == 'Long up') && notes[0].direction == "up") {
                        updateScore();
                    } else if ((gesture.direction == 'Down' || gesture.direction == 'Long down') && notes[0].direction == "down") {
                        updateScore();
                    } else if (gesture.direction == 'Right' && notes[0].direction == "right") {
                        updateScore();
                    } else {
                        console.log(gesture.direction)
                        game.hitTypes['MISS']++;
                        $("#type").html('MISS')
                        score-=10;
                    } 
                }
                }, game.streak);
                gest.start();
            } else if ($('#mode').val() == 'normal') {
                game.updateBoard();
                $(document).keydown( function(event) {
                    $('#timer').html('');
                    $("#type").html('')
                    $('#score').html(score)
                    game.updateBoard();
                    if(notes[0]) {
                        if (event.keyCode == 37 && notes[0].direction == "left") {
                            event.preventDefault();
                            updateScore();	
                            $('#score').html(score)
                        }
                        if (event.keyCode == 38 && notes[0].direction == "up") {
                            event.preventDefault();
                            updateScore();
                            $('#score').html(score)
                        }
                        if (event.keyCode == 40 && notes[0].direction == "down") {
                            event.preventDefault();
                            updateScore();
                            $('#score').html(score)
                        }
                        if (event.keyCode == 39 && notes[0].direction == "right") {
                            event.preventDefault();
                            updateScore();
                            $('#score').html(score)
                        }
                    }
                });
            }       
        })
});
