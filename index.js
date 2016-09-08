var fs = require('fs');
var enc = 'utf16le';
var options = { encoding: enc };

module.exports = function(filename, width, height, vguides, hguides) {  
  //Keep our struct open to fill in gaps
  var rstruct = fs.createReadStream('struct.dat', {start: 31, autoClose: true});
  var wstream = fs.createWriteStream(filename, options);
  // Write Header 
  // Signature
  wstream.write('8BPS','utf8');
  // Version
  wstream.write(fixedIntBuffer(2,1));
  // Reserved (must be 0)
  wstream.write(fixedIntBuffer(6,0));
  // Channels including alpha (Doc says 2 but sample shows 4)
  wstream.write(fixedIntBuffer(4,3));
  // Image height
  wstream.write(fixedIntBuffer(4,height));
  // Image width
  wstream.write(fixedIntBuffer(3,width)); //There's something weird about this w h number
  
  // Depth
  wstream.write(shortBuffer(8));
  // Mode
  wstream.write(shortBuffer(3));

  // Color Mode Data Section
  // Length - 0 We won't need this secion
  wstream.write(fixedIntBuffer(4,0));

  rstruct.pipe(wstream);
  // Image Resources Section
  // Generate Guide object
  var guideData = undefined;

  // TODO write guideDataSize
  //wstream.write(fixedIntBuffer(4,0));
  //
  //wstream.write('8BIM','utf8');
  // TODO See if we need these sections yet

  // Layer and Mask Information Section
  // var defaultLayer = Buffer.alloc((4*4) + 2 + (6*4) + 4 + 4 + 4 + 4);
  

  // Image Data Section


  //wstream.end();
  return true;
};

var generateGuides = function (vguides, hguides) {
  var retvalSize = 0;
  var signature = Buffer.from('8BIM',enc);
  retvalSize += signature.length;

  var id = fixedIntBuffer(2,1032); //Resource ID for grids
  retvalSize += id.length;

  var name = Buffer.alloc(1);
  retvalSize += name.length;

  var dataSize = 0;

  // Grid and guide header
  var version = fixedIntBuffer(4,1);
  retvalSize += version.size;
  dataSize += version.size;

  var gridCycleH = fixedIntBuffer(4,576);
  retvalSize += gridCycleH.length;
  dataSize += gridCycleH.length;

  var gridCycleV = fixedIntBuffer(4,576);
  retvalSize += gridCycleV.length;
  dataSize += gridCycleV.length;

  var guideCount = fixedIntBuffer(4, vguides.length + hguides.length);
  retvalSize += guideCount.length;
  dataSize += guideCount.length;

  var guideData = Buffer.alloc( 5 * vguides.length + hguides.length); 
  retvalSize += guideData.length;
  dataSize += guideData.length;

  for(var v = 0; v < vguides.length; v++) {
    guideData.writeInt16LE(vguides[v]);
    guideData.writeInt16LE(0);
  }

  for(var h = 0; h < hguides.length; h++) {
    guideData.writeInt16LE(hguides[h]);
    guideData.writeInt16LE(1);
  }

  var bDataSize = fixedIntBuffer(2,dataSize);
  retvalSize += bDataSize.length;

  var retVal = Buffer.concat(
  [
    signature,
    id,
    name,
    bDataSize,
    guideData
  ]
  ,retvalSize);

  return retVal;
}

var fixedIntBuffer = function (len, value) {
  var ret = Buffer.alloc(len);
  ret.writeInt16BE(value);
  return ret;
}
var shortBuffer = function (value) {
  var ret = Buffer.alloc(2);
  ret.writeInt8(value);
  return ret;
}
