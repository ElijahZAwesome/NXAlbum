//Simply importing a few modules, since it's pretty important.
var input = require("input");
var sdl = require("sdl");
var game = require("game");
var fs = require("fs");
var photoArray = [];
var finalArray = [];
var fullscreen = false;
var fullprevx = 0;
var fullprevy = 0;
var currentfullindex = 0;
var touchtimer = 0;
var shouldtimer = false;

sdl.setFPS(30);

var icon = new sdl.Object(__dirname + "/icon.png");
icon.x(20);
icon.y(20);
icon.w(70);
icon.h(50);
icon.usesPhysics(false);
icon.show();

var text = new sdl.Text("Welcome to the Homebrew Album.", 30);
text.x(120);
text.y(28);
text.depth(1);
text.color({ R: 51, G: 51, B: 51, A: 255 });
text.show();

function changeTheme(theme) {
	if(theme == "white") {
		sdl.setBackground({ R: 235, G: 235, B: 235, A: 255 });
		text.color({ R: 51, G: 51, B: 51, A: 255 });
		fs.writeFile("sdmc:/albumtheme.txt", "white");
	} else if(theme == "black") {
		sdl.setBackground({ R: 0, G: 0, B: 0, A: 255 });
		text.color({ R: 235, G: 235, B: 235, A: 255 });
		fs.writeFile("sdmc:/albumtheme.txt", "black");
	}
}

if(fs.exists("sdmc:/albumtheme.txt")) {
	
var theme = fs.readFile("sdmc:/albumtheme.txt");

if(theme == "white") {
	changeTheme("white");
} else if(theme == "black") {
	changeTheme("black");
}
} else {
	changeTheme("white");
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
	strings = fs.readdir("sdmc:/Nintendo/Album");
	strings.splice(0, 1);
	strings.sort();
	strings.clean(undefined);
	strings.clean(null);
	strings.clean(0);
	strings.forEach(function(entry) {
		subarray = fs.readdir("sdmc:/Nintendo/Album/" + entry);
		subarray.splice(0, 1);
		subarray.sort();
		subarray.clean(undefined);
		subarray.clean(null);
		subarray.clean(0);
		subarray.forEach(function(subentry) {
			subsubarray = fs.readdir("sdmc:/Nintendo/Album/" + entry + "/" + subentry);
			subsubarray.splice(0, 1);
			subsubarray.sort();
			subsubarray.clean(undefined);
			subsubarray.clean(null);
			subsubarray.clean(0);
			subsubarray.forEach(function(subsubentry) {
				subsubsubarray = fs.readdir("sdmc:/Nintendo/Album/" + entry + "/" + subentry + "/" + subsubentry);
				subsubsubarray.splice(0, 1);
				subsubsubarray.sort();
				subsubsubarray.clean(undefined);
				subsubsubarray.clean(null);
				subsubsubarray.clean(0);
				subsubsubarray.forEach(function(subsubsubentry) {
					finalArray.push("/" + entry + "/" + subentry + "/" + subsubentry + "/" + subsubsubentry);
				});
			});
		});
	});
	
	subsubsubarray.clean(undefined);
	subsubsubarray.clean(null);
	subsubsubarray.clean(0);
	finalArray.sort();
	finalArray.reverse();
	
	// Our file, located at the SD card
	var ourfile = "sdmc:/photolist.txt";
	// We create this file (if doesn't exist) and write down the Switch's architecture ("aarch64")
	fs.writeFile(ourfile, "" + finalArray.toString());
	
	/*finalArray.forEach(function(dir) {
		debugstring += dir + "\n";
	});*/

	//text.text("Loading, please wait.");
	
	var startingx = 100;
	var startingy = 100;
	
	var xval = startingx;
	var yval = startingy;
	var width = 200;
	var height = 113;
	var perRow = 4;
	var currentPerRow = 0;
	
	finalArray.forEach(function(entry) {
		if(!entry.includes(".jpg")) {
			return;
		}
		currentPerRow++;
		if(currentPerRow > perRow) {
			yval += height + 20;
			currentPerRow = 0;
			xval = startingx;
		} else {
			xval += width + 20;
		}
		var newphoto = new sdl.Object("sdmc:/Nintendo/Album" + entry);
		newphoto.x(xval);
		newphoto.y(yval);
		newphoto.w(width);
		newphoto.h(height);
		newphoto.usesPhysics(false);
		photoArray.push(newphoto);
		photoArray[photoArray.indexOf(newphoto)].show();
	});

// Game's main loop
game.mainLoop(function()
{
    var key = input.getPressed();
    var touch = input.getTouch();
	
	if(shouldtimer) {
		touchtimer++;
	}
	
	photoArray.forEach(function(photo) {
		if(fullscreen == true || touchtimer < 30) {
			if(shouldtimer) return;
		}
		if(touch.X == 0 && touch.Y == 0) {
			return;
		}
		if(touch.X < photo.x() + photo.w() && touch.X > photo.x() && touch.Y < photo.y() + photo.h() && touch.Y > photo.y()) {
			if(shouldtimer) {
				if(touchtimer < 30) {
					return;
				}
			}
			touchtimer = 0;
			shouldtimer = false;
			photoArray.forEach(function(photoToHide) {
				photoToHide.hide();
			});
			fullprevx = photo.x();
			fullprevy = photo.y();
			text.hide();
			icon.hide();
			photo.show();
			photo.x(0);
			photo.y(0);
			photo.w(1280);
			photo.h(720);
			fullscreen = true;
			currentfullindex = photoArray.indexOf(photo);
			shouldtimer = true;
		} else {
			return;
		}
	});
	
	if(fullscreen && touch.X != 0 && touch.Y != 0) {
		if(shouldtimer) {
			if(touchtimer < 30) {
				return;
			}
		}
		touchtimer = 0;
		photoArray.forEach(function(photoToShow) {
			photoToShow.show();
		});
		text.show();
		icon.show();
		photoArray[currentfullindex].x(fullprevx);
		photoArray[currentfullindex].y(fullprevy);
		photoArray[currentfullindex].w(200);
		photoArray[currentfullindex].h(113);
		fullscreen = false;
	}
    
    if (key == input.B) {
		changeTheme("black");
	} else if (key == input.Y) {
		changeTheme("white");
	} else if (key == input.X) {
		var ourfile = "sdmc:/photoobjlist.txt";
		fs.writeFile(ourfile, "" + photoArray.toString() + " " + photoArray.length);
	} else if(key == input.Plus) {
        game.exitLoop();
    }
});