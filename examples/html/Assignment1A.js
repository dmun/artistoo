"use strict"

// Hack to get type information
/** @typedef {import('./artistoo.js')} CPM **/
/** @typedef {import('./artistoo.js').Simulation} Simulation **/
/** @type {CPM} **/
var CPM = CPM;

/*	----------------------------------
	CONFIGURATION SETTINGS
	----------------------------------
*/
let config = {

	// Grid settings
	ndim: 3,
	field_size: [150, 150],

	// CPM parameters and configuration
	conf: {
		// Basic CPM parameters
		torus: [true, true],						// Should the grid have linked borders?
		seed: 1,							// Seed for random number generation.
		T: 20,								// CPM temperature

		// Constraint parameters. 
		// Mostly these have the format of an array in which each element specifies the
		// parameter value for one of the cellkinds on the grid.
		// First value is always cellkind 0 (the background) and is often not used.

		// Adhesion parameters:
		J: [
			[NaN, 12, 6],
			[12, 6, 16],
			[6, 16, 0],
		],

		// VolumeConstraint parameters
		// VolumeConstraint importance per cellkind
		// Target volume of each cellkind
		LAMBDA_V: [0, 100, 50],
		V: [0, 100, 200],

		// PerimeterConstraint parameters
		LAMBDA_P: [0, 16, 2],				// PerimeterConstraint importance per cellkind
		P: [0, 0, 180],					// Target perimeter of each cellkind

		// ActivityConstraint parameters
		LAMBDA_ACT: [0, 0, 200],			// ActivityConstraint importance per cellkind
		MAX_ACT: [0, 0, 80],				// Activity memory duration per cellkind
		ACT_MEAN: "geometric"				// Is neighborhood activity computed as a
		// "geometric" or "arithmetic" mean?
	},

	// Simulation setup and configuration
	simsettings: {

		// Cells on the grid
		NRCELLS: [1, 1],					// Number of cells to seed for all
		// non-background cellkinds.

		// Runtime etc
		BURNIN: 0,
		RUNTIME: 1000,
		RUNTIME_BROWSER: 20000,

		// Visualization
		CANVASCOLOR: "eaecef",
		CELLCOLOR: ["000000", "FF0000"],
		ACTCOLOR: [true, false],			// Should pixel activity values be displayed?
		SHOWBORDERS: [true, true],				// Should cellborders be displayed?
		zoom: 2,							// zoom in on canvas with this factor.

		// Output images
		SAVEIMG: true,					// Should a png image of the grid be saved
		// during the simulation?
		IMGFRAMERATE: 5,					// If so, do this every <IMGFRAMERATE> MCS.
		SAVEPATH: "output/img/CellSorting",				// ... And save the image in this folder.
		EXPNAME: "CellSorting",					// Used for the filename of output images.

		// Output stats etc
		STATSOUT: { browser: false, node: true }, // Should stats be computed?
		LOGRATE: 10							// Output stats every <LOGRATE> MCS.

	}
}
/*	---------------------------------- */
let sim, meter

function initialize() {
	/* 	The following functions are defined below and will be added to
		 the simulation object.*/
	let custommethods = {
		initializeGrid: initializeGrid
	}
	sim = new CPM.Simulation(config, custommethods)


	meter = new FPSMeter({ left: "auto", right: "5px" })
	step()
}

function step() {
	sim.step()
	meter.tick()
	if (sim.conf["RUNTIME_BROWSER"] == "Inf" | sim.time + 1 < sim.conf["RUNTIME_BROWSER"]) {
		requestAnimationFrame(step)
	}
}



/** The following custom methods will be added to the simulation object
below. 
 * @this {Simulation}
 */
function initializeGrid() {
	// add the GridManipulator if not already there and if you need it
	if (!this.helpClasses["gm"]) { this.addGridManipulator() }

	let width = config.field_size[0]
	let height = config.field_size[1]
	let xCells = 5, yCells = 5

	for (let xi = 0; xi < xCells; xi++) {
		for (let yi = 0; yi < yCells; yi++) {
			this.gm.seedCellAt(1, [xi * width / xCells, yi * height / yCells])
		}
	}

	for (let i = 0; i < 100; i++) {
		this.gm.seedCell(2)
	}
}

