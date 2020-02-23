
function Transform(name, transformCoords)
{
	this.name = name;
	this.transformCoords = transformCoords;
}

{
	function Transform_Instances()
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

	Transform.Instances = new Transform_Instances();

	// instance methods

	Transform.prototype.transformCoordsMany = function(coordsSetToTransform, parameters)
	{
		for (var i = 0; i < coordsSetToTransform.length; i++)
		{
			this.transformCoords(coordsSetToTransform[i], parameters);
		}
	};
}
