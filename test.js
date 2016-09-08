var psdFormat = require('./index');

var result = psdFormat('test.psd',600,600,[100,200,300],[100,200,300]);
if (result) {
  console.log('PSD File Write was successful.');
} else {
  console.log('PSD File Write failed.');
}
