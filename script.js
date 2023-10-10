function initialize() {
      document.getElementById("geocode-button").addEventListener('click', function() {
          searchAddress();
      });
      var latLngRoma = new google.maps.LatLng(41.8905198, 12.4942486);
      var opzioni = {
          center: latLngRoma,
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map"), opzioni);
      var marker = new google.maps.Marker({position: latLngRoma, map: map, title: "Roma" });
}
   
var searchAddress = function() {
    var address = document.getElementById("address").value;
    var geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow;
    geocoder.geocode( {'address': address}, function(results,status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var options = {
                zoom: 22,
                center: results[0].geometry.location,
                mapTypeId: 'satellite',
                tilt:0,
                rotateControl:false,
                streetViewControl:false,
            };
            var map = new google.maps.Map(document.getElementById('map'), options);
            document.getElementById("map").style.display='block';
            document.getElementById("result").innerHTML="";
            var marker = new google.maps.Marker({position: results[0].geometry.location, map: map});
            infowindow.setContent(results[0].formatted_address);
            infowindow.open(map, marker);
            var poly = new google.maps.Polygon({
                strokeColor: "#000000",
                strokeOpacity: 1.0,
                strokeWeight: 3,
                editable: true,
                fillColor: '#FF0000',
                fillOpacity: 0.2,
            });
            poly.setMap(map);
            // Add a listener for the click event
            
            map.addListener("click", addLatLng);
            // Handles click events on a map, and adds a new point to the Polyline.
            function addLatLng(event = MapMouseEvent) {
                const path = poly.getPath();
                // Because path is an MVCArray, we can simply append a new coordinate
                // and it will automatically appear.
                document.getElementById("result").innerHTML="";
                path.push(event.latLng);
                console.log(path);
            }
            // delete vertex
            poly.addListener('click', function(event){
              if(event.path != null && event.vertex != null){
                var path = this.getPaths().getAt(event.path);
                if(path.getLength() > 3){
                  path.removeAt(event.vertex);
                  document.getElementById("result").innerHTML="";
                }
              }
            });

            // confirm area
            document.getElementById("area").style.display="block";
            document.getElementById("area").addEventListener('click', function() {
              area = google.maps.geometry.spherical.computeArea(poly.getPath());
              console.log(area);
              document.getElementById("result").style.display="block";
              document.getElementById("result").innerHTML=area.toFixed(2);
            });
        }else{
            alert("Error, address not found: " + status);
        }
    });
}
