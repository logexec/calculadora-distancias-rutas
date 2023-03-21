function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 0.0, lng: -78.65 },
  });

  directionsRenderer.setMap(map);
  document.getElementById("submit").addEventListener("click", () => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {

  var waypts = [];
  const checkboxArray = document.getElementById("waypoints");
  var origen = "";
  //Spliteo el texarea para leer linea por linea
  var lines = document.getElementById("waypoints").value.split('\n');
    
    for(var i = 0;i < lines.length;i++){     // Si es o no header
      if(!lines[i].startsWith("CÓDIGO")) {
        
        //Spliteo la linea para separar las columnas (tabulador)
        var line = lines[i].split('\u0009');   

        //Spliteo las coordenadas
        var coor = line[3].split(',');
        
        origen = line[33];        

        //Agrego las coordenadas al array
        waypts.push(
          {      
          location: new google.maps.LatLng(coor[0]+"."+coor[1],coor[2]+"."+coor[3]),
          stopover: true
        });
      }

    }
 /*
  var waypts = [];
  
  const checkboxArray = document.getElementById("waypoints");
 
  for (let i = 0; i < checkboxArray.length; i++) {
  
    if (checkboxArray.options[i].selected) {
      var coor = checkboxArray.options[i].value.split(',');
      alert(coor[1]);
      
      waypts.push(
        {      
        location: new google.maps.LatLng(coor[0],coor[1]),
        stopover: true
      });
    }
  }  
  */

 //alert(JSON.stringify(waypts));
  directionsService
    .route({
      origin: origen+",Ecuador",//document.getElementById("start").value,
      destination: origen+",Ecuador",//document.getElementById("end").value,
      waypoints: waypts,
      /*[{
        location:new google.maps.LatLng(-0.184255846752235,-78.4785660822308),
      stopover:false}],     */
      optimizeWaypoints: true,
      provideRouteAlternatives: true,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);

      const route = response.routes[0];
      const summaryPanel = document.getElementById("directions-panel");
      const summaryDistancias = document.getElementById("directions-distancias");

      summaryPanel.innerHTML = "<br><br>";

      // For each route, display summary information.
      var distanciaTotal = 0;
      var duracionTotal = 0;
      //console.log(route.legs);
      for (let i = 0; i < route.legs.length; i++) {
        const routeSegment = i + 1;

        summaryPanel.innerHTML +=
          "<b>Segmento de Ruta N°: " + routeSegment + "</b><br>";
        summaryPanel.innerHTML += route.legs[i].start_address + " hacia ";
        summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
        summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
        
        distanciaTotal += route.legs[i].distance.value;
        duracionTotal += route.legs[i].duration.value;        
      }
      distanciaTotal = distanciaTotal / 1000; // convierto a km
      duracionTotal = duracionTotal / 60 / 60; // convierto a horas

      summaryDistancias.innerHTML += "<h4><span class='label label-warning'>Ruta Distancia Recorrida: " +  distanciaTotal.toFixed(2) + " km</span><br><br>";
      summaryDistancias.innerHTML += "<h4><span class='label label-warning'>Ruta Duración: " +  duracionTotal.toFixed(2) + " horas</span> <br><br>";
    })
    .catch((e) => window.alert("La solicitud Directions ha fallado " + status));
}

window.initMap = initMap;