// import React, { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { selectSearchLocation } from '../../state/slices/mapSlice';

// const Maps = () => {
//   const searchLocation = useSelector(selectSearchLocation);

//   useEffect(() => {
//     if (searchLocation) {
//       // Use Google Maps API to display map
//       const map = new window.google.maps.Map(document.getElementById('map'), {
//         center: { lat: -34.397, lng: 150.644 }, // Default center
//         zoom: 8, // Default zoom
//       });

//       // Use Geocoding service to get coordinates for the searchLocation
//       const geocoder = new window.google.maps.Geocoder();
//       geocoder.geocode({ address: searchLocation }, (results, status) => {
//         if (status === 'OK') {
//           map.setCenter(results[0].geometry.location);
//           new window.google.maps.Marker({
//             map: map,
//             position: results[0].geometry.location,
//           });
//         } else {
//           alert('Geocode was not successful for the following reason: ' + status);
//         }
//       });
//     }
//   }, [searchLocation]);

//   return <div id="map" style={{ height: '400px', width: '100%' }}></div>;
// };

// export default Maps;
