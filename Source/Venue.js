
class Venue
{
	constructor(name, map, camera)
	{
		this.name = name;
		this.map = map
		this.camera = camera;
	}

	draw = function()
	{
		var d = document;

		var canvas = d.getElementById("canvasOutput");

		var graphics = canvas.getContext("2d");

		this.map.drawToGraphicsForCamera(graphics, this.camera);
	}
}
