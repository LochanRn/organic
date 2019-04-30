// const createCsvWriter = require('csv-writer').createArrayCsvWriter;
// const csvWriter = createCsvWriter({
//     header: ['NAME', 'LANGUAGE'],
//     path: './data/data1.csv'
// });
 
// const records = [
//     ['Bob',  'French, English'],
//     ['Mary', 'English']
// ];
 
// csvWriter.writeRecords(records)       // returns a promise
//     .then(() => {
//         console.log('...Done');
//     });

var fs = require('fs');
var csvWriter = require('csv-write-stream')

var writer = csvWriter({ headers: ['CO2','CH4','C3H8','NG']});
writer.pipe(fs.createWriteStream('./data/data2.csv', {flags: 'a'}));
writer.write([4,2,3,10]);
writer.write([4,2,3,9]);
writer.end()