import { runInNewContext } from "vm";

//Add Player
document.addEventListener("DOMContentLoaded", bindAddButton);

function bindAddButton(){
    document.getElementById('addButton').addEventListener('click', function (event) {
        var player = document.getElementById("addPlayer");           //Get access to form elements
        var req = new XMLHttpRequest();

        //Set query parameters
        // Test query
        // INSERT INTO Players(Gamertag, Weapon, Specialist, Map) 
        //VALUES('Frankie709',(SELECT id FROM Weapons WHERE Name = 'ICR-7'), (SELECT id FROM Specialists WHERE Name = 'Battery'), (SELECT id FROM Maps WHERE Name = 'Arsenal'));
        var param = "/insert?gamertag=" + player.elements.gamertag.value +
            "&weapon=" + player.elements.weapon.value +
            "&specialist=" + player.elements.specialist.value +
            "&map=" + player.elements.map.value;

        // Send Asynchronous get request
        req.open("GET", param, true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        //Add to table once it loads
        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                //Save Response
                var response = JSON.parse(req.responseText);
                var pId = response.insert;

                //Get Table to append to it
                var pTable = document.getElementById("playerTable");

                //Insert New row at the end of the table
                var newRow = pTable.insertRow(-1);

                //Add Gamertag to player
                var gamertag = document.createElement("td");
                gamertag.textContent = player.elements.gamertag.value;
                newRow.appendChild(gamertag);

                //Add weapon to player
                var weapon = document.createElement("td");
                weapon.textContent = player.elements.weapon.value;
                newRow.appendChild(weapon);

                //Add specialists to player
                var specialists = document.createElement("td");
                specialists.textContent = player.elements.specialists.value;
                newRow.appendChild(specialists);

                //Add map to player
                var map = document.createElement("td");
                map.textContent = player.elements.map.value;
                newRow.appendChild(map);

                //Add Update button to the Row, Set links to handlers to update exercise
                var update = document.createElement("td");
                var updateLink = document.createElement("a");
                updateLink.setAttribute("href","/updateTable?id="+pId);
                var updateButton = document.createElement("input");
                updateButton.setAttribute("value", "Update Player");
                updateButton.setAttribute("type", "button");
                updateLink.appendChild(updateButton);
                update.appendChild(updateLink);
                newRow.appendChild(update);

                //Add Delete Button, Set links to delete function
                var pDelete = document.createElement("td");
                var deleteButton = document.createElement("input");
                deleteButton.setAttribute("type","button");
                deleteButton.setAttribute("name", "delete");
                deleteButton.setAttribute("value","Delete Player");
                deleteButton.setAttribute('onClick', 'deleteData('+pId+')');
                var deleteHidden = document.createElement("input");
                deleteHidden.setAttribute("type", "hidden");
                deleteHidden.setAttribute("id", "delete" + pId);
                pDelete.appendChild(deleteButton);
                pDelete.appendChild(deleteHidden);
                newRow.appendChild(pDelete);

                console.log("Successful Addition.");

            } else {
                console.log("Error in network request: " + req.statusText);
            }
        })

        req.send(param);
        event.preventDefault();
    })
}