// layer = { map : array[][], style : {}}

function createEmptyLayer(topSideCount, leftSideCount)
{
    var rowsCount = leftSideCount * 2 - 1;
    var layer = new Array(rowsCount);
    for (var rowIndex = 0; rowIndex < rowsCount; rowIndex++)
    {
        var colsCount = (topSideCount + leftSideCount - 1) - Math.abs(leftSideCount - rowIndex - 1); 
        layer[rowIndex] = new Array(colsCount);
        for (var colIndex = 0; colIndex < colsCount; colIndex++)
        {
            layer[rowIndex][colIndex] = true;
        }
    }

    // console.log('createEmptyLayer:', rowsCount, colsCount, layer);

    return layer;
}

function drawBackLayer(canvas, topSideCount, leftSideCount)
{

}

function drawFrontLayer(canvas, layer)
{
    var context = canvas.getContext('2d');

    var middleRowIndex = Math.round((layer.length - 1) / 2);
    var maxNumberOfPointsHorizontal = layer[middleRowIndex].length;
    var distanceBetweenPoints = canvas.width / (maxNumberOfPointsHorizontal + 6); // 2 DBP is distance from picture to hexagon frame + 1 DBP is border

    console.log(layer.length, middleRowIndex, maxNumberOfPointsHorizontal);

    var minNumberOfPointsVertical = middleRowIndex + 1;
    var maxNumberOfPointsVertical = minNumberOfPointsVertical * 2 - 1;

    var smallPointRadius = distanceBetweenPoints * 0.1;
    var largePointRadius = distanceBetweenPoints * 0.47;

    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;

    var startPointX = centerX - (maxNumberOfPointsHorizontal - 1) * distanceBetweenPoints / 2;
    var startPointY = centerY - (maxNumberOfPointsVertical - 1) * distanceBetweenPoints * 0.866 / 2;

    for (var rowIndex = 0; rowIndex < layer.length; rowIndex++) 
    {
        for (var colIndex = 0; colIndex < layer[rowIndex].length; colIndex++) 
        {
            var x = startPointX + colIndex * distanceBetweenPoints + Math.abs(minNumberOfPointsVertical - rowIndex - 1) * distanceBetweenPoints * 0.5;
            var y = startPointY + rowIndex * distanceBetweenPoints * Math.sqrt(1 * 1 - 0.5 * 0.5); // ~0.866

            context.beginPath();

            var currentPointRadius = layer[rowIndex][colIndex] === true ? largePointRadius : smallPointRadius;

            context.arc(x, y, currentPointRadius, 0, 2 * Math.PI);
            context.fillStyle = 'green';
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = '#006600';
            context.stroke();

            context.font = '12pt Calibri';
            context.textAlign="center";
            context.fillStyle = 'white';
            context.fillText(rowIndex + ' ' + colIndex, x, y);
        }
    }
}

function main()
{
    var canvas = document.getElementById('patternCanvas');

    var topSideCount = 5;
    var leftSideCount = 3;

    var layer = createEmptyLayer(topSideCount, leftSideCount);
    drawBackLayer(canvas, topSideCount, leftSideCount);
    drawFrontLayer(canvas, layer);
    drawCanvasCenter(canvas);
}

main();

function drawCanvasCenter(canvas) {
    var context = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var size = 10;
    context.beginPath();
    context.moveTo(centerX-size, centerY);
    context.lineTo(centerX+size, centerY)
    context.moveTo(centerX, centerY-size);
    context.lineTo(centerX, centerY+size)
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.stroke();
}

//drawHexagon(context, distanceBetweenPoints * (minNumberOfPointsHorizontal), centerX, centerY)
function drawHexagon(context, size, x, y) {
    context.beginPath();
    context.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

    for (var side = 0; side <= 6; side++) {
        context.lineTo(x + size * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6));
    }

    context.fillStyle = "#333333";
    context.fill();
}
