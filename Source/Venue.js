
function Venue(name, map, camera)
{
	this.name = name;
	this.map = map
	this.camera = camera;
}
{
	Venue.prototype.draw = function()
	{
		var d = document;

		var canvas = d.getElementById("canvasOutput");

		var graphics = canvas.getContext("2d");

		this.map.drawToGraphicsForCamera(graphics, this.camera);
	};
}
