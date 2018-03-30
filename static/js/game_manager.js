$(document).ready(function () {

    var arrowManager = new ArrowManager();
    var game = new Game(arrowManager);
    socket.on('gameStarting', function() {
        gameplay();
    })

    socket.on('ready', function() {
        $('#type2').html("READY!")	
    })
    var song = '';
    $('#start').on('click', function() {
        document.getElementById("stageL").style.display="inline-block";
        document.getElementById("controlL").style.display="block";
        document.getElementById("stageR").style.display="inline-block";
        document.getElementById("controlR").style.display="block";
        document.getElementById("type").style.display="block";
        document.getElementById("type2").style.display="block";
        document.getElementById("scoreboard").style.display="block";
        document.getElementById("myChart").style.display="none";
        if ($('#song').val() == 'Walk it like I Talk it') {
            $('#thisSong').attr('src', '/static/img/walk.mp3')
            $("#audio")[0].load();
        } else if ($('#song').val() == 'Freaky Friday') {
            $('#thisSong').attr('src', '/static/img/music.mp3')
            $("#audio")[0].load();
        }
        $('#start').attr('disabled', true)
        socket.emit('gameStart')   
    })
    function gameplay(){
        i = 5;
        var gameloop = setInterval(function() {
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
                    if (counter == 850) {
                        $('#timer').html('3');
                    } else if (counter == 900) {
                        $('#timer').html('2');
                    } else if (counter == 950) {
                        $('#timer').html('1');
                    }
                    if (counter < 1000) {
                

                        //audio[0].play(); changed based on Sprachprofi's comment below
                        $("#audio")[0].oncanplaythrough = $("#audio")[0].play();
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
                        $('.stage2').html($('.stage').html());
                        arrowManager.render(spawnRate, speed);
                        if (arrowManager.notes[0].image.position().top < -10) {
                            game.hitTypes['MISS']++;
                            arrowManager.destroy();
                            socket.emit('gotResult2')
                            $("#type").html('MISS')
                            game.updateBoard();
                        }
                    } else {
                        $('#timer').html('');
                        $('#type').html('');
                        $('#type2').html('');
                        $('.stage').html('')
                        $('.stage2').html('')
                        $('#audio')[0].pause();
                        $('#audio')[0].currentTime = 0;
                        clearInterval(loop)
                        $('#start').attr('disabled', false);
                        $('#start').html('Play Again');
                        document.getElementById("stageL").style.display="none";
                        document.getElementById("controlL").style.display="none";
                        document.getElementById("stageR").style.display="none";
                        document.getElementById("controlR").style.display="none";
                        document.getElementById("scoreboard").style.display="none";
                        document.getElementById("type").style.display="none";
                        document.getElementById("type2").style.display="none";

                        document.getElementById("myChart").style.display="inline-block";
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
                                responsive: false,
                                maintainAspectRatio: false,
                                legend:{display: true,labels:{fontSize:20}},

                            }
                        });
                    }
                }, 20, counter);
            }
            if (i == -1) {
                clearInterval(gameloop);
            }
        }, 1000)
    }
    socket.on('emitResult2', function() {
        console.log('Emitted result: ')
        $('#type2').html('MISS')
    })
    socket.on('emitResult', function(data) {
        console.log('Emitted result: ', data.result)
        $('#type2').html(data.result)
    })
    socket.on('getScore', function(score) {
        console.log('MASDASDASDASDSA', score)
        $('#score2').html(score.score)
    })
    $('#start').on('click', function() {
        if ($('#mode').val() == 'motion') {
            var score = 0;
            var streak = false;
            gest.options.subscribeWithCallback(function(gesture) {
                game.updateBoard();
                console.log(gesture.direction)
                console.log(score)	
                console.log(arrowManager.notes)
                $('#timer').html('');
                $("#type").html('')
                $('#score').html(score)

                if(arrowManager.notes[0]) {
                    if(gesture.direction == 'Left') {
                        $('#left').attr('src', '/static/img/arrows/left2.png')
                            setTimeout(function() {
                                $('#left').attr('src', '/static/img/arrows/staticLeft.png')
                            }, 100)
                        if (arrowManager.notes[0].direction == "left" && arrowManager.notes[0].image.position().top > 0 && arrowManager.notes[0].image.position().top < 45) {
                            $('#left').attr('src', '/static/img/arrows/left3.png')
                                setTimeout(function() {
                                    $('#left').attr('src', '/static/img/arrows/staticLeft.png')
                                }, 200)
                        }
                    }
                    if (gesture.direction == 'Up' || gesture.direction == 'Long up') {
                        $('#up').attr('src', '/static/img/arrows/up2.png')
                            setTimeout(function() {
                                $('#up').attr('src', '/static/img/arrows/staticUp.png')
                        }, 100)
                        if (arrowManager.notes[0].direction == "up" && arrowManager.notes[0].image.position().top > 0 && arrowManager.notes[0].image.position().top < 45) {
                            $('#up').attr('src', '/static/img/arrows/up3.png')
                                setTimeout(function() {
                                    $('#up').attr('src', '/static/img/arrows/staticUp.png')
                            }, 200)
                        } 
                    }
                    if (gesture.direction == 'Down' || gesture.direction == 'Long down') {
                        $('#down').attr('src', '/static/img/arrows/down2.png')
                            setTimeout(function() {
                                $('#down').attr('src', '/static/img/arrows/staticDown.png')
                        }, 100)
                        if (arrowManager.notes[0].direction == "down" && arrowManager.notes[0].image.position().top > 0 && arrowManager.notes[0].image.position().top < 45) {
                            $('#down').attr('src', '/static/img/arrows/down3.png')
                                setTimeout(function() {
                                    $('#down').attr('src', '/static/img/arrows/staticDown.png')
                            }, 200)
                        } 
                    }
                    if (gesture.direction == 'Right') {
                        $('#right').attr('src', '/static/img/arrows/right2.png')
                            setTimeout(function() {
                                $('#right').attr('src', '/static/img/arrows/staticRight.png')
                        }, 100)
                        if (arrowManager.notes[0].direction == "right" && arrowManager.notes[0].image.position().top > 0 && arrowManager.notes[0].image.position().top < 45) {
                            $('#right').attr('src', '/static/img/arrows/right3.png')
                                setTimeout(function() {
                                    $('#right').attr('src', '/static/img/arrows/staticRight.png')
                            }, 200)
                        }
                    } 
                    game.updateScore();
                    game.updateBoard();
                    $('#score').html(game.score)
                }
            }, game.streak);
            gest.start();
        } else if ($('#mode').val() == 'normal') {
            game.updateBoard();
            $(document).keydown( function(event) {
                $('#timer').html('');
                $("#type").html('')
                $('#score').html(game.score)
                game.updateBoard();
                if(arrowManager.notes[0]) {
                    if (event.keyCode == 37) {
                        event.preventDefault();
                        $('#left').attr('src', '/static/img/arrows/left2.png')
                        setTimeout(function() {
                            $('#left').attr('src', '/static/img/arrows/staticLeft.png')
                        }, 100)
                        if (arrowManager.notes[0].direction == "left" && arrowManager.notes[0].image.position().top > 0 && arrowManager.notes[0].image.position().top < 45) {
                            $('#left').attr('src', '/static/img/arrows/left3.png')
                            setTimeout(function() {
                                $('#left').attr('src', '/static/img/arrows/staticLeft.png')
                            }, 200)
                        } 
                        game.updateScore();
                        game.updateBoard();
                        $('#score').html(game.score)
                    }
                    if (event.keyCode == 38) {
                        event.preventDefault();
                        $('#up').attr('src', '/static/img/arrows/up2.png')
                        setTimeout(function() {
                            $('#up').attr('src', '/static/img/arrows/staticUp.png')
                        }, 100)
                        if (arrowManager.notes[0].direction == "up" && arrowManager.notes[0].image.position().top > 0 && arrowManager.notes[0].image.position().top < 45) {
                            $('#up').attr('src', '/static/img/arrows/up3.png')
                            setTimeout(function() {
                                $('#up').attr('src', '/static/img/arrows/staticUp.png')
                            }, 200)
                        } 
                        game.updateScore();
                        game.updateBoard();
                        $('#score').html(game.score)
                    }
                    if(event.keyCode == 40) {
                        event.preventDefault();
                        $('#down').attr('src', '/static/img/arrows/down2.png')
                        setTimeout(function() {
                            $('#down').attr('src', '/static/img/arrows/staticDown.png')
                        }, 100)
                        if (arrowManager.notes[0].direction == "down" && arrowManager.notes[0].image.position().top > 0 && arrowManager.notes[0].image.position().top < 45) {
                            $('#down').attr('src', '/static/img/arrows/down3.png')
                            setTimeout(function() {
                                $('#down').attr('src', '/static/img/arrows/staticDown.png')
                            }, 200)
                        } 
                        game.updateScore();
                        game.updateBoard();
                        $('#score').html(game.score)

                    }
                    if(event.keyCode == 39) {
                        event.preventDefault();
                        $('#right').attr('src', '/static/img/arrows/right2.png')
                        setTimeout(function() {
                            $('#right').attr('src', '/static/img/arrows/staticRight.png')
                        }, 100)
                        if (arrowManager.notes[0].direction == "right" && arrowManager.notes[0].image.position().top > 0 && arrowManager.notes[0].image.position().top < 45) {
                            $('#right').attr('src', '/static/img/arrows/right3.png')
                            setTimeout(function() {
                                $('#right').attr('src', '/static/img/arrows/staticRight.png')
                            }, 200)
                        } 
                        game.updateScore();
                        game.updateBoard();
                        $('#score').html(game.score)
                    }
                }
            });
        }       
    })
});
