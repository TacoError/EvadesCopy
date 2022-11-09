class EvadesCanvas {

	constructor(id = "evadesCanvas") {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.id = id;
		this.ctx = this.canvas.getContext("2d");

		window.addEventListener("resize", () => {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		});
	}

	centerOnPosition(entity) {
		this.ctx.save();
		this.ctx.translate((this.canvas.width / 2) - entity.x, (this.canvas.height / 2)  - entity.y);	
	}

	restore() {
		this.ctx.restore();
	}

	apply() {
		document.body.appendChild(this.canvas);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	text(text, x, y, color = "black", center = true, font = "serif", size = "12px") {
		const oldFillStyle = this.ctx.fillStyle;
		this.ctx.fillStyle = color;
		this.ctx.font = `${size} ${font}`;
		if (!center) {
			this.ctx.fillText(text, x, y);
			this.ctx.fillStyle = oldFillStyle;
			return;
		}
		this.ctx.fillText(text, x - (this.ctx.measureText(text).width / 2), y);
		this.ctx.fillStyle = oldFillStyle;
	}

	strokeAround(x, y, width, height, color) {
		this.ctx.beginPath();
		this.ctx.rect(x, y, width, height);
		this.ctx.fillStyle = color;
		this.ctx.stroke();
		this.ctx.closePath();
	}

	box(x, y, width, height, color, outline) {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.rect(x, y, width, height);
		this.ctx.fill();
		if (outline) {
			this.ctx.fillStyle = "black";
			this.ctx.stroke();
		}	
		this.ctx.closePath();
	}

	circle(x, y, radius, color, outline) {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
		this.ctx.fill();
		if (outline) {
			this.ctx.fillStyle = "black";
			this.ctx.stroke();
		}
		this.ctx.closePath();
	}

}