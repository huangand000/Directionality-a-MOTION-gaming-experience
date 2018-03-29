 class ArrowManager {
    constructor(game){
        this.notes = [];
        this.frame = 0;
    }
    randomGen() {
        var r = Math.floor(Math.random() * 4) + 1;
        if (r === 1) {
            this.notes.push(new Arrow("left"));
        } else if (r === 2) {
            this.notes.push(new Arrow("right"));
        } else if (r === 3) {
            this.notes.push(new Arrow("up"));	
        } else if (r === 4) { 
            this.notes.push(new Arrow("down"));
        }      
    }

    render(arrowSpawnRate, speed) {
        if (this.frame++ % arrowSpawnRate === 0) {
            this.randomGen();
        }
        for (var i = 0; i < this.notes.length; i++ ) {
            this.notes[i].image.css("top", speed);
        }
        // if (this.notes[0].image.position().top < -10) {
        //     // this.game.hitTypes['MISS']++;
        //     this.destroy();
        //     socket.emit('gotResult2')
        //     $("#type").html('MISS')
        // }
    }
    

    destroy() {
        var temp = this.notes.splice(0,1);
        temp[0].image.remove();
    };
}



