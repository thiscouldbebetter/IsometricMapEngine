
class MapOfCells
{
	constructor(name, cellSizeInPixels, sizeInCells, cells)
	{
		this.name = name;
		this.cellSizeInPixels = cellSizeInPixels;
		this.sizeInCells = sizeInCells;
		this.cells = cells;
	}

	// static methods

	static buildFromCellTerrainsAndAltitudesAsStrings
	(
		name, 
		cellSizeInPixels, 
		cellTerrainsAsStrings,
		cellAltitudesAsStrings
	)
	{
		for (var i = 0; i < cellTerrainsAsStrings.length; i++)
		{
			var cellTerrainRowAsString = cellTerrainsAsStrings[i];
			if (cellTerrainRowAsString.trim().length == 0)
			{
				cellTerrainsAsStrings.length--;
				break;
			}
		}

		for (var i = 0; i < cellAltitudesAsStrings.length; i++)
		{
			var cellTerrainRowAsString = cellAltitudesAsStrings[i];
			if (cellTerrainRowAsString.trim().length == 0)
			{
				cellAltitudesAsStrings.length--;
				break;
			}
		}

		var sizeInCells = new Coords
		(
			cellTerrainsAsStrings[0].length, 
			cellTerrainsAsStrings.length,
			1
		);

		var cells = [];
		var cellPos = new Coords(0, 0, 0);
		var terrains = Terrain.Instances()._All;

		for (var y = 0; y < sizeInCells.y; y++)
		{
			cellPos.y = y;

			var cellTerrainRowAsString = cellTerrainsAsStrings[y];
			var cellAltitudeRowAsString = cellAltitudesAsStrings[y];

			for (var x = 0; x < sizeInCells.x; x++)
			{
				cellPos.x = x;

				var terrainCodeCharAtCell = cellTerrainRowAsString[x];
				var terrainAtCell = terrains[terrainCodeCharAtCell];

				var altitudeAtCellAsString = cellAltitudeRowAsString[x];
				var altitudeAtCell = 
				(
					altitudeAtCellAsString == "." 
					? 0 
					: parseInt(altitudeAtCellAsString)
				); 

				var cell = new MapCell(terrainAtCell, altitudeAtCell);

				cells.push(cell);
			}
		}

		var returnValue = new MapOfCells
		(
			name, 
			cellSizeInPixels,
			sizeInCells,
			cells
		);

		return returnValue;
	}

	// instance methods	

	// cells

	getCellAtPos(cellPosToGet)
	{
		return this.cells[this.getIndexOfCellAtPos(cellPosToGet)];
	}

	getIndexOfCellAtPos(cellPosToGet)
	{
		return cellPosToGet.y * this.sizeInCells.x + cellPosToGet.x;
	}

	getPosOfCellAtIndex(cellIndexToGet)
	{
		return new Coords
		(
			cellIndexToGet % this.sizeInCells.x, 
			Math.floor(cellIndexToGet / this.sizeInCells.x),
			0 
		);
	}

	setCellAtPos(cellPosToSet, cellToSet)
	{
		this.cells[this.getIndexOfCellAtPos(cellPosToSet)] = cellToSet;
	}

	// html

	drawToGraphicsForCamera(graphics, camera)
	{
		graphics.fillStyle = Color.Instances().Black.systemColor();
		graphics.fillRect(0, 0, camera.viewSize.x, camera.viewSize.y);

		var cellPos = new Coords(0, 0, 0);
		var drawPos = new Coords(0, 0, 0);

		var transforms = Transform.Instances();
		var transformCameraIsometric = transforms.CameraIsometric;

		var cellIndicesAndDistancesSortedBackToFront = [];

		for (var y = 0; y < this.sizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < this.sizeInCells.x; x++)
			{
				cellPos.x = x;

				this.drawToGraphicsForCamera_1_Cell
				(
					camera,
					drawPos,
					cellPos,
					transformCameraIsometric,
					cellIndicesAndDistancesSortedBackToFront
				);
			}
		}

