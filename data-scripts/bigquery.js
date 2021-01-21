CREATE TEMP FUNCTION
    PARSE_TRACE(data STRING)
    RETURNS STRUCT< error STRING>
    LANGUAGE js AS """
    var abi = {"constant": true, "inputs": [], "name": "getPricePerFullShare", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"};
    var interface_instance = new ethers.utils.Interface([abi]);

    var result = {};
    try {
        var parsedTransaction = interface_instance.parseTransaction({data: data});
        var parsedArgs = parsedTransaction.args;

        if (parsedArgs && parsedArgs.length >= abi.inputs.length) {
            for (var i = 0; i < abi.inputs.length; i++) {
                var paramName = abi.inputs[i].name;
                var paramValue = parsedArgs[i];
                if (abi.inputs[i].type === 'address' && typeof paramValue === 'string') {
                    // For consistency all addresses are lowercase.
                    paramValue = paramValue.toLowerCase();
                }
                result[paramName] = paramValue;
            }
        } else {
            result['error'] = 'Parsed transaction args is empty or has too few values.';
        }
    } catch (e) {
        result['error'] = e.message;
    }

    return result;
"""
OPTIONS
  ( library=="gs://ethereum-etl-bigquery/disassemble_bytecode.js" );

WITH parsed_traces AS
(SELECT
    traces.block_timestamp AS block_timestamp
    ,traces.block_number AS block_number
    ,traces.transaction_hash AS transaction_hash
    ,traces.trace_address AS trace_address
    ,PARSE_TRACE(traces.input) AS parsed
FROM `bigquery-public-data.crypto_ethereum.traces` AS traces
WHERE to_address = '0xacd43e627e64355f1861cec6d3a6688b31a6f952'
  AND STARTS_WITH(traces.input, '0x77c7b8fc')
  )
SELECT
     block_timestamp
     ,block_number
     ,transaction_hash
     ,trace_address
     ,parsed.error AS error
     
FROM parsed_traces

#standardSQL
-- Disassemble CoinFi bytecode
create temp function disassemble_bytecode(bytecode string)
returns array<struct<name string, fee int64, pushData string>>
language js as """
 return parseCode(bytecode);
 """
options (
 library="gs://ethereum-etl-bigquery/disassemble_bytecode.js"
);
select disassemble_bytecode(bytecode) as op
from `bigquery-public-data.ethereum_blockchain.contracts`
where address = '0xacd43e627e64355f1861cec6d3a6688b31a6f952'
