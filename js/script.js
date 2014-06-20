$(document).ready(function () {

    var str = "";
    //declare the number of blocks of the game
    var blocks = 50;
    //declare the number of mines in the game
    var numberOfMines = 10;
    //no. of blocks per row
    var numberOfBlocksPerRow = 5;
    //deduce the number of rows
    var numberOfRows = Math.ceil(blocks / numberOfBlocksPerRow);
    //The array which stores the locations of the mine
    var mineMap = [];
    var playerMineMap = [];
    var init = function () {
        str="";mineMap=[];playerMineMap=[];
        $(".toggleSlider").removeClass("flag").addClass("mine");
        $("#minesFlaggedCount").html(numberOfMines-playerMineMap.length);
        for (var i = 0; i < numberOfRows; i++) {
            str += '<div class="tray clear">';
            for (var j = 1; j <= numberOfBlocksPerRow; j++) {
                if (((i * numberOfBlocksPerRow) + j) <= blocks) {
                    str += '<p location=' + ((i * numberOfBlocksPerRow) + j) + ' class="tile left active"></p>';
                }

            }
            str += '</div>';
        }
        $("#colosseum").html(str+"<div class='clear'></div>");
        setMines();
    }



    var setMines = function () {

       /*place the mine randomly in tiles*/
        while (mineMap.length<numberOfMines) {
            var randomnumber = (Math.ceil(Math.random() * blocks));
            var found = false;
            for (var j = 0; j < mineMap.length; j++) {
                if (mineMap[j] == randomnumber) {
                    found = true;
                    break
                }
            }
            if (!found) {
                mineMap.push(randomnumber);
                
            }
        }



    }

    var checkForMines = function(tileSiblings) {
            /*check for mines in the sibling tiles*/
            var mineCount = 0;
       
            for(var tile in tileSiblings)
            {
                var tileLocation = parseInt(tileSiblings[tile].attr("location"));
                var matchedMineLocation = mineMap.indexOf(tileLocation);
                if(matchedMineLocation!==-1)
                {   
                    mineCount++;
                    $(this).html(mineCount);
                     
                }
                   
            }

            if(!mineCount){
                /*if no mines found then make the tiles inactive*/
                 for(var tile in tileSiblings)
                 {
                     if(tileSiblings[tile].length)
                     {
                        //tileSiblings[tile].html(0)
                        tileSiblings[tile].removeClass("active").addClass("inactive");
                       
                           /*call the function recursively*/
                        if(tile !== "currentTile")
                        {
                            findMines.call(tileSiblings[tile]);
                        }
                        
                     }
      
                 }
          
            }
           
            }

   
    var mapSiblingTiles = function (location,currentTray,topTray,bottomTray)
    {
        /*get the sibling tiles of the tile clicked currently*/
        var tileSiblings = {};
        if(topTray.length)
        {
            tileSiblings.topLefttile = topTray.find(".active[location="+(parseInt(location)-parseInt(numberOfBlocksPerRow)-1)+"]");
            tileSiblings.topCentretile = topTray.find(".active[location="+(parseInt(location)-parseInt(numberOfBlocksPerRow))+"]");
            tileSiblings.topRighttile = topTray.find(".active[location="+(parseInt(location)-parseInt(numberOfBlocksPerRow)+1)+"]");

        }
            tileSiblings.centreLefttile = currentTray.find(".active[location="+(parseInt(location)-1)+"]");
            tileSiblings.currentTile = currentTray.find(".active[location="+(parseInt(location))+"]");
            tileSiblings.centreRighttile = currentTray.find(".active[location="+(parseInt(location)+1)+"]");

        if(bottomTray.length)
        {
            tileSiblings.bottomLefttile = bottomTray.find(".active[location="+(parseInt(location)+parseInt(numberOfBlocksPerRow)-1)+"]");
            tileSiblings.bottomCentretile = bottomTray.find(".active[location="+(parseInt(location)+parseInt(numberOfBlocksPerRow))+"]");
            tileSiblings.bottomRighttile = bottomTray.find(".active[location="+(parseInt(location)+parseInt(numberOfBlocksPerRow+1))+"]");
        }
       /*check for mines in the sibling tiles*/
      checkForMines.call(this,tileSiblings);

    }

    var findMines = function()
    {
      
            /*check if te player has clicked on mine*/
            if(mineMap.indexOf(parseInt($(this).attr("location"))) === -1 )
            {
                var location = $(this).attr("location");
                var currentTray = $(this).closest(".tray");
                var topTray = currentTray.prev(".tray");
                var bottomTray = currentTray.next(".tray");
                mapSiblingTiles.call(this,location,currentTray,topTray,bottomTray,this);
            }
            else
            {
                $(this).addClass("mine");
                alert("gameover");
                init();
            }
      
             
    };
    var allMinesIdentified = function()
    {
        playerMineMap.push(parseInt($(this).attr("location")));
         $("#minesFlaggedCount").html(numberOfMines-playerMineMap.length);
        if($(playerMineMap).not(mineMap).length == 0 && $(mineMap).not(playerMineMap).length == 0)
        {
            alert("You Win");
            init();
        }
    };
    var flagMine = function()
    {
        $(this).toggleClass("flag");
        allMinesIdentified.call(this);

    }
    var checkMode = function()
    {

        if($(".toggleSlider").hasClass("mine"))
        {
            findMines.call(this);
        }
        else
        {
            flagMine.call(this);
        }
    };

    var setMode = function()
    {
       $(this).toggleClass("mine flag");
    }
    /*Event handler for user's click on the tile*/
    $("#colosseum").on("click",".tile.active",checkMode);
    $("#mode").on("click",setMode);
    $(".toggleSlider").on("click",function(){
        if($(this).hasClass("mine")){

            $(this).animate({"left":"52px"});
        }
        else
        {
            $(this).animate({"left":"0"});
        
        }
         $(this).toggleClass("mine flag");
       setMode(); 
    });
    init();
    
});