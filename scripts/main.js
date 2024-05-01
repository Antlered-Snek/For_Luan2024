



// Essentials
	// Cake
let canvas = document.getElementById('cake');
let c = canvas.getContext("2d");
        
canvas_width = window.innerWidth;
canvas_height = window.innerHeight;
canvas.width = canvas_width;
canvas.height = canvas_height;

	// Conveyer
let conveyer = document.getElementById('conveyer');
let con = conveyer.getContext("2d");

conveyer.width = 1000;
conveyer.height = 100;


let effects = {obj: []};
let imgs;





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

if (canvas_width <= bdayText.finalSize.width) {
	bdayText.finalSize = {
		width: canvas_width - 20,
		height: canvas_width - 20
	}
}







	// Card
const bdayText2 = {
	position: {
		x: canvas_width*0.8,
		y: 90
	}
}

// let scramble = false;
// let scrambleCD = 0;






// Audio
const yay = new Audio("audio/yay.mp3");
const bgm = new Audio("audio/bgm.mp3");





// Achievements
let achievementsLeft = 6;
let achievements = {
	clickTheCake: true,
	destroyLove: true,
	bigGay: true,
	godzilla: true,
	california: true,
	faggus: true
}
let popupIsAnimating = false;




















// Animation
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas_width, canvas_height);

	for (let i in effects.obj) effects.obj[i].update();

	if (!cake.isDestroyed) drawCake();
	if (!bdayText.isDestroyed) drawText();
	normalizeCake(1);
	normalizeText(20);


	if (document.querySelector('#card').style.display == 'none') return;

	// Card
	moveConveyer();
	moveGallery(document.getElementsByClassName('gallery')[0], 1);
	moveGallery(document.getElementsByClassName('gallery')[1], -1);

	// if (scramble) {
	// 	if (!scrambleCD) {
	// 		scrambleLetter();
	// 		scrambleCD = 2;
	// 	}
	// 	else scrambleCD--;
	// }

		// Click
	imgs = document.querySelectorAll('.gallery img');
	for (let i=0; i<imgs.length; i++) {
		imgs[i].onmouseover = (e) => {
			let tap = new Audio("audio/tap.mp3");
			tap.play();
		}
	}

		// Godzilla Roar
	imgs = document.querySelector('#card').getElementsByTagName('img');

	for (let i=0; i<imgs.length; i++) {
		imgs[i].onclick = (e) => {
			// console.log(imgs[i].src)
			if (imgs[i].src != "file:///D:/Code%20Stuff/Luan's%20Birthday%20Special%202024/images/placeholder.png" && imgs[i].src != "file:///D:/Code%20Stuff/Luan's%20Birthday%20Special%202024/images/godzilla.png") return;
			let roar = new Audio("audio/Godzilla_Heisei_SFX.wav");
			roar.play();

				// Achievement
			if (achievements.godzilla) {
				achievements.godzilla = false;
				achievementsLeft--;
				popupMessage('Fearsome Godzilla Has Evolved RAAAHHH', 'images/achievement_godzilla.gif');
			}
		}
	}
}
animate();
popupMessage('Eliminate the cake (:', 'images/popup.png', "<u>Complete the Task</u>", false);













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


function moveConveyer() {
	con.clearRect(0, 0, 1000, 100);

	// Draw
	con.fillStyle = 'white';
	con.font = 'bold 100px Winkle';
	con.textAllign = 'center';
	con.fillText('!!!!! HAPPY BIRTHDAY !!!!!', bdayText2.position.x, bdayText2.position.y);

	// Move
	bdayText2.position.x -= 5;
	if (bdayText2.position.x < -canvas_width*0.8) bdayText2.position.x = canvas_width*0.8;
}

function moveGallery(gallery, direction) {
	gallery.scrollLeft += 2 * direction;

	let len = gallery.getElementsByTagName('img').length;
	let max_length = len * 200 + (len-1) * 10 - 1000;


		// Right to Left
	if (gallery.scrollLeft == max_length && direction == 1) {
			// Add
		let el = document.createElement('img');
		el.src = gallery.getElementsByTagName('img')[0].src;
		gallery.appendChild(el);

			// Remove
		gallery.getElementsByTagName('img')[0].remove();
		gallery.scrollLeft -= 210;
	}

		// Left to Right
	if (gallery.scrollLeft == 0 && direction == -1) {
			// Add
		let el = document.createElement('img');
		el.src = gallery.getElementsByTagName('img')[len-1].src;
		gallery.insertBefore(el, gallery.getElementsByTagName('img')[0]);

			// Remove
		gallery.getElementsByTagName('img')[len].remove();
		gallery.scrollLeft += 210;
	}
}

// function scrambleLetter() {
// 	let letter = document.getElementById('letter').textContent;
//     let newLetter = '';
//     letter = letter.split('');

//     while (letter.length > 0) {
//       newLetter +=  letter.splice(letter.length * Math.random() << 0, 1);
//     }

//     document.getElementById('letter').innerHTML = newLetter;
// }

