class Arrow {
    constructor(direction){
        this.xPos = null;
        this.direction = direction;
        if (this.direction == 'left') {
            this.xPos = '115px'
        } else if (this.direction == 'up') {
            this.xPos = '182px'
        } else if (this.direction == 'down') {
            this.xPos = '252px'
        } else if (this.direction == 'right') {
            this.xPos = '322px'
        }

        this.image = $("<img src='/static/img/arrows/" + this.direction + "2.png'/>");

        this.image.css({
            position: "absolute",
            top: "450px",
            left: this.xPos
        });
        var image = this.image;
        var image2 = this.image;
        $('.stage').append(image);


    }
    // CSS spacings for the arrows //
}