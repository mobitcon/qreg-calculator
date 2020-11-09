'use strict';

                   
var cards;                    

function generateTable(){    
    var generalTable = document.getElementById('parityTable');    
    var card1Table1 = document.getElementById('card1table1');
    var card1Table2 = document.getElementById('card1table2');
    var card2Table1 = document.getElementById('card2table1');
    var card2Table2 = document.getElementById('card2table2');
    var card3Table1 = document.getElementById('card3table1');
    var card3Table2 = document.getElementById('card3table2');

    cards = [[card1Table1, card1Table2], [card2Table1, card2Table2], [card3Table1, card3Table2] ]
    var numberOfRows = 12;
    if(document.getElementById('twentyfour').checked)
    {
        numberOfRows = 24;
    }    
    deleteRows(generalTable, 1);
    for (let index = 0; index < numberOfRows; index++) {
        var row = generalTable.insertRow();
        row.id = index;
        row.insertCell(0).innerHTML ="<input id=\"inputValueBox\" onchange=\"calcRow(this)\"/>";
        for(let j =1; j<5; j++)
        {
            row.insertCell(1);
        }      
    }
    //card table
    cards.forEach(card => {
        card.forEach(table => {
            deleteRows(table);
            for (let index = 0; index < 12; index++) {

                var cardRow = table.insertRow();
                for (let index = 0; index < 9; index++) {
                    var cell =cardRow.insertCell(index);
                    if(index == 6)
                    {                
                        cell.classList.add('cellEmpty')
                    }
                    else
                    {
                        cell.classList.add('cellOpen')
                    }
                } 
            }
        });
    });
}

function deleteRows(table, min =0)
{
    while(table.rows.length > 0+ min)
    {
        table.deleteRow(-1);
    }
}

function calcRow(elem)
{
    var row = elem.closest('tr');  
    var Input = elem.value;
    doCalculation(Input, row);
}
function doCalculation(Input, row)
{
    document.getElementById('ERROR').style.visibility = "hidden";
    if(Input >2048 || Input <1)
    {
        document.getElementById('ERROR').style.visibility = "visible";
        setValuesAndInsertRow(Input, undefined,undefined,undefined, row);         
        return;
    }
    //Input is between 1 and 12 bit -> shift the first 6 bits to get the first value
    var first = Input >>> 6;
    //mask the last 6 bits to get second value
    var second = Input & 63;
    var xor = first^second;    
    setValuesAndInsertRow(first, second, xor, row); 
}
//number 1, number 2, parity
//number 1, parity, number 2
//parity, number 1, number 2
const parityOrder = [[0,1,2],
                    [0,2,1],
                    [1,2,0]];   

function setValuesAndInsertRow(first, second, xor, row)
{  
    var rowId = row.id;
    var currentOrder = parityOrder[rowId%3];    
    var bitFirst = dec2bin(first,6);
    var bitSecond =  dec2bin(second,6);
    var bitXor = dec2bin(xor,6);
    insertInputBits(1, bitFirst, bitSecond, row, 'transparent');
    insertCellAndSetValue(2+ currentOrder[0], bitFirst, row, '#404040');
    insertCellAndSetValue(2+ currentOrder[1], bitSecond, row, '#808080');
    insertCellAndSetValue(2+ currentOrder[2], bitXor, row, '#transparent');

    //display stuff on cards
    setRowTable(rowId, bitFirst, currentOrder[0], '01')
    setRowTable(rowId, bitSecond, currentOrder[1], '10')
    setRowTable(rowId, bitXor, currentOrder[2], '00')
}

function setRowTable(rowIndex, bits, order, type){
    var tableIndex = 0;
    if(rowIndex > 12){
        tableIndex =1;
        rowIndex = rowIndex -12;
    }

    var row = cards[order][tableIndex].rows[rowIndex%12]; 
    while(row.cells.length > 0)
    {
        row.deleteCell(0)
    }
    //insert the bits
    for (let i = 0; i < bits.length; i++) {    
       addCellAndSetClass(row, i, bits[i]);
    }
    //insert empty
    row.insertCell(6).classList.add('cellEmpty');
    //insert bits type
    addCellAndSetClass(row, 7, type[0]);
    addCellAndSetClass(row, 8, type[1]); 
}

function addCellAndSetClass(row, i, currentChar ){
    var cell =row.insertCell(i);    
    if(currentChar == 0)
    {                
        cell.classList.add('cellOpen')
    }
    else
    {
        cell.classList.add('cellClose')
    }
}

function insertCellAndSetValue(cellIndex, valueSecond, row, backgroundColor)
{
    row.cells[cellIndex].innerHTML = valueSecond;
    row.cells[cellIndex].style.backgroundColor = backgroundColor;
}

function insertInputBits(cellIndex, firstValue, secondValue, row, backgroundColor)
{
    row.cells[cellIndex].innerHTML = firstValue +" " + secondValue;
    row.cells[cellIndex].style.backgroundColor = backgroundColor;   
}


function dec2bin(dec, totalBits){
    var rawBit =(dec >>> 0).toString(2);    
    return pad(rawBit, totalBits)
}

function pad(value, length) {
    return (value.toString().length < length) ? pad("0"+value, length):value;
}


