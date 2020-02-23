
// classes

function Camera(viewSize, pos, orientation)
{
	this.viewSize = viewSize;
	this.pos = pos;
	this.orientation = orientation;

	this.viewSizeHalf = this.viewSize.clone().divideScalar(2);
}
