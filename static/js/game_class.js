class Game {
    constructor() {
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

    startGame() {
        
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

    // updateScore() {
    //     if (this.notes[0].image.position().top > 5 && this.notes[0].image.position().top < 15) {
    //         // hitbox('PERFECT', 20);
    //         $('#type').html('PERFECT')
    //         if (game.streak) {
    //             this.score+= 20;
    //         }
    //         game.hitTypes['PERFECT']++;
    //         game.streak = true;
    //         this.notes[0].explode();
    //         this.score+=10;
    //     } else if (this.notes[0].image.position().top > 0 && this.notes[0].image.position().top < 20) {
    //         // hitbox('GREAT', 10);
    //         $('#type').html('GREAT')
    //         if (game.streak) {
    //             this.score+= 10;
    //         }
    //         game.hitTypes['GREAT']++;
    //         game.streak = true;
    //         this.notes[0].explode();
    //         this.score+=10;
    //     } else if (this.notes[0].image.position().top > 0 && this.notes[0].image.position().top < 30) {
    //         // hitbox('GOOD', 10);
    //         $('#type').html('GOOD')
    //         if (game.streak) {
    //             this.score+= 10;
    //         }
    //         game.hitTypes['GOOD']++;
    //         game.streak = true;
    //         this.notes[0].explode();
    //         this.score+=10;
    //     } else if (this.notes[0].image.position().top > 0 && this.notes[0].image.position().top < 35) {
    //         // hitbox('COOL', 5);
    //         $('#type').html('COOL')
    //         if (game.streak) {
    //             this.score+= 5;
    //         }
    //         game.hitTypes['COOL']++;
    //         game.streak = true;
    //         this.notes[0].explode();
    //         this.score+=10;
    //     } else if(this.notes[0].image.position().top > 0 && this.notes[0].image.position().top < 45) {
    //         // hitbox('BAD', 0);
    //         $('#type').html('BAD')
    //         if (game.streak) {
    //             this.score+= 0;
    //         }
    //         game.hitTypes['BAD']++;
    //         game.streak = true;
    //         this.notes[0].explode();
    //         this.score+=10;
    //     } else	{
    //         game.hitTypes['MISS']++;
    //         $("#type").html('MISS')
    //         game.streak = false;
    //         this.score -=10;
    //     }
    // }

}