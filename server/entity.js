const SAT = require("sat");

module.exports = class Entity {

    constructor(
        x = 0,
        y = 0,
        radius = 15,
        color = "gray",
        parent = null,
        speed = 3,
        text = "",
        outline = false
    ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.parent = parent;
        this.speed = speed;
        this.text = text;
        this.outline = outline;
        this.baseSpeed = this.speed;
    }

    float_less_than(a, b, epsilon = 0.000000000000001) {
        return (a - b < epsilon) && (Math.abs(a - b) > epsilon);
    }

    float_greater_than(a, b, epsilon = 0.000000000000001) {
        return (a - b > epsilon) && (Math.abs(a - b) < epsilon);
    }

    onCollideWithPlayer() {}

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            r: this.radius,
            c: this.color,
            t: this.text,
            o: this.outline
        };
    }

    getCollider() {
        return new SAT.Circle(
            new SAT.Vector(this.x, this.y),
            this.radius
        );
    }

    collidesWithPolygon(polygon, response = new SAT.Response()) {
        return SAT.testCirclePolygon(
            this.getCollider(), 
            polygon,
            response
        );
    }

    collidesWithCircle(circle, response = new SAT.Response()) {
        return SAT.testCircleCircle(
            this.getCollider(), 
            circle,
            response
        );
    }

};