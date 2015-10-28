/*
AEParser
	Convert After Effects tracking points to JSON
	by @SuperIRis
	V 0.1
	05.03.13

	Updated
	by @iAN
	V 1.0
	10.25.2015
	Changes:
		1. New Format to support AE CC.
		2. Filter out empty value from var parserResult.
		3. Add support for Audio Amplitude data.

*/
var AEParser = function(){
	var aeData		= {},
		aeKeys		= {
			"Units Per Second" : 			"framesPerSecond",
			"Source Width" : 				"sourceWidth",
			"Source Height" : 				"sourceHeight",
			"Source Pixel Aspect Ratio" : 	"sourcePixelAspectRatio",
			"Comp Pixel Aspect Ratio" : 	"compPixelAspectRatio",
			// 
			"Position":"position",
			"Scale":"scale",
			"Rotation":"rotation",
			"Frame":"frame",
			"X":"x",
			"Y":"y"
		},
		parseBlock	= function(block){
			var blockItems;
			var finalObject = {};
			// 0 is title, 1 is subtitle (Frame, X, Y, Z)
			switch (block[0]){
					case "Transform	Position":
						blockItems = ["frame", "x", "y", "z"];
						finalObject.name = aeKeys["Position"];
						break;
					case "Transform	Scale":
						blockItems = ["frame", "xScale", "yScale", "zScale"];
						finalObject.name=aeKeys["Scale"];
						break;
					case "Transform	Rotation":
						blockItems = ["frame", "degrees"];
						finalObject.name = aeKeys["Rotation"];
						break;
					// Use on After Effects Audio Amplitude Both Channel
					case "Effects	Slider Control #3	Slider #2":
						blockItems = ["frame", "value"];
						finalObject.name = aeKeys["Audio Amplitude"];
						break;
					default:
						return null;
					}
			var itemData;
			var itemDataAe=[];
			for (var j=2; j<block.length; j++){
				itemData = block[j].replace(/	|\n/g, " ").replace(" ", "").split(" ");

				for (var ji=0; ji<itemData.length; ji+=4){

					itemDataAe[itemDataAe.length] = {};
					for (var jii = 0; jii<blockItems.length; jii++){

						itemDataAe[itemDataAe.length-1][blockItems[jii]] = itemData[ji+jii];
						// console.log( '-- : ' + itemData[ji+jii] );
						// console.log('-- !! --');
					}
				}
			}

			finalObject.items = itemDataAe;
			// console.log( 'itemDataAe : ' + JSON.stringify(itemDataAe) );
			return finalObject;
		};

	return{
		parse:function(parseText){
			var parseDatas = parseText.split("\n\n");
			var generalData = parseDatas[1].split("	");
			for (var i=1; i<generalData.length; i+=2){
				if(aeKeys[generalData[i]]){
					aeData[aeKeys[generalData[i]]] = generalData[i+1].replace(/\n/g, "");
				}
			}
			aeData.data = [];
			var parserResult;
			for(var j=2; j<parseDatas.length; j++){
				parserResult=parseBlock(parseDatas[j].split("\n"));

				if(parserResult){

					// console.log(parserResult.items);
					// 測試是否有空值 ex: {"frame":""} 這種就移除
					var newItems = [];
					for(var ji = 0; ji < parserResult.items.length; ji++){

						var obj = parserResult.items[ji];
						if(obj.frame != 'undefiend' && obj.frame != ''){
							newItems.push(obj);
						}
					}
					parserResult.items = newItems;
					// console.log( 'parserResult : ' + JSON.stringify(parserResult) );
					aeData.data.push(parserResult);
				}
			}
			return aeData;
		}
	};
}();