		this.drawToGraphicsForCamera_2_Render
		(
			graphics,
			camera,
			drawPos,
			transformCameraIsometric,
			cellIndicesAndDistancesSortedBackToFront,
		);
	}

	drawToGraphicsForCamera_1_Cell
	(
		camera,
		drawPos,
		cellPos,
		transformCameraIsometric,
		cellIndicesAndDistancesSortedBackToFront
	)
	{
		drawPos.overwriteWith
		(
			cellPos
		).multiply
		(
			this.cellSizeInPixels
		);

		transformCameraIsometric.transformCoords
		(
			drawPos, [ camera ]
		);

		var c;
		for (c = 0; c < cellIndicesAndDistancesSortedBackToFront.length; c++)
		{
			var existing = cellIndicesAndDistancesSortedBackToFront[c];
			var distanceOfExisting = existing[1];
			if (drawPos.z >= distanceOfExisting)
			{
				break;
			}
		}

		cellIndicesAndDistancesSortedBackToFront.splice
		(
			c, 
			0, 
			[
				this.getIndexOfCellAtPos(cellPos), 
				drawPos.z
			]
		);
	}

	drawToGraphicsForCamera_2_Render
	(
		graphics,
		camera,
		drawPos,
		transformCameraIsometric,
		cellIndicesAndDistancesSortedBackToFront,
	)
	{
		var transforms = Transform.Instances();
		var transformScale = transforms.Scale;

		var meshBuilder = new MeshBuilder();
		var meshUnitCube = meshBuilder.unitCube_Geometry();
		var meshForCell = meshBuilder.unitCube_Geometry();
		var cameraForward = camera.orientation.forward;

		var scaleFactors = new Coords(.5, .5, 1);

		for (var c = 0; c < cellIndicesAndDistancesSortedBackToFront.length; c++)
		{
			var cellIndexAndDistance = cellIndicesAndDistancesSortedBackToFront[c];
			var cellIndex = cellIndexAndDistance[0];
			var cellDistance = cellIndexAndDistance[1];

			var cellPos = this.getPosOfCellAtIndex(cellIndex); 

			var cellAtPos = this.getCellAtPos(cellPos);

			var cellTerrain = cellAtPos.terrain;
			var cellTerrainColors = cellTerrain.colors;
			var cellAltitude = cellAtPos.altitude;

			cellPos.z = 0 - cellAltitude;

			scaleFactors.z = cellAltitude;

			meshForCell.overwriteWith(meshUnitCube);
			transforms.Scale.transformCoordsMany
			(
				meshForCell.vertexOffsets, [ scaleFactors ]
			);

			var faces = meshForCell.faces();
			var faceIndexTop = 4;

			for (var f = 0; f < faces.length; f++)
			{
				var colorIndex = (f == faceIndexTop ? 0 : 1);
				graphics.fillStyle = cellTerrainColors[colorIndex].systemColor();
				graphics.beginPath();

				var face = faces[f];
				var faceNormal = face.plane().normal;
				var vertexOffsets = face.vertices;

				if (faceNormal.dotProduct(cameraForward) < 0)
				{
					for (var v = 0; v < vertexOffsets.length; v++)
					{
						var vertexOffset = vertexOffsets[v];
						drawPos.overwriteWith
						(
							cellPos
						).add
						(
							vertexOffset
						).multiply
						(
							this.cellSizeInPixels
						);

						transformCameraIsometric.transformCoords
						(
							drawPos,
							[ camera ]
						);

						if (v == 0)
						{
							graphics.moveTo(drawPos.x, drawPos.y);
						}
						else
						{
							graphics.lineTo(drawPos.x, drawPos.y);
						}
					}

					graphics.closePath();
					graphics.fill();
					graphics.stroke();
				}
			}
		}
	}
}
