$(document).ready(function () {
    
    var game = new Game();
    var arrowManager = new ArrowManager();
    var score = 0;
    var streak = false;
    var hitTypes = {
        'PERFECT': 0,
        'GREAT': 0,
        'GOOD': 0,
        'COOL': 0,
        'BAD': 0,
        'MISS': 0
    }
    function hitbox (type, points) {
        $('#type').html(type)
        if (streak) {
            score+= points;
        }
        hitTypes[type]++;
        streak = true;
        arrowManager.destroy();
        score+=10;
    }
    function updateScore() {
        if (arrowManager.notes[0].image.position().top > 5 && arrowManager.notes[0].image.position().top < 15) {
            hitbox('PERFECT', 20);
        } else if (arrowManager.notes[0].image.position().top > 0 && arrowManager.notes[0].image.position().top < 20) {
            hitbox('GREAT', 10);
        } else if (arrowManager.notes[0].image.position().top > 0 && arrowManager.notes[0].image.position().top < 30) {
            hitbox('GOOD', 10);
        } else if (arrowManager.notes[0].image.position().top > 0 && arrowManager.notes[0].image.position().top < 35) {
            hitbox('COOL', 5);
        } else if(arrowManager.notes[0].image.position().top > 0 && arrowManager.notes[0].image.position().top < 45) {
            hitbox('BAD', 0);
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
                        arrowManager.render(spawnRate, speed);
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
                console.log(arrowManager.notes)
                $('#timer').html('');
                $("#type").html('')
                $('#score').html(score)

                if(arrowManager.notes[0]) {
                    if (gesture.direction == 'Left' && arrowManager.notes[0].direction == "left") {
                        updateScore();
                    } else if ((gesture.direction == 'Up' || gesture.direction == 'Long up') && arrowManager.notes[0].direction == "up") {
                        updateScore();
                    } else if ((gesture.direction == 'Down' || gesture.direction == 'Long down') && arrowManager.notes[0].direction == "down") {
                        updateScore();
                    } else if (gesture.direction == 'Right' && arrowManager.notes[0].direction == "right") {
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
                    updateBoard();
                    if(arrowManager.notes[0]) {
                        if (event.keyCode == 37 && arrowManager.notes[0].direction == "left") {
                            event.preventDefault();
                            updateScore();	
                            $('#score').html(score)
                        }
                        if (event.keyCode == 38 && arrowManager.notes[0].direction == "up") {
                            event.preventDefault();
                            updateScore();
                            $('#score').html(score)
                        }
                        if (event.keyCode == 40 && arrowManager.notes[0].direction == "down") {
                            event.preventDefault();
                            updateScore();
                            $('#score').html(score)
                        }
                        if (event.keyCode == 39 && arrowManager.notes[0].direction == "right") {
                            event.preventDefault();
                            updateScore();
                            $('#score').html(score)
                        }
                    }
                });
            }       
        })
});
