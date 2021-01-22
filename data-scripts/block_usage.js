// 
// INFURA_ID= 
// ETHQL_QUERY_MAX_SIZE=1000 


const fs = require('fs');
const data = fs.readFileSync('data.json', 'utf8');

const blockGasLimit = 8000000;
const totalTransactions =  data.data.blocksRange.reduce( (totalTransactions, current) =>  totalTransactions + current.transactionCount, 0 );
const totalGasUSed = data.data.blocksRange.reduce( (totalGasUSed, current) =>  totalGasUSed + current.gasUsed, 0);
const startBlockTimestamp = data.data.blocksRange[0].timestamp;
const lastBlockTimestamp = data.data.blocksRange[ data.data.blocksRange.length -1].timestamp;
const timeBetweenFirstAndLastBlock = lastBlockTimestamp - startBlockTimestamp;
const averageBlockTime = (lastBlockTimestamp - startBlockTimestamp)/1000;

console.log("Block Gas Limit", blockGasLimit);
console.log("Current Block Time in secconds : ", averageBlockTime);
console.log("Blocks count : ", data.data.blocksRange.length);
console.log("TotalTransactions : ", totalTransactions);
console.log("TotalGasUsed : ", totalGasUSed );

const averageGasused = totalGasUSed / totalTransactions;
console.log('Average Gas Used Per Transaction : ', averageGasused);

const maxBlockCapacity  = blockGasLimit/averageGasused;
console.log("Max Block Capacity :  ", maxBlockCapacity );

console.log("Max Transactions Per seccons : ",  maxBlockCapacity / averageBlockTime ); // 12 sec average block Time 
