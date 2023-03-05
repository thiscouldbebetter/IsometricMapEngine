
class UiEventHandler
{
	static buttonMapDemoLoad_Clicked()
	{
		var mapDemo = MapOfCells.demo();

		var cellTerrainsAsStrings = [];
		var cellAltitudesAsStrings = [];

		var mapSizeInCells = mapDemo.sizeInCells;
		var cellPos = new Coords(0, 0, 0);

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPos.y = y;

			var cellRowTerrainsAsString = "";
			var cellRowAltitudesAsString = "";

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPos.x = x;

				var cellAtPos = mapDemo.getCellAtPos(cellPos);

				var cellTerrain = cellAtPos.terrain;
				var cellAltitude = cellAtPos.altitude;

				if (cellAltitude == 0)
				{
					cellAltitude = ".";
				}

				cellRowTerrainsAsString += cellTerrain.codeChar;
				cellRowAltitudesAsString += cellAltitude;
			}

			cellTerrainsAsStrings.push(cellRowTerrainsAsString);
			cellAltitudesAsStrings.push(cellRowAltitudesAsString);
		}

		var d = document;
		var textareaTerrainDefns =
			d.getElementById("textareaTerrainDefns");
		var textareaTerrains =
			d.getElementById("textareaTerrains");
		var textareaAltitudes =
			d.getElementById("textareaAltitudes");

		textareaTerrainDefns.value =
			JSON.stringify(mapDemo.terrains, null, 4);
		textareaTerrains.value =
			cellTerrainsAsStrings.join("\n");
		textareaAltitudes.value =
			cellAltitudesAsStrings.join("\n");
	}

	static buttonRender_Clicked()
	{
		var d = document;

		var cellSizeInPixels = new Coords(16, 16, 2.4);

		var textareaTerrainDefns = d.getElementById("textareaTerrainDefns");
		var terrainDefnsAsJson = textareaTerrainDefns.value;
		var terrainDefns = null;
		try
		{
			terrainDefns = JSON.parse(terrainDefnsAsJson);
		}
		catch (err)
		{
			alert("The value in the Terrain Definitions field could not be parsed as JSON!");
			return;
		}

		terrainDefns.forEach
		(
			x => Terrain.setPrototypesOnTerrainAsObject(x)
		);

		var textareaTerrains = d.getElementById("textareaTerrains");
		var cellTerrainsAsString = textareaTerrains.value;
		var cellTerrainsAsStrings = cellTerrainsAsString.split("\n");

		var textareaAltitudes = d.getElementById("textareaAltitudes");
		var cellAltitudesAsString = textareaAltitudes.value;
		var cellAltitudesAsStrings = cellAltitudesAsString.split("\n");

		var map = MapOfCells.buildFromCellTerrainsAndAltitudesAsStrings
		(
			"Map0",
			cellSizeInPixels,
			terrainDefns,
			cellTerrainsAsStrings,
			cellAltitudesAsStrings
		);

		var inputCameraViewSizeX = d.getElementById("inputCameraViewSizeX");
		var inputCameraViewSizeY = d.getElementById("inputCameraViewSizeY");
		var cameraViewSizeX = parseInt(inputCameraViewSizeX.value);
		var cameraViewSizeY = parseInt(inputCameraViewSizeY.value);
		var cameraViewSize =
			new Coords(cameraViewSizeX, cameraViewSizeY, 1);

		var inputCameraViewPosX = d.getElementById("inputCameraViewPosX");
		var inputCameraViewPosY = d.getElementById("inputCameraViewPosY");
		var inputCameraViewPosZ = d.getElementById("inputCameraViewPosZ");
		var cameraViewPosX = parseInt(inputCameraViewPosX.value);
		var cameraViewPosY = parseInt(inputCameraViewPosY.value);
		var cameraViewPosZ = parseInt(inputCameraViewPosZ.value);
		var cameraViewPos =
			new Coords(cameraViewPosX, cameraViewPosY, 1);

		var cameraPos = new Coords
		(
			// 32, 96, -32
			cameraViewPosX, cameraViewPosY, cameraViewPosZ
		);
		var cameraOri = new Orientation
		(
			new Coords(1, -1, 1), // forward
			new Coords(0, 0, 1) // down
		);

		var camera = new Camera
		(
			cameraViewSize,
			cameraPos,
			cameraOri
		);

		var venue = new Venue("Venue0", map, camera);

		venue.draw();
	}
}
