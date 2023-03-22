function initMap() {
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 0.0, lng: -78.65 },
  });

  directionsRenderer.setMap(map);
  document.getElementById("submit").addEventListener("click", () => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });

  document.getElementById("directions-errores").innerHTM = "";
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {

  var waypts = [];
  const checkboxArray = document.getElementById("waypoints");
  var origen = "";
  var ruta = "";
  var titulo = true;
  //Spliteo el texarea para leer linea por linea
  var lines = document.getElementById("waypoints").value.split('\n');
  var cantRutas = 0;
    for(var i = 0;i < lines.length;i++){     // Si es o no header
      if(!lines[i].startsWith("CÓDIGO")) {

        //Spliteo la linea para separar las columnas (tabulador)
        var line = lines[i].split('\u0009');
        
        //console.log(line);
        
        //Spliteo las coordenadas
        var coor = line[3].split(',');        
        origen = line[33];
        ruta = line[15];
        var lat = coor[0]+"."+coor[1];
        var lon = coor[2]+"."+coor[3];
        //console.log(i+" Ruta= " + ruta + " - auxRuta = " + auxRuta);
        if(ruta != auxRuta && i > 1){    
          cantRutas++;      
          //document.getElementById("directions-cantrutas").innerHTML = "<h4><span class='label label-info'>Rutas Procesadas: " +  cantRutas + "</span><br><br>";
          cargarRuta2(origen,auxRuta, waypts,directionsService,directionsRenderer,titulo);
          var waypts = [];
          if(titulo) titulo = false;
        }
        

        var auxRuta = line[15];



        //Agrego las coordenadas al array
        waypts.push(
          {      
          location: new google.maps.LatLng(coor[0]+"."+coor[1],coor[2]+"."+coor[3]),
          stopover: true
        });
      
      
      }          
    }
    cargarRuta2(origen,auxRuta, waypts,directionsService,directionsRenderer);


}


function cargarRuta2(origen, ruta, waypts, directionsService,directionsRenderer,titulo){
  //console.log("cargarRuta2");
          //CARGGO RUTA
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
            //console.log("RESPONSE = " +  JSON.stringify(response));
            const route = response.routes[0];
            
            const summaryPanel = document.getElementById("directions-panel");
            const summaryDistancias = document.getElementById("directions-distancias");
            const summaryErrores = document.getElementById("directions-errores");

            var htmlPanel = ""
            if(titulo || !titulo){
              htmlPanel = "<table style='width:100%;' class='table'> <thead><tr><th scope='col'>Cod Ruta</th><th scope='col'>Origen</th><th scope='col'>Km Total</th><th scope='col'>Tiempo Total (Horas)</th><th scope='col'>Ult. Punto </th><th scope='col'>Recorrido </th></tr></thead><tbody><tr>";
            }else{
              htmlPanel = "<table class='table'> <thead></thead><tbody><tr>";
            }

            // For each route, display summary information.
            var distanciaTotal = 0;
            var duracionTotal = 0;
            var puntos = "<ol>";
            //console.log(route.legs);
            for (let i = 0; i < route.legs.length; i++) {
              const routeSegment = i + 1;                 

              if(i == route.legs.length - 2){
                  var ultimo_punto = route.legs[i].end_address.split(',');
                  //var altitud = getAltitude(lat, lng);
              }
              if(i < route.legs.length - 1){
                var punto_hasta = route.legs[i].end_address.split(',');

                //console.log(route.legs[i]);

                distanciaTotal += route.legs[i].distance.value;
                duracionTotal += route.legs[i].duration.value;   
                var punto = route.legs[i].start_address.split(',');
                puntos +=  "<li>  " + punto_hasta[1] + ", " +punto_hasta[2] + " (" + route.legs[i].distance.text + ")"   ;
              }
            }
            puntos +="</ol>";

            distanciaTotal = distanciaTotal / 1000; // convierto a km
            duracionTotal = duracionTotal / 60 / 60; // convierto a horas

            htmlPanel += "<td scope='row'>"+ ruta +"</td>";
            htmlPanel += "<td scope='row'>"+ origen + "</td>";
            htmlPanel += "<td scope='row'>" + distanciaTotal.toFixed(2) +  "</td>";
            htmlPanel += "<td scope='row'>" + duracionTotal.toFixed(2) + "</td>";
            htmlPanel += "<td scope='row'>" + ultimo_punto[1] + "</td>";
            htmlPanel += "<td scope='row'>" + puntos + "</td>";

            htmlPanel += "</tr></tbody></table>"

            summaryPanel.innerHTML += htmlPanel;

          // summaryPanel.innerHTML += "</tr></tbody></table>";
            
            summaryDistancias.innerHTML = "";
            summaryDistancias.innerHTML += "<h4><span class='label label-warning'>Ruta Distancia Recorrida: " +  distanciaTotal.toFixed(2) + " km</span><br><br>";
            summaryDistancias.innerHTML += "<h4><span class='label label-warning'>Ruta Duración: " +  duracionTotal.toFixed(2) + " horas</span> <br><br>";
          })
          .catch((e) => document.getElementById("directions-errores").innerHTML += "<li>La solicitud Directions ha fallado " + e + "- Ruta " + ruta);
          //console.log("La solicitud Directions ha fallado " + e + "- Ruta " + ruta));
          waypts = [];
        //FIN CARGO RUTA
}


window.initMap = initMap;