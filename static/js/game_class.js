class Game {
    constructor(arrowManager) {
        var self= this;
        this.arrowManager = arrowManager;
        console.log(this.arrowManager)
        this.score = 0;
        this.streak = false;
        this.hitTypes = {
            'PERFECT': 0,
            'GREAT': 0,
            'GOOD': 0,
            'COOL': 0,
            'BAD': 0,
            'MISS': 0
        }
    }

    updateBoard(){
        $('#scoreboard').html(
            '<p>PERFECT: '+ this.hitTypes['PERFECT'] + '</p>' +
            '<p>GREAT: '+ this.hitTypes['GREAT'] + '</p>' +
            '<p>GOOD: '+ this.hitTypes['GOOD'] + '</p>' +
            '<p>COOL: '+ this.hitTypes['COOL'] + '</p>' +
            '<p>BAD: '+ this.hitTypes['BAD'] + '</p>' +
            '<p>MISS: '+ this.hitTypes['MISS'] + '</p>' 
        )	
    }

    updateScore() {
        console.log(this.arrowManager)
        if (this.arrowManager.notes[0].image.position().top > 5 && this.arrowManager.notes[0].image.position().top < 15) {
            // hitbox('PERFECT', 20);

            $('#type').html('PERFECT')
            if (this.streak) {
                this.score+= 20;
            }
            this.hitTypes['PERFECT']++;
            this.streak = true;
            this.arrowManager.destroy();
            this.score+=10;
        } else if (this.arrowManager.notes[0].image.position().top > 0 && this.arrowManager.notes[0].image.position().top < 20) {
            // hitbox('GREAT', 10);
            $('#type').html('GREAT')
            if (this.streak) {
                this.score+= 10;
            }
            this.hitTypes['GREAT']++;
            this.streak = true;
            this.arrowManager.destroy();
            this.score+=10;
        } else if (this.arrowManager.notes[0].image.position().top > 0 && this.arrowManager.notes[0].image.position().top < 30) {
            // hitbox('GOOD', 10);
            $('#type').html('GOOD')
            if (this.streak) {
                this.score+= 10;
            }
            this.hitTypes['GOOD']++;
            this.streak = true;
            this.arrowManager.destroy();
            this.score+=10;
        } else if (this.arrowManager.notes[0].image.position().top > 0 && this.arrowManager.notes[0].image.position().top < 35) {
            // hitbox('COOL', 5);
            $('#type').html('COOL')
            if (this.streak) {
                this.score+= 5;
            }
            this.hitTypes['COOL']++;
            this.streak = true;
            this.arrowManager.destroy();
            this.score+=10;
        } else if(this.arrowManager.notes[0].image.position().top > 0 && this.arrowManager.notes[0].image.position().top < 45) {
            // hitbox('BAD', 0);
            $('#type').html('BAD')
            if (this.streak) {
                this.score+= 0;
            }
            this.hitTypes['BAD']++;
            this.streak = true;
            this.arrowManager.destroy();
            this.score+=10;
        } else	{
            this.hitTypes['MISS']++;
            $("#type").html('MISS')
            this.streak = false;
            this.score -=10;
        }
        socket.emit('gotResult', {result: $("#type").text()})
        socket.on('emitResult', function(data) {
            console.log('Emitted result: ', data.result)
            $('#type2').html(data.result)
        })
    }

}