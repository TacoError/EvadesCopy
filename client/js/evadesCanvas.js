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

		this.mouseX = 0;
		this.mouseY = 0;
		this.canvas.addEventListener("mousemove", (mouse) => {
			const rect = this.canvas.getBoundingClientRect();
			this.mouseX = (mouse.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width;
			this.mouseY = (mouse.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height;
		});
	}

	getMousePos() {
		return {
			x: this.mouseX,
			y: this.mouseY
		};
	}

	scale(x, y) {
		this.ctx.scale(x, y);
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

	text(text, x, y, color = "black", center = true, font = "serif", size = "12px", stroke = false, strokeColor = "red", strokeThickness = 1) {
		const oldFillStyle = this.ctx.fillStyle;
		this.ctx.fillStyle = color;
		this.ctx.font = `${size} ${font}`;
		if (!center) {
			this.ctx.fillText(text, x, y);
			this.ctx.fillStyle = oldFillStyle;
			return;
		}
		this.ctx.fillText(text, x - (this.ctx.measureText(text).width / 2), y);
		if (stroke) {
			const oldLineWidth = this.ctx.lineWidth;
			const oldStrokeColor = this.ctx.strokeColor;
			this.ctx.lineWidth = strokeThickness;
			this.ctx.strokeColor = strokeColor;
			this.ctx.fillStyle = "black";
			this.ctx.strokeText(text, x - (this.ctx.measureText(text).width / 2), y);
			this.ctx.lineWidth = oldLineWidth;
			this.ctx.strokeColor = oldStrokeColor;
		}
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