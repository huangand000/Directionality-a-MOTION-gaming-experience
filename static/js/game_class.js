class Game {
    constructor() {
        this.score = 0;
        this.hitTypes = {
            'perfect': 0,
            'great': 0,
            'good': 0,
            'cool': 0,
            'bad': 0
        }
    }
    updateScore() {
        if (notes[0].image.position().top > 5 && notes[0].image.position().top < 15) {
            hitbox('PERFECT', 20);
        } else if (notes[0].image.position().top > 0 && notes[0].image.position().top < 20) {
            hitbox('GREAT', 10);
        } else if (notes[0].image.position().top > 0 && notes[0].image.position().top < 30) {
            hitbox('GOOD', 10);
        } else if (notes[0].image.position().top > 0 && notes[0].image.position().top < 35) {
            hitbox('COOL', 5);
        } else if(notes[0].image.position().top > 0 && notes[0].image.position().top < 45) {
            hitbox('BAD', 0);
        } else	{
            hitTypes['MISS']++;
            $("#type").html('MISS')
            streak = false;
            score -=10;
        }
    }
}