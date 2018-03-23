// 'notes' to store Arrows  
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
Arrow.prototype.step = function() {

	// Controls the speed of the arrows
	this.image.css("top", "-=2px");

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

};



// For random arrows
var randNum = 0;

// Frame increasing
var frame = 0;

// Determines the speed of notes
var arrowSpawnRate = 40;


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
function render() {
	if (frame++ % arrowSpawnRate === 0) {
		randomGen();
	}

	// Animate arrows showering down //
	for (var i = 0; i < notes.length; i++ ) {
		notes[i].step();

		// Check for cleanup
		if (notes[i].image.position().top < -10) {

			notes[i].destroy();

		}

	}

}// ends render()



// jQuery to animate arrows //
$(document).ready(function () {

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function() {

		return window.requestAnimationFrame ||

		window.webkitRequestAnimationFrame ||

		window.mozRequestAnimationFrame ||

		function(callback) {

			window.setTimeout(callback, 40 / 75);

		};

	})();

	/*	place the rAF *before* the render() 
		to assure as close to 60fps with the 
		setTimeout fallback.					*/

	// Infinte loop for game play
	(function animloop() {

		requestAnimFrame(animloop);

		render();

	})();// ends (function animloop() )


});// ends $(doc).ready



// Listening for when the key is pressed
$(document).keydown( function(event) {

	for (var i = 0; i < notes.length; i++) {
	
			console.log(notes[i].image.position().top);

		if (event.keyCode == 37 && notes[i].direction == "left") {

			if (notes[i].image.position().top > 0 && notes[i].image.position().top < 40) {

				console.log("LEFT! "+notes[i].explode());

			}
			
		}
		if (event.keyCode == 38 && notes[i].direction == "up") {

			if (notes[i].image.position().top > 0 && notes[i].image.position().top < 40) {
				
				console.log("UP! "+notes[i].explode());

			}

		}
		if (event.keyCode == 40 && notes[i].direction == "down") {

			if (notes[i].image.position().top > 0 && notes[i].image.position().top < 40) {
				
				console.log("DOWN! "+notes[i].explode());

			}

		}
		if (event.keyCode == 39 && notes[i].direction == "right") {

			if (notes[i].image.position().top > 0 && notes[i].image.position().top < 40) {
				
				console.log("RIGHT! "+notes[i].explode());

			}

		}

	}// ends loop

});// ends $(doc).keyup
