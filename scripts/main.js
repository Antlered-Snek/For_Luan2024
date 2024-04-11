



// Essentials
let canvas = document.getElementById('cake');
let c = canvas.getContext("2d");
        
canvas_width = 1024;
canvas_height = 576;
canvas.width = canvas_width;
canvas.height = canvas_height;

let effects = {obj: []};





// Classes
class Effect {
	constructor(position, size, {action, color}) {
		this.position = position;
		this.velocity = {x:0, y:0};
		this.acceleration = {x:0, y:0};
		this.color = color;
		this.action = action;
		this.size = size;
		this.isDestroyed = false;
		effects.obj.push(this);
	}

	draw() {
		if (typeof(this.color) === 'string') c.fillStyle = this.color;
		else c.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;

		if (this.size.radius == 0) {
			c.save();
			c.translate(this.position.x, this.position.y);
			c.fillRect(-this.size.width*0.5, -this.size.height*0.5, this.size.width, this.size.height);
			c.restore();
		}
		else {
			c.beginPath();
			c.arc(this.position.x, this.position.y, this.size.radius, 0, 2*Math.PI);
			c.fill();
			c.closePath();
		}
	}

	vectors() {
		this.velocity.x += this.acceleration.x * 0.01;
		this.velocity.y += this.acceleration.y * 0.01;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}

	autoDelete() {
		if (this.isDestroyed) {
			for (let i in effects.obj) {
				if (effects.obj[i] === this) effects.obj.splice(i, 1);
			}
		}
	}

	update() {
		this.action(this);
		this.vectors();
		this.autoDelete();
		this.draw();
	}
}

const confetti = { //{position, action, color}, size
	action: (self) => {
		if (self.velocity.x != 0) {
			if (Math.abs(self.velocity.x) > 0.1) self.velocity.x *= 0.9;
			else self.velocity.x = 0;
		}
		if (self.velocity.y != 0) {
			if (Math.abs(self.velocity.y) > 0.1) self.velocity.y *= 0.9;
			else self.velocity.y = 0;
		}

		if (self.velocity.x + self.velocity.y === 0) self.isDestroyed = true;
	},
	color: 'red'
}























// Objects

const cake = {
	position: {
		x: canvas_width*0.5,
		y: canvas_height*0.5
	},
	size: {
		width: 100,
		height: 100
	},
	ogSize: {
		width: 100,
		height: 100
	},
	health: 100,
	isDestroyed: false,
	sprite: new Image()
}
cake.sprite.src = 'images/cake.png';

const bdayText = {
	position: {
		x: canvas_width*0.5,
		y: canvas_height*0.5 + 10
	},
	size: {
		width: 10,
		height: 10
	},
	finalSize: {
		width: 800,
		height: 800
	},
	isDestroyed: true,
	sprite: new Image()
}
bdayText.sprite.src = 'images/bdayText.png';






// Audio
const yay = new Audio("audio/yay.mp3");
const bgm = new Audio("audio/bgm.mp3");























// Animation
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas_width, canvas_height);

	if (!cake.isDestroyed) drawCake();
	if (!bdayText.isDestroyed) drawText();
	normalizeCake(1);
	normalizeText(20);

	for (let i in effects.obj) effects.obj[i].update();
}
animate();
drawCake();











// Functions
	// Cake
function drawCake() {
	c.save();
	c.translate(cake.position.x, cake.position.y);
	c.drawImage(cake.sprite, 0, 0, 380, 380, -cake.size.width*0.5, -cake.size.height*0.5, cake.size.width, cake.size.height)
	c.restore();
}

function inflateCake(value) {
	cake.size.width += value;
	cake.size.height += value;
}

function normalizeCake(percentage) {
	if (cake.isDestroyed) return;

	let difference = cake.size.width - cake.ogSize.width;
	if (difference === 0) return;
	else if (difference < 0) {
		cake.size = {
			width: cake.ogSize.width,
			height: cake.ogSize.height
		}
		return
	}
	let change = difference * percentage * 0.01;
	
	cake.size.width -= change;
	cake.size.height -= change;

	if (cake.size.width > 500) cake.health--;
	if (cake.health <= 0) {
		cake.isDestroyed = true;
		confettiBoom(cake.position, 500);

		bdayText.isDestroyed = false;
		yay.play();
	}
}





	// Bday Text
function drawText() {
	c.save();
	c.translate(bdayText.position.x, bdayText.position.y);
	c.drawImage(bdayText.sprite, 0, 0, 1280, 1280, -bdayText.size.width*0.5, -bdayText.size.height*0.5, bdayText.size.width, bdayText.size.height)
	c.restore();
}

function normalizeText(value) {
	if (bdayText.isDestroyed) return

	let difference = bdayText.finalSize.width - bdayText.size.width;
	if (difference === 0) return;
	else if (difference < 0) {
		bdayText.size = {
			width: bdayText.finalSize.width,
			height: bdayText.finalSize.height
		}
		return
	}
	let change = value;
	
	bdayText.size.width += change;
	bdayText.size.height += change;
}

















function confettiBoom(position, strength) {
	let colors = ['red', 'orange', 'yellow', 'lime', 'blue', 'purple', 'pink', 'white'];

	for (let i=0; i<720; i++) {
		let speed = Math.floor(Math.random() * strength);
		let angle = i * Math.PI / 180;
		let length = Math.floor(Math.random() * 20);

		let pos = {
			x: position.x,
			y: position.y
		}

		let size = {
			width: length,
			height: length,
			radius: 0
		}

		let effect = new Effect(pos, size, confetti);
		effect.color = colors[Math.floor(Math.random() * colors.length)];

		effect.velocity.x = speed * Math.cos(angle);
		effect.velocity.y = speed * Math.sin(angle);
	}
}



function rectangularCollision(object1, object2) {
	return (
		((object1.position.x+object1.size.width*0.5 >= object2.position.x-object2.size.width*0.5) &&
		(object1.position.y+object1.size.height*0.5 >= object2.position.y-object2.size.height*0.5))
		&&
		((object2.position.x+object2.size.width*0.5 >= object1.position.x-object1.size.width*0.5) &&
		(object2.position.y+object2.size.height*0.5 >= object1.position.y-object1.size.height*0.5))
	)
}

// Input Handling
canvas.addEventListener('click', (e) => {
	let mouse = {
		position: {
			x: e.clientX - canvas.getBoundingClientRect().left,
			y: e.clientY - canvas.getBoundingClientRect().top
		},
		size: {
			width: 0,
			height: 0
		}
	}

	if (rectangularCollision(cake, mouse)) inflateCake(50);
})

yay.addEventListener('ended', () => {
	bgm.play();
	document.querySelector('body').style.overflow = 'scroll';
	document.querySelector('#card').style.display = 'block';
})

bgm.addEventListener('ended', () => {
	bgm.currentTime = 0;
	bgm.play();
})