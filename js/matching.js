var tiles = new Array(),
    flips = new Array('tb', 'bt', 'lr', 'rl' ),
    iFlippedTileId = null,
    iTileBeingFlippedId = null,
    tileAllocation = null,
    iTimer = 0,
    iInterval = 100,
    iPeekTime = 2000,
    iTakeChance = 0,    
    iLastOpened = 0,
    LEFTKEY = 37,
    UPKEY = 38,
    RIGHTKEY = 39,
    DOWNKEY = 40,
    SELECTKEY = 13,
    numRows = 5,
    numCels = 4,
    totalLeft = numRows*numCels;

function getRandomImageNumberForTile(){
    var iRandomImage = Math.floor((Math.random()* tileAllocation.length)),
        iMaxImageSize = 2;

    while(tileAllocation[iRandomImage] >= iMaxImageSize){
        iRandomImage += 1;
        if(iRandomImage >= tileAllocation.length)
            iRandomImage = 0;                
    }
    return iRandomImage;
}

function initState(){
    tileAllocation = new Array();
    for(var i =0; i < (numRows*numCels)/2; i++)
        tileAllocation.push(0);        
    while(tiles.length > 0) tiles.pop();
    $('#board').empty();
    iTimer = 0;
    iTakeChance = 0;
    $('#message').empty();
    iLastOpened = 0;
}

function createTile(iCounter){
    var curTile = new tile("tile"+iCounter),
        iRandomImage = getRandomImageNumberForTile();

    tileAllocation[iRandomImage] += 1;

    curTile.setFrontColor('tileColor'+Math.floor((Math.random()* numRows)+1));
    curTile.setStartAt(500* Math.floor((Math.random()* numRows)+1));
    curTile.setFlipMethod(flips[Math.floor(Math.random()* numCels)]);
    curTile.setBackContentImage('images/'+(iRandomImage+1)+".jpg");

    return curTile;
}

function initTiles(){
    var iCounter = 0,
        curTile = null;

    initState();
    
    for(iCounter = 0; iCounter < (tileAllocation.length*2); iCounter++){
        curTile = createTile(iCounter);
        $('#board').append(curTile.getHtml());
        tiles.push(curTile);        
    }
}

function revealTiles(callback){

    var iCounter = 0,
        bTileNotFlipped = false;

    for(iCounter = 0; iCounter < tiles.length; iCounter++) {
        
        if(tiles[iCounter].getFlipped() === false) {            
            if(iTimer > tiles[iCounter].getStartAt()) {
                tiles[iCounter].flip();
            }
            else {
                bTileNotFlipped = true;
            }
        }
    }
    
    iTimer = iTimer + iInterval;

    if(bTileNotFlipped === true) {
        setTimeout("revealTiles(" + callback + ")",iInterval);
    } else {
        callback();
    }    
}

function hideTiles(callback){
    var iCounter = 0;

    for(iCounter = 0; iCounter < tileAllocation.length * 2; iCounter++){
        tiles[iCounter].revertFlip();
    }

    callback();
}

function onPeekStart(){
    setTimeout("hideTiles(function(){onPeekComplete();})", iPeekTime);
}

function onPeekComplete(){    
    tiles[0].markSelected();    

    $('div.tile').click(function(){
        iTileBeingFlippedId = this.id.substring('tile'.length);

        if(tiles[iTileBeingFlippedId].getFlipped() === false){
            tiles[iTileBeingFlippedId].addFlipCompleteCallback(function(){checkMatch();});
            tiles[iTileBeingFlippedId].markSelected();
            tiles[iTileBeingFlippedId].flip();
        }
    });
    
}

function checkMatch(){
    if(iFlippedTileId === null)
        iFlippedTileId = iTileBeingFlippedId;
    else{
        if(tiles[iFlippedTileId].getBackContentImage() != tiles[iTileBeingFlippedId].getBackContentImage()){
            setTimeout("tiles["+iFlippedTileId+"].revertFlip()", iPeekTime);
            setTimeout("tiles["+iTileBeingFlippedId+"].revertFlip()", iPeekTime);
            iTakeChance += 1;
        }
        else{
            totalLeft -= 2;
            iTakeChance += 1;

            if(totalLeft == 0){
                $('#message').html('<h2>Congratulations</h2> You took '+ iTakeChance+' steps to complete. Want to make it better?');
                $('#start_game_button').focus();
            }
        }

        iFlippedTileId = null;
        iTileBeingFlippedId = null;
    }    
}

$(function(){
    $('#start_game_button').click(function(){
        $(this).blur();
        initTiles();
        setTimeout("revealTiles(function(){onPeekStart();})", iInterval);
    })

    $(document).on('keyup', function(event){
        var keyCode = event.keyCode;        

        if(tiles.length > 0){            
            switch(keyCode){
                case SELECTKEY:    
                    if(iTileBeingFlippedId === null) iTileBeingFlippedId = 0;  
                    
                    iLastOpened = iTileBeingFlippedId;
                    $('#tile'+iTileBeingFlippedId).click();                    
                    break;

                case RIGHTKEY: 
                    if(iTileBeingFlippedId == null)  iTileBeingFlippedId = parseInt(iLastOpened) + 1;
                    else    iTileBeingFlippedId = parseInt(iTileBeingFlippedId) + 1;
                    
                    if((iTileBeingFlippedId % numRows) == 0)    iTileBeingFlippedId = (parseInt(iTileBeingFlippedId/numRows) - 1)*numRows;
                    
                    iLastOpened = iTileBeingFlippedId;     
                    break;

                case LEFTKEY:
                    if(iTileBeingFlippedId == null || !iTileBeingFlippedId )  iTileBeingFlippedId = parseInt(iLastOpened) -1;
                    else    iTileBeingFlippedId = parseInt(iTileBeingFlippedId) - 1;

                    if((iTileBeingFlippedId + 1) % numRows ==0)    iTileBeingFlippedId = (parseInt((iTileBeingFlippedId+1)/numRows))*numRows + (numRows -1);
                    
                    iLastOpened = iTileBeingFlippedId;
                    break;

                case UPKEY:
                 if(iTileBeingFlippedId == null)  iTileBeingFlippedId = parseInt(iLastOpened) - numRows;
                    else    iTileBeingFlippedId = parseInt(iTileBeingFlippedId) - 5;

                    if(iTileBeingFlippedId < 0) iTileBeingFlippedId = tiles.length + iTileBeingFlippedId;
                    iLastOpened = iTileBeingFlippedId;
                    break;

                case DOWNKEY:
                 if(iTileBeingFlippedId == null)  iTileBeingFlippedId = parseInt(iLastOpened) + 5;
                    else    iTileBeingFlippedId = parseInt(iTileBeingFlippedId) + 5;
                    
                    if(iTileBeingFlippedId >= tiles.length) iTileBeingFlippedId =  iTileBeingFlippedId - tiles.length;
                    iLastOpened = iTileBeingFlippedId;
                    break;    

            }
            
            tiles[iLastOpened].markSelected(); 
            $('#tile'+iLastOpened).focus();            
        }
    })
    
})

