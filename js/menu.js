var game = {
	COL_MAX: 		2,
	COL_SIZE:		50,
	ROW_SIZE:		30,
	TOPX:				10,
	TOPY:				10,

	backgroundImage: null,
	blueprintData: null,
	letterImage: null,
	letterGroup: null
}

paper.install(window);
window.onload = function() {
	paper.setup('myCanvas');

project.importSVG("assets/menu_bg.svg", {
	expandShapes: true, onLoad: function(t) {
		game.backgroundImage = t;
		t.fitBounds(view.bounds);
		t.sendToBack();
	}
});

project.importSVG("assets/menu_fg.svg", {
	onLoad: function(t) {
		game.letterImage = t;
		t.fitBounds(view.bounds);
		t.bringToFront();
	}
});

Papa.parse("data/blueprint.csv", {
	download: true, header: true,
	complete: function(results) {
		game.blueprintData = results.data;
	}
});

function initGame() {

	game.letterGroup = new Group();

	let row = 0, col = 0;
	game.blueprintData.forEach(function(t) {
		var text = new PointText(
			new Point(
				game.TOPX + (col * game.COL_SIZE),
				game.TOPY + (row * game.ROW_SIZE)
			)
		);
		text.fillColor = 'black';
		text.content = t.amharic;
		game.letterGroup.addChild(text);

		if (col++ == game.COL_MAX + row % 2) {
			col = 0; row++;
		}
	}); //- forEach

	game.letterGroup.fitBounds(view.bounds);
	// letterGroup.position = view.center;
	// letterGroup.scale(3.0);

} // -initGame



function checkGameLoaded() {
	if (
		game.backgroundImage != null &&
		game.blueprintData != null &&
		game.letterImage != null
	)
		return initGame();
	setTimeout(checkGameLoaded, 200);
}
setTimeout(checkGameLoaded, 200);

// Adapted from the following Processing example:
// http://processing.org/learning/topics/follow3.html

// The amount of points in the path:
var points = 25;

// The distance between the points:
var length = 35;

var path = new Path({
	strokeColor: '#E4141B',
	strokeWidth: 20,
	strokeCap: 'round'
});

var start = view.center / [10, 1];
for (var i = 0; i < points; i++)
	path.add(start + new Point(i * length, 0));

function onMouseMove(event) {
	path.firstSegment.point = event.point;
	for (var i = 0; i < points - 1; i++) {
		var segment = path.segments[i];
		var nextSegment = segment.next;
		var vector = segment.point - nextSegment.point;
		vector.length = length;
		nextSegment.point = segment.point - vector;
	}
	path.smooth({ type: 'continuous' });
}

function onMouseDown(event) {
	path.fullySelected = true;
	path.strokeColor = '#e08285';
}

function onMouseUp(event) {
	path.fullySelected = false;
	path.strokeColor = '#e4141b';
}


}; // -window.onload