function popupMessage(message, src, name="<u>Achievement Unlocked!</u>", showAchievements=true) {
	let popup = document.getElementById('popup');

	popup.classList.toggle('pop');
	if (popupIsAnimating) {
		void popup.offsetWidth;
		popup.classList.toggle('pop');
	}


	popup.getElementsByTagName('img')[0].src = src;
	popup.getElementsByTagName('h2')[0].innerHTML = name;
	popup.getElementsByTagName('p')[0].innerHTML = message;
	popup.getElementsByTagName('h5')[0].innerHTML = `Achievements Left : ${achievementsLeft}`;

	if (!achievementsLeft) {
		popup.getElementsByTagName('h5')[0].innerHTML = 'All Achievements Unlocked!';
		let sfx = new Audio('audio/achievementsAllUnlocked.mp3');
		sfx.play();
	}
	else if (name == "<u>Achievement Unlocked!</u>") {
		let sfx = new Audio('audio/achievement_SFX.mp3');
		sfx.play();
	}

	if (showAchievements) popup.getElementsByTagName('h5')[0].style.display = "block";
	else popup.getElementsByTagName('h5')[0].style.display = "none";

	popupIsAnimating = true;
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
	document.querySelector('body').style.overflowY = 'visible';
	document.querySelector('#card').style.display = 'block';

		// Achievement
	if (achievements.clickTheCake) {
		achievements.clickTheCake = false;
		achievementsLeft--;
		popupMessage('HAPPY BIRTHDAYY FAGGOT!!!<3<3<3', 'images/achievement_clickTheCake.gif');
	}
})

bgm.addEventListener('ended', () => {
	bgm.currentTime = 0;
	bgm.play();
})





	// Card
document.addEventListener('mousedown', (e) => {
	if (e.which == 2) {
		e.returnValue = false;
    	e.cancelBubble = true;
     	return false;
	}
})

// document.getElementById('letter').addEventListener('click', () => {
// 	scramble = false;
// 	document.getElementById('letter').innerHTML = "hi luan I'm wishing you a spectacular 17th birthday you're so old did you know in California there's a 17 mile road crossing a beach called pebble beach ⛱️  this is the 2nd time I've witnessed your birthday i hope the cake gets better every year than the last and I, without a doubt, will be there for the next birthday.<br><br>your birthday means alot to me i might as well buy a cupcake and light my own candle and be delusional but besides that i hope you enjoy today it's a special occasion. xoxo who else other than s.g gayfagus"
// })

document.getElementById('ugay').addEventListener('click', () => {
	let gay = new Audio("audio/gay-echo.mp3");
	gay.play();

		// Achievement
	if (achievements.bigGay) {
		achievements.bigGay = false;
		achievementsLeft--;
		popupMessage('Be who you are For your Pride Don’t Hide', 'images/achievement_bigGay.gif');
	}
})

document.getElementById('ugay').addEventListener('mouseover', () => {
	let tap = new Audio("audio/tap.mp3");
	tap.play();
})

document.getElementById('pfp').addEventListener('mouseover', () => {
	let tap = new Audio("audio/tap.mp3");
	tap.play();
})

document.getElementById('godzilla').addEventListener('mouseover', () => {
	let tap = new Audio("audio/tap.mp3");
	tap.play();
})





	// Links
for (let i=0; i<2; i++) {
	document.getElementsByTagName('a')[i].addEventListener('click', (e) => {
		if (!i) {
				// Achievement
			if (achievements.california) {
				achievements.california = false;
				achievementsLeft--;
				popupMessage("California's Top Yaoi Expert", 'images/achievement_california.gif');
			}
		}
		else {
				// Achievement
			if (achievements.faggus) {
				achievements.faggus = false;
				achievementsLeft--;
				popupMessage("Shion's Number 1 Faggus", 'images/achievement_faggus.gif');
			}
		}
	})
}










document.getElementById('pfp').addEventListener('click', (e) => {
	let boom = new Audio("audio/explosion.mp3");
	boom.play();

	boom = document.createElement('img');
	boom.src = 'images/explosion.gif';
	boom.style.position = 'fixed';
	boom.style.height = '100px';
	boom.style.left = `${e.clientX - document.getElementById('intro').getBoundingClientRect().left - 40}px`;
	boom.style.top = `${e.clientY - document.getElementById('intro').getBoundingClientRect().top + 150}px`;
	document.getElementById('intro').appendChild(boom);

	setTimeout( () => {
		boom.remove();
	}, 800)

		// Achievement
	if (achievements.destroyLove) {
		achievements.destroyLove = false;
		achievementsLeft--;
		popupMessage('Shuan ForNEVER XXXX Cringee', "images//achievement_destroyLove.gif");
	}
})







document.getElementsByClassName('pop')[0].addEventListener('animationend', () => {
	document.getElementById('popup').classList.toggle('pop');
	popupIsAnimating = false;
})

document.addEventListener('visibilitychange', (e) => {
	let popup = document.getElementById('popup');

	if (popupIsAnimating) {
		popup.classList.toggle('pop');
		void popup.offsetWidth;
		popup.classList.toggle('pop');
	}
})