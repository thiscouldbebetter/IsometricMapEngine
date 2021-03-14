
class Transform
{
	constructor(name, transformCoords)
	{
		this.name = name;
		this.transformCoords = transformCoords;
	}

	static Instances()
	{
		if (Transform._instances == null)
		{
			Transform._instances = new Transform_Instances();
		}
		return Transform._instances;
	}

	// instance methods

	transformCoordsMany(coordsSetToTransform, parameters)
	{
		for (var i = 0; i < coordsSetToTransform.length; i++)
		{
			this.transformCoords(coordsSetToTransform[i], parameters);
		}
	}
}

class Transform_Instances
{
	constructor()
	{
		this.CameraIsometric = new Transform
		(
			"CameraIsometric",
			function(coordsToTransform, parameters)
			{
				var camera = parameters[0];

				coordsToTransform.subtract
				(
					camera.pos
				);

				var cameraOrientation = camera.orientation;

				coordsToTransform.overwriteWithDimensions
				(
					cameraOrientation.right.dotProduct
					(
						coordsToTransform
					),
					cameraOrientation.down.dotProduct(coordsToTransform),
					cameraOrientation.forward.dotProduct(coordsToTransform)
				);

				coordsToTransform.add
				(
					camera.viewSizeHalf
				);
			}
		);

		this.Scale = new Transform
		(
			"Scale",
			function(coordsToTransform, parameters)
			{
				var scaleFactors = parameters[0];

				coordsToTransform.multiply(scaleFactors);

			}
		);

		this.Translate = new Transform
		(
			"Translate",
			function(coordsToTransform, parameters)
			{
				var amountToTranslate = parameters[0];
				coordsToTransform.add(amountToTranslate);
			}
		);
	}
}
