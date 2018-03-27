

    var notes = [];

// ==== CLASS FOR ARROWS ==== //

// 1. Direction of arrows
// 2. jQuery img that links to direction bottom
// 3. Destroy when it arrow gets to the 
// 4. Explode when arrow gets to the bottom

// Class Arrow
function Arrow(direction) {

    // CSS spacings for the arrows //
    var xPos = null;
    if (direction == 'left') {
        xPos = '115px'
    } else if (direction == 'up') {
        xPos = '182px'
    } else if (direction == 'down') {
        xPos = '252px'
    } else if (direction == 'right') {
        xPos = '322px'
    }

    this.direction = direction;
    this.image = $("<img src='/static/img/arrows/" + direction + ".gif'/>");

    this.image.css({
        position: "absolute",
        top: "450px",
        left: xPos
    });

    $('.stage').append(this.image);

}// ends CLASS Arrow

// To enable animating the arrows
Arrow.prototype.step = function(speed) {

    // Controls the speed of the arrows
    this.image.css("top", speed);

};

// Deletes arrows when they get to bottom of page
Arrow.prototype.destroy = function() {
    // removes the image of the DOM
    this.image.remove();
    // Removes the note/arrow from memory/array
    notes.splice(0,1);
};

// Explodes arrow when hit
Arrow.prototype.explode = function() {
    this.image.remove();
    notes.splice(0,1);
};

// For random arrows
var randNum = 0;

// Frame increasing
var frame = 0;

// Determines the speed of notes
var arrowSpawnRate = 10;


// Random generator for arrows
function randomGen() {

    // Randomizes between 1 and 4
    r = Math.floor(Math.random() * 4) + 1;
    if (r === 1) {
        notes.push(new Arrow("left"));
    } else if (r === 2) {
        notes.push(new Arrow("right"));
    } else if (r === 3) {
        notes.push(new Arrow("up"));	
    } else if (r === 4) {
        notes.push(new Arrow("down"));
    }

}// ends randomGen()


// Render function //
function render(arrowSpawnRate, speed) {
    if (frame++ % arrowSpawnRate === 0) {
        randomGen();
    }
    // Animate arrows showering down //
    for (var i = 0; i < notes.length; i++ ) {
        notes[i].step(speed);

        // Check for cleanup
        if (notes[i].image.position().top < -10) {

            notes[i].destroy();

        }

    }

}// ends render()
