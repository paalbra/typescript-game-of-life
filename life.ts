class Life {

	width:number;
	height:number;
	imageData:ImageData;
	pixels:number;
	pixelData:Array<number>;
	pixelData2:Array<number>;
	pixelNeighbours:Array<number[]>;
	canvas:HTMLCanvasElement;
	ctx:CanvasRenderingContext2D;

	constructor(canvasId:string, width:number, height:number) {
		this.canvas = (<HTMLCanvasElement>document.getElementById(canvasId));
		this.canvas.width  = width;
		this.canvas.height = height;
		this.width = width;
		this.height = height;
		this.pixels = this.width * this.height;

		this.ctx = this.canvas.getContext("2d");
		this.pixelData = new Array<number>(this.pixels * 4);
		this.pixelData2 = new Array<number>(this.pixels * 4);
		this.pixelNeighbours = new Array<number[]>(this.pixels);
		for (var i:number = 0; i < this.pixelData.length; i += 4) {
			this.pixelData[i]   = 255;
			this.pixelData[i+1] = 255;
			this.pixelData[i+2] = 128;
			this.pixelData[i+3] = 255;
			this.pixelNeighbours[i/4] = this.getNeighbours(i/4);
		}
		this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
		for (var i = 0; i < this.imageData.data.length; i += 4) {
			this.imageData.data[i] = this.pixelData[i];
			this.imageData.data[i+1] = this.pixelData[i+1];
			this.imageData.data[i+2] = this.pixelData[i+2];
			this.imageData.data[i+3] = this.pixelData[i+3];
		}
		this.ctx.putImageData(this.imageData, 0, 0);
		this.pixelData2 = this.pixelData.slice(0);
	}

	randomizeImageData() {
		for (var i = 0; i < this.pixelData.length; i += 4) {
			this.pixelData[i]   = 255;
			this.pixelData[i+1] = 255;
			this.pixelData[i+2] = 128;
			if (Math.round(Math.random())) {
				this.pixelData[i+3] = 255;
			} else {
				this.pixelData[i+3] = 0;
			}
		}
		this.pixelData2 = this.pixelData.slice(0);
	}

	updateCanvas() {
		for (var i = 3; i < this.imageData.data.length; i += 4) {
			this.imageData.data[i] = this.pixelData[i];
		}
		this.ctx.putImageData(this.imageData, 0, 0);
	}
	
	getNeighbours(index:number) {
		var neighbours:Array<number> = new Array<number>();
		var topEdge:boolean = index < this.width;
		var bottomEdge:boolean = index >= (this.width*this.height - this.width);
		var leftEdge:boolean = index%this.width === 0;
		var rightEdge:boolean = (index+1)%this.width === 0;
		for (var i = -1; i <= 1; i++) {
			if (i == -1 && topEdge)
				continue;
			if (i == 1 && bottomEdge)
				continue;
			for (var j = -1; j <= 1; j++) {
				if (j == -1 && leftEdge)
					continue;
				if (j == 1 && rightEdge)
					continue;
				if (j == 0 && i == 0)
					continue;
				neighbours.push((index+(i*this.width)+j)*4+3);
			}
		}
		return neighbours;
	}

	getLiveNeighbours(index:number) {
		var liveNeighbours:number = 0;
		for (var i = -1, len = this.pixelNeighbours[index].length; ++i < len;) {
			if (this.pixelData[this.pixelNeighbours[index][i]] == 255 && ++liveNeighbours > 3) {
				break;
			}
		}
		return liveNeighbours;
	}
	
	tick() {
		for (var i = -1, len = this.width*this.height; ++i < len;) {
			var liveNeighbours = this.getLiveNeighbours(i);
			//Any live cell with fewer than two live neighbours dies, as if caused by under-population.
			//Any live cell with two or three live neighbours lives on to the next generation.
			//Any live cell with more than three live neighbours dies, as if by overcrowding.
			//Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
			if (this.pixelData[i*4+3] == 255 && liveNeighbours < 2) {
				this.pixelData2[i*4+3] -= 50;
			} else if (this.pixelData[i*4+3] == 255 && liveNeighbours > 3) {
				this.pixelData2[i*4+3] -= 50;
			} else if (this.pixelData[i*4+3] != 255 && liveNeighbours == 3) {
				this.pixelData2[i*4+3] = 255;
			} else if (this.pixelData[i*4+3] >= 5 && this.pixelData[i*4+3] < 255 ) {
				this.pixelData2[i*4+3] = this.pixelData[i*4+3] - 5;
			} else {
				this.pixelData2[i*4+3] = this.pixelData[i*4+3];
			}
		}
		var tmpPixelData = this.pixelData;
		this.pixelData = this.pixelData2;
		this.pixelData2 = tmpPixelData;
	}
}
