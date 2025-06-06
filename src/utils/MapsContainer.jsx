import React, { useState, useEffect } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import { Row, Col, Button, Input, Modal } from "antd"
const { Search } = Input;
function MapContainer(props) {
  console.log(props?.mapsaddress, "mapssaddresss");
  console.log(props, "propsssss");
  const { isModalOpen, handleCancel, handleOk } = props
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  console.log(searchLocation, "searchLocation");
  const [searchResults, setSearchResults] = useState([]);
  const [shownElement, setShownElement] = useState(true);

  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (initialLoad) {
      // Get the user's current location
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const initialPosition = new props.google.maps.LatLng(
              latitude,
              longitude
            );
            setMarkerPosition(initialPosition);
            setInitialLoad(false);
          },
          (error) => {
            console.error("Error getting current location:", error);
            setInitialLoad(false);
          }
        );
      } else {
        console.error("Geolocation is not available in this browser.");
        setInitialLoad(false);
      }
    }
  }, [initialLoad, props?.google?.maps.LatLng]);

  useEffect(() => {
    // Use the Google Places AutocompleteService to fetch suggestions
    const autocompleteService =
      new props.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      { input: searchLocation },
      (results, status) => {
        if (status === "OK") {
          setSearchResults(results);
        } else {
          console.error("Autocomplete error:", status);
        }
      }
    );
  }, [searchLocation, props.google.maps.places.AutocompleteService]);

  useEffect(() => {
    if (searchLocation === "") {
      setShownElement(true);
    }
  }, [searchLocation]);

  const onMapReady = (mapProps, map) => {
    setMap(map);
  };

  const onMapClick = (mapProps, map, clickEvent) => {
    const { latLng } = clickEvent;
    setMarkerPosition(latLng);
    console.log("Clicked at:", latLng.lat(), latLng.lng());
    const data = {
      lat: latLng.lat(),
      long: latLng.lng(),
    };
    props?.handleInsuredAddress(data);
  };

  const handleSearchChange = (e) => {
    const location = e.target.value;
    setSearchLocation(location);
  };

  const handleSearch = (value) => {
    console.log(value, "valuee")
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        searchLocation
      )}&key=AIzaSyAZfVPEGAfjlr_TA9ZjBN6SKZpWT2lx1HM`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK" && data.results.length > 0) {
          setSearchResults([])
          const datafromgoogleAPI = data?.results[0]
          const { lat, lng } = data.results[0].geometry.location;
          const newPosition = new props.google.maps.LatLng(lat, lng);
          setMarkerPosition(newPosition);
          map.panTo(newPosition);
          if (value === "confirmLocationButton") {
            const mapsdata = {
              lat: lat,
              long: lng,
            };
            props?.handleInsuredAddress(mapsdata, datafromgoogleAPI);
            setSearchResults([])
            setSearchLocation("")
            handleCancel()
          }
        } else {
          console.log("Location not found");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSuggestionClick = async (suggestion) => {
    const location_description = suggestion.description
    setSearchResults([])
    setSearchLocation(location_description, () => {
      setShownElement(false);
      handleSearch();
    }); 
   // Set the input field value to the suggestion/ Perform the search when a suggestion is clicked
  };

  return (
    <div>
      <Modal
        className="maps__modal__popup"
        title="Locate On Map"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={() => (
          <>
            <Button
              style={{
                backgroundColor: "#fff",
                color: "#003399",
                border: "1px solid #003399",
                borderRadius: "8px",
                width: "96px",
                height: "42px",
                padding: "10px 22px 10px 22px",
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: "#003399",
                color: "#fff",
                border: "1px solid #003399",
                boxShadow: "0px 2px 12px 0px #00339952",
                height: "42px",
                padding: "10px 22px 10px 22px",
                borderRadius: "8px",
              }}
              onClick={() => { handleSearch("confirmLocationButton") }}
            >
              Confirm Location
            </Button>
          </>
        )}
      >
        <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]} >
          <Col xl={24} xs={24} md={24} lg={24} sm={24}>
            <Search
              size="large"
              type="text"
              placeholder="Search for a location"
              onChange={handleSearchChange}
              onSearch={handleSearch}
              value={searchLocation}
              style={{ padding: "0px 12px" }}
            />
          </Col>
        </Row>
        {/* Display search suggestions */}
        <div>
          <div>
            <ul>
              {searchResults.map((result) => (
                <div
                  key={result.place_id}
                  onClick={() => handleSuggestionClick(result)}
                  style={{ cursor: "pointer" }}
                  className="mapspointer"
                >
                  {searchLocation !== "" &&
                    result.description &&
                    shownElement === true && <div>{result.description}</div>}
                </div>
              ))}
            </ul>
          </div>
        </div>

        <Map
          google={props.google}
          onReady={onMapReady}
          onClick={onMapClick}
          center={markerPosition || { lat: 0, lng: 0 }}
          zoom={14}
          // style={{ width: "95%", height: "400px",left:'12px' }}
          style={{ width: "90%", left: '12px', height: "350px" }}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </Map>

      </Modal>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAZfVPEGAfjlr_TA9ZjBN6SKZpWT2lx1HM", // Replace with your Google Maps API key
})(MapContainer);
