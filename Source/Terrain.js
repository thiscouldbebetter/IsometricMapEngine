
function Terrain(name, codeChar, colors)
{
	this.name = name;
	this.codeChar = codeChar;
	this.colors = colors;
}

{
	function Terrain_Instances()
	{
		var colors = Color.Instances();

		this.Grass = new Terrain
		(
			"Grass", 
			".",
			[ colors.Green, colors.Yellow ]
		);

		this.Sand = new Terrain
		(
			"Sand", 
			"-",
			[ colors.Yellow, colors.Yellow ]
		);

		this.Water = new Terrain
		(
			"Water", 
			"~",
			[ colors.Blue, colors.Blue ]
		);

		this._All = 
		[
			this.Grass,
			this.Sand,
			this.Water,
		];

		for (var i = 0; i < this._All.length; i++)
		{
			var terrain = this._All[i];
			this._All[terrain.codeChar] = terrain;
		}
	}

	Terrain.Instances = new Terrain_Instances();
}
