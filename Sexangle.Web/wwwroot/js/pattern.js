"use strict";

// layer = { map : array[][], style : {}}

// filled in some initialization method after changing pointsCount on UI
// drawing could contain some related methods, and even moved into separate class
var global = {
    //canvas, context,

    // points count
    topSideCount, leftSideCount,  // todo: why it should not be initialized ?

    // size
    distanceBetweenPoints: 0, largePointRadius: 0,

    // position
    startPointX: 0, startPointY: 0,

    pattern: [,],
    patternCoordinates: [,],
};

function createEmptyPattern()
{
    var topSideCount = global.topSideCount;
    var leftSideCount = global.leftSideCount;
    var rowsCount = leftSideCount * 2 - 1;
    var pattern = new Array(rowsCount);
    for (var rowIndex = 0; rowIndex < rowsCount; rowIndex++)
    {
        var colsCount = (topSideCount + leftSideCount - 1) - Math.abs(leftSideCount - rowIndex - 1); 
        pattern[rowIndex] = new Array(colsCount);
        for (var colIndex = 0; colIndex < colsCount; colIndex++)
        {
            pattern[rowIndex][colIndex] = true;
        }
    }

    // console.log('createEmptyLayer:', rowsCount, colsCount, layer);

    return pattern;
}

function drawBackLayer(canvas, topSideCount, leftSideCount)
{

}

function drawFrontLayer(canvas, layer)
{
    var context = canvas.getContext('2d');

    var middleRowIndex = Math.round((layer.length - 1) / 2);
    var maxNumberOfPointsHorizontal = layer[middleRowIndex].length;
    var distanceBetweenPoints = canvas.width / (maxNumberOfPointsHorizontal + 2 /*6*/); // 2 DBP is distance from picture to hexagon frame + 1 DBP is border
    global.distanceBetweenPoints = distanceBetweenPoints;

    //console.log('drawFrontLayer:', layer.length, middleRowIndex, maxNumberOfPointsHorizontal);

    var minNumberOfPointsVertical = middleRowIndex + 1;
    var maxNumberOfPointsVertical = minNumberOfPointsVertical * 2 - 1;

    var smallPointRadius = distanceBetweenPoints * 0.1;
    var largePointRadius = distanceBetweenPoints * 0.47;

    global.largePointRadius = largePointRadius;

    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;

    var startPointX = centerX - (maxNumberOfPointsHorizontal - 1) * distanceBetweenPoints / 2;
    var startPointY = centerY - (maxNumberOfPointsVertical - 1) * distanceBetweenPoints * 0.866 / 2;

    global.startPointX = startPointX;
    global.startPointY = startPointY;

    for (var rowIndex = 0; rowIndex < layer.length; rowIndex++) 
    {
        for (var colIndex = 0; colIndex < layer[rowIndex].length; colIndex++) 
        {
            var x = startPointX + colIndex * distanceBetweenPoints + Math.abs(minNumberOfPointsVertical - rowIndex - 1) * distanceBetweenPoints * 0.5;
            var y = startPointY + rowIndex * distanceBetweenPoints * Math.sqrt(1 * 1 - 0.5 * 0.5); // ~0.866

            global.patternCoordinates[rowIndex][colIndex] = { x, y};

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

function getCellByCoordinates(x, y)
{
    var patternCoordinates = global.patternCoordinates;
    var largePointRadius = global.largePointRadius;
    for (var rowIndex = 0; rowIndex < patternCoordinates.length; rowIndex++) 
    {
        for (var colIndex = 0; colIndex < patternCoordinates[rowIndex].length; colIndex++) 
        {
            var cell = patternCoordinates[rowIndex][colIndex]
            if (Math.pow(x-cell.x, 2) + Math.pow(y-cell.y, 2) < Math.pow(largePointRadius, 2))   
            {
                return { rowIndex, colIndex }
            }
        }
    }

    return null;
}

function getCellByCoordinatesObsolete(x, y)
{
    var startPointX = global.startPointX;
    var startPointY = global.startPointY;
    var distanceBetweenPoints = global.distanceBetweenPoints;
    var leftSideCount = global.leftSideCount;

    var rowIndexDecimal = (y - startPointY) / distanceBetweenPoints;
    var colIndexDecimal = (x - startPointX) / distanceBetweenPoints - Math.abs(leftSideCount - rowIndexDecimal - 1) / 2;

    var rowIndex = Math.floor(rowIndexDecimal);
    var colIndex = Math.floor(colIndexDecimal);

    var isValidRow = 0 <= rowIndex && true; //rowIndex < maxVerticalNumberOfPoints;
    var isValidCol = 0 <= colIndex && true; // how to determine max value?

    var isValid = isValidRow && isValidCol;

    console.log(rowIndex, colIndex, isValidRow, isValidCol, rowIndexDecimal, colIndexDecimal);

    return { rowIndex, colIndex, isValid };
}

function getRelativeCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    return {x, y}
}

var previousX = 0;
var previousY = 0;

function canvasOnMouseMove(e)
{
    // console.log(e.pageY, e.clientY, e.screenY);

    var coordinates = getRelativeCursorPosition(global.canvas, e);
    
    var x = coordinates.x;
    var y = coordinates.y;
    if (Math.sqrt(Math.pow(previousX - x, 2) + Math.pow(previousY - y, 2)) <= 20)
    {
        return;
    }
    previousX = x;
    previousY = y;

    var cell = getCellByCoordinates(x, y);

    if (cell != null)
    {
        var context = global.context;

        context.beginPath();
        context.font = '6pt Arial';
        context.textAlign="center";
        context.fillStyle = 'black';
        context.fillText(cell.rowIndex + ' ' + cell.colIndex, x, y);

        // global.pattern[cell.rowIndex][cell.colIndex] = !global.pattern[cell.rowIndex][cell.colIndex];
    }
}

function canvasOnClick(e)
{
    // console.log(e.pageY, e.clientY, e.screenY);

    var coordinates = getRelativeCursorPosition(global.canvas, e);
    
    var x = coordinates.x;
    var y = coordinates.y;
    var cell = getCellByCoordinates(x, y);

    if (cell != null)
    {
        var context = global.context;

        context.beginPath();
        context.font = '6pt Arial';
        context.textAlign="center";
        context.fillStyle = 'black';
        context.fillText(cell.rowIndex + ' ' + cell.colIndex, x, y);

        // global.pattern[cell.rowIndex][cell.colIndex] = !global.pattern[cell.rowIndex][cell.colIndex];
    }
}

function main()
{
    var canvas = document.getElementById('patternCanvas');
    var context = canvas.getContext('2d');

    global.canvas = canvas;
    global.context = context;

    global.topSideCount = 3;
    global.leftSideCount = 2;

    var pattern = createEmptyPattern();
    global.pattern = pattern;
    global.patternCoordinates = createEmptyPattern();
    drawBackLayer(canvas, topSideCount, leftSideCount);
    drawFrontLayer(canvas, pattern);
    drawCanvasCenter(canvas);

    // canvas.addEventListener('mousemove', canvasOnMouseMove);
    // canvas.addEventListener('click', canvasOnClick);

    canvas.addEventListener("mousedown", function(e){
        // mouseDownFunction(e); 
    
        canvas.onmousemove = function(e) {
            canvasOnMouseMove(e);
         }
    });
    
    canvas.addEventListener("mouseup", function(e){
        canvas.onmousemove = null
    });
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
