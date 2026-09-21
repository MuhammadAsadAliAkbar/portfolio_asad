import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import {
  Search,
  MapPin,
  Navigation,
  Plus,
  Minus,
  Maximize2,
  LocateFixed,
  X,
  Crosshair,
  MapPinned,
  Map,
  Compass,
  Loader2,
} from "lucide-react";

import "leaflet/dist/leaflet.css";
import "../css/GoogleMapPremium.css";


/* =========================================================
   KARACHI MAP CONFIG
========================================================= */

const DEFAULT_CENTER = [
  24.8607,
  67.0011,
];

const DEFAULT_ADDRESS =
  "Karachi, Pakistan";


/*
  Karachi map boundary

  South-West:
  24.70, 66.75

  North-East:
  25.15, 67.35
*/

const KARACHI_BOUNDS = [
  [24.70, 66.75],
  [25.15, 67.35],
];


/* =========================================================
   SELECTED LOCATION MARKER
========================================================= */

const markerIcon = L.divIcon({
  className:
    "premium-selected-marker",

  html: `
    <div class="selected-marker-wrapper">

      <div class="selected-marker-shadow"></div>

      <div class="selected-marker-pin">

        <div class="selected-marker-dot"></div>

      </div>

    </div>
  `,

  iconSize: [
    46,
    58,
  ],

  iconAnchor: [
    23,
    54,
  ],

  popupAnchor: [
    0,
    -48,
  ],
});


/* =========================================================
   CURRENT LOCATION MARKER
========================================================= */

const currentLocationIcon =
  L.divIcon({
    className:
      "premium-current-marker",

    html: `
      <div class="gps-marker-wrapper">

        <div class="gps-marker-pulse gps-pulse-one"></div>

        <div class="gps-marker-pulse gps-pulse-two"></div>

        <div class="gps-marker-ring">

          <div class="gps-marker-core">

            <div class="gps-marker-dot"></div>

          </div>

        </div>

      </div>
    `,

    iconSize: [
      64,
      64,
    ],

    iconAnchor: [
      32,
      32,
    ],

    popupAnchor: [
      0,
      -32,
    ],
  });


/* =========================================================
   MAP CONTROLLER
========================================================= */

function MapController({
  center,
  zoom,
  mapRef,
}) {
  const map = useMap();


  /* =======================================================
     STORE MAP INSTANCE
  ======================================================= */

  useEffect(() => {
    mapRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [
    map,
    mapRef,
  ]);


  /* =======================================================
     FLY TO CENTER
  ======================================================= */

  useEffect(() => {
    if (!center) {
      return;
    }

    map.flyTo(
      center,
      zoom,
      {
        animate: true,
        duration: 0.8,
      }
    );
  }, [
    center,
    zoom,
    map,
  ]);


  return null;
}


/* =========================================================
   MAP CLICK HANDLER
========================================================= */

function MapClickHandler({
  onLocationSelect,
}) {
  useMapEvents({
    click(event) {
      onLocationSelect([
        event.latlng.lat,
        event.latlng.lng,
      ]);
    },
  });

  return null;
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

function GoogleMapPremium() {

  const mapRef =
    useRef(null);


  const autocompleteTimer =
    useRef(null);


  const autoLocationStarted =
    useRef(false);


  /* =======================================================
     STATES
  ======================================================= */

  const [center, setCenter] =
    useState(
      DEFAULT_CENTER
    );


  const [zoom, setZoom] =
    useState(12);


  const [search, setSearch] =
    useState("");


  const [selectedLocation, setSelectedLocation] =
    useState(null);


  const [currentLocation, setCurrentLocation] =
    useState(null);


  const [address, setAddress] =
    useState(
      DEFAULT_ADDRESS
    );


  const [currentAddress, setCurrentAddress] =
    useState(
      DEFAULT_ADDRESS
    );


  const [loadingLocation, setLoadingLocation] =
    useState(false);


  const [searchLoading, setSearchLoading] =
    useState(false);


  const [autocompleteLoading, setAutocompleteLoading] =
    useState(false);


  const [searchSuggestions, setSearchSuggestions] =
    useState([]);


  const [showSuggestions, setShowSuggestions] =
    useState(false);


  const [locationType, setLocationType] =
    useState("default");


  /* =========================================================
     CHECK KARACHI BOUNDS
  ========================================================= */

  const isInsideKarachi =
    useCallback(
      (
        lat,
        lng
      ) => {

        const [
          southWest,
          northEast,
        ] = KARACHI_BOUNDS;


        return (
          lat >= southWest[0] &&
          lat <= northEast[0] &&
          lng >= southWest[1] &&
          lng <= northEast[1]
        );

      },
      []
    );


  /* =========================================================
     REVERSE GEOCODING
  ========================================================= */

  const reverseGeocode =
    useCallback(
      async (
        lat,
        lng
      ) => {

        try {

          const response =
            await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18`,
              {
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );


          if (!response.ok) {

            throw new Error(
              "Reverse geocoding failed"
            );

          }


          const data =
            await response.json();


          return (
            data?.display_name ||
            null
          );

        } catch (error) {

          console.error(
            "Reverse geocoding error:",
            error
          );


          return null;

        }

      },
      []
    );


  /* =========================================================
     SELECT LOCATION
  ========================================================= */

  const selectLocation =
    useCallback(
      async (
        position,
        customAddress = null
      ) => {

        const [
          lat,
          lng,
        ] = position;


        /* ===================================================
           KARACHI BOUNDARY CHECK
        =================================================== */

        if (
          !isInsideKarachi(
            lat,
            lng
          )
        ) {

          setAddress(
            "Please select a location inside Karachi"
          );

          return;

        }


        /* ===================================================
           SELECTED LOCATION
        =================================================== */

        setSelectedLocation(
          position
        );


        /* ===================================================
           CURRENT LOCATION CLEAR
        =================================================== */

        setCurrentLocation(
          null
        );


        /* ===================================================
           MAP CENTER
        =================================================== */

        setCenter(
          position
        );


        setZoom(
          15
        );


        setLocationType(
          "selected"
        );


        /* ===================================================
           ADDRESS
        =================================================== */

        if (
          customAddress
        ) {

          setAddress(
            customAddress
          );

        } else {

          const resolvedAddress =
            await reverseGeocode(
              lat,
              lng
            );


          setAddress(
            resolvedAddress ||
            "Selected location, Karachi"
          );

        }


        /* ===================================================
           FLY MAP
        =================================================== */

        if (
          mapRef.current
        ) {

          mapRef.current.flyTo(
            position,
            15,
            {
              animate: true,
              duration: 0.8,
            }
          );

        }

      },
      [
        reverseGeocode,
        isInsideKarachi,
      ]
    );


  /* =========================================================
     FETCH AUTOCOMPLETE
  ========================================================= */

  const fetchSearchSuggestions =
    useCallback(
      async (
        query
      ) => {

        const value =
          query.trim();


        if (
          value.length < 2
        ) {

          setSearchSuggestions([]);

          setShowSuggestions(false);

          setAutocompleteLoading(false);

          return;

        }


        setAutocompleteLoading(
          true
        );


        try {

          const url =
            `https://nominatim.openstreetmap.org/search?format=jsonv2` +
            `&q=${encodeURIComponent(
              `${value}, Karachi, Pakistan`
            )}` +
            `&limit=7` +
            `&addressdetails=1` +
            `&bounded=1` +
            `&viewbox=66.75,25.15,67.35,24.70`;


          const response =
            await fetch(
              url,
              {
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );


          if (!response.ok) {

            throw new Error(
              "Autocomplete request failed"
            );

          }


          const results =
            await response.json();


          const filteredResults =
            results.filter(
              (item) =>
                isInsideKarachi(
                  parseFloat(
                    item.lat
                  ),
                  parseFloat(
                    item.lon
                  )
                )
            );


          setSearchSuggestions(
            filteredResults
          );


          setShowSuggestions(
            filteredResults.length > 0
          );

        } catch (error) {

          console.error(
            "Autocomplete error:",
            error
          );


          setSearchSuggestions([]);

          setShowSuggestions(false);

        } finally {

          setAutocompleteLoading(
            false
          );

        }

      },
      [
        isInsideKarachi,
      ]
    );


  /* =========================================================
     SEARCH INPUT CHANGE
  ========================================================= */

  const handleSearchChange =
    (event) => {

      const value =
        event.target.value;


      setSearch(
        value
      );


      if (
        autocompleteTimer.current
      ) {

        clearTimeout(
          autocompleteTimer.current
        );

      }


      if (
        value.trim().length < 2
      ) {

        setSearchSuggestions([]);

        setShowSuggestions(false);

        setAutocompleteLoading(false);

        return;

      }


      setAutocompleteLoading(
        true
      );


      autocompleteTimer.current =
        setTimeout(() => {

          fetchSearchSuggestions(
            value
          );

        }, 450);

    };


  /* =========================================================
     CLEAN AUTOCOMPLETE TIMER
  ========================================================= */

  useEffect(() => {

    return () => {

      if (
        autocompleteTimer.current
      ) {

        clearTimeout(
          autocompleteTimer.current
        );

      }

    };

  }, []);


  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch =
    async () => {

      const query =
        search.trim();


      if (!query) {
        return;
      }


      setShowSuggestions(
        false
      );


      setSearchSuggestions([]);


      setSearchLoading(
        true
      );


      try {

        const searchQuery =
          `${query}, Karachi, Pakistan`;


        const response =
          await fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
              searchQuery
            )}&limit=5&addressdetails=1&bounded=1&viewbox=66.75,25.15,67.35,24.70`,
            {
              headers: {
                Accept:
                  "application/json",
              },
            }
          );


        if (!response.ok) {

          throw new Error(
            "Search failed"
          );

        }


        const results =
          await response.json();


        const result =
          results.find(
            (item) =>
              isInsideKarachi(
                parseFloat(
                  item.lat
                ),
                parseFloat(
                  item.lon
                )
              )
          );


        if (result) {

          const position = [
            parseFloat(
              result.lat
            ),
            parseFloat(
              result.lon
            ),
          ];


          await selectLocation(
            position,
            result.display_name
          );

        } else {

          setAddress(
            "Location not found inside Karachi"
          );

        }

      } catch (error) {

        console.error(
          "Search error:",
          error
        );


        setAddress(
          "Unable to search location"
        );

      } finally {

        setSearchLoading(
          false
        );

      }

    };


  /* =========================================================
     SEARCH ENTER
  ========================================================= */

  const handleSearchKeyDown =
    (event) => {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        handleSearch();

      }


      if (
        event.key ===
        "Escape"
      ) {

        setShowSuggestions(
          false
        );

      }

    };


  /* =========================================================
     SELECT AUTOCOMPLETE RESULT
  ========================================================= */

  const handleSuggestionSelect =
    async (
      item
    ) => {

      const position = [
        parseFloat(
          item.lat
        ),
        parseFloat(
          item.lon
        ),
      ];


      setSearch(
        item.name ||
        item.display_name
      );


      setShowSuggestions(
        false
      );


      setSearchSuggestions(
        []
      );


      await selectLocation(
        position,
        item.display_name
      );

    };


  /* =========================================================
     CURRENT LOCATION
  ========================================================= */

  const getCurrentLocation =
    useCallback(
      () => {

        if (
          !navigator.geolocation
        ) {

          setAddress(
            "Geolocation is not supported by your browser"
          );

          setLoadingLocation(
            false
          );

          return;

        }


        setLoadingLocation(
          true
        );


        navigator.geolocation.getCurrentPosition(

          async (
            position
          ) => {

            try {

              const gpsPosition = [
                position.coords.latitude,
                position.coords.longitude,
              ];


              const [
                lat,
                lng,
              ] = gpsPosition;


              /* =============================================
                 KARACHI BOUNDARY CHECK
              ============================================= */

              if (
                !isInsideKarachi(
                  lat,
                  lng
                )
              ) {

                setAddress(
                  "Your current location is outside Karachi"
                );

                setLoadingLocation(
                  false
                );

                return;

              }


              /* =============================================
                 CURRENT LOCATION
              ============================================= */

              setCurrentLocation(
                gpsPosition
              );


              /* =============================================
                 REMOVE SELECTED MARKER
              ============================================= */

              setSelectedLocation(
                null
              );


              /* =============================================
                 CENTER MAP
              ============================================= */

              setCenter(
                gpsPosition
              );


              setZoom(
                16
              );


              setLocationType(
                "current"
              );


              /* =============================================
                 FLY MAP
              ============================================= */

              if (
                mapRef.current
              ) {

                mapRef.current.flyTo(
                  gpsPosition,
                  16,
                  {
                    animate: true,
                    duration: 1.2,
                  }
                );

              }


              /* =============================================
                 TEMPORARY ADDRESS
              ============================================= */

              setAddress(
                "Detecting your current location..."
              );


              /* =============================================
                 REVERSE GEOCODING
              ============================================= */

              const resolvedAddress =
                await reverseGeocode(
                  lat,
                  lng
                );


              const finalAddress =
                resolvedAddress ||
                "Your current location, Karachi";


              setCurrentAddress(
                finalAddress
              );


              setAddress(
                finalAddress
              );

            } catch (error) {

              console.error(
                "Current location processing error:",
                error
              );


              setAddress(
                "Unable to process current location"
              );

            } finally {

              setLoadingLocation(
                false
              );

            }

          },


          (error) => {

            console.error(
              "Geolocation error:",
              error
            );


            let errorMessage =
              "Unable to access your location";


            if (
              error.code ===
              1
            ) {

              errorMessage =
                "Location permission was denied";

            } else if (
              error.code ===
              2
            ) {

              errorMessage =
                "Current location is unavailable";

            } else if (
              error.code ===
              3
            ) {

              errorMessage =
                "Location request timed out";

            }


            setAddress(
              errorMessage
            );


            setLoadingLocation(
              false
            );

          },


          {
            enableHighAccuracy:
              true,

            timeout:
              15000,

            maximumAge:
              0,
          }

        );

      },
      [
        isInsideKarachi,
        reverseGeocode,
      ]
    );


  /* =========================================================
     AUTO DETECT CURRENT LOCATION ON COMPONENT LOAD
  ========================================================= */

  useEffect(() => {

    if (
      autoLocationStarted.current
    ) {
      return;
    }


    autoLocationStarted.current =
      true;


    getCurrentLocation();

  }, [
    getCurrentLocation,
  ]);


  /* =========================================================
     ZOOM IN
  ========================================================= */

  const zoomIn =
    () => {

      if (
        !mapRef.current
      ) {
        return;
      }


      const currentZoom =
        mapRef.current.getZoom();


      const nextZoom =
        Math.min(
          currentZoom + 1,
          18
        );


      mapRef.current.setZoom(
        nextZoom
      );


      setZoom(
        nextZoom
      );

    };


  /* =========================================================
     ZOOM OUT
  ========================================================= */

  const zoomOut =
    () => {

      if (
        !mapRef.current
      ) {
        return;
      }


      const currentZoom =
        mapRef.current.getZoom();


      const nextZoom =
        Math.max(
          currentZoom - 1,
          10
        );


      mapRef.current.setZoom(
        nextZoom
      );


      setZoom(
        nextZoom
      );

    };


  /* =========================================================
     FULLSCREEN
  ========================================================= */

  const handleFullscreen =
    () => {

      const element =
        document.querySelector(
          ".premium-map-wrapper"
        );


      if (!element) {
        return;
      }


      if (
        document.fullscreenElement
      ) {

        document.exitFullscreen();

      } else {

        element.requestFullscreen?.();

      }

    };


  /* =========================================================
     FULLSCREEN / RESIZE
  ========================================================= */

  useEffect(() => {

    const handleResize =
      () => {

        setTimeout(() => {

          mapRef.current?.invalidateSize();

        }, 250);

      };


    document.addEventListener(
      "fullscreenchange",
      handleResize
    );


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      document.removeEventListener(
        "fullscreenchange",
        handleResize
      );


      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);


  /* =========================================================
     MAP CLICK
  ========================================================= */

  const handleMapClick =
    async (
      position
    ) => {

      await selectLocation(
        position
      );

    };


  /* =========================================================
     RESET MAP
  ========================================================= */

  const resetMap =
    () => {

      setCenter(
        DEFAULT_CENTER
      );


      setZoom(
        12
      );


      setSelectedLocation(
        null
      );


      setCurrentLocation(
        null
      );


      setAddress(
        DEFAULT_ADDRESS
      );


      setCurrentAddress(
        DEFAULT_ADDRESS
      );


      setLocationType(
        "default"
      );


      setSearch(
        ""
      );


      setSearchSuggestions(
        []
      );


      setShowSuggestions(
        false
      );


      if (
        mapRef.current
      ) {

        mapRef.current.flyTo(
          DEFAULT_CENTER,
          12,
          {
            animate: true,
            duration: 0.8,
          }
        );

      }

    };


  /* =========================================================
     CLICK OUTSIDE SEARCH
  ========================================================= */

  useEffect(() => {

    const handleDocumentClick =
      (event) => {

        if (
          !event.target.closest(
            ".map-search"
          )
        ) {

          setShowSuggestions(
            false
          );

        }

      };


    document.addEventListener(
      "mousedown",
      handleDocumentClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleDocumentClick
      );

    };

  }, []);


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="premium-map-wrapper">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="premium-map-header">


        <div className="map-title">

          <div className="map-title-icon">

            <MapPinned
              size={20}
            />

          </div>


          <div>

            <h2>
              Explore Karachi
            </h2>

            <span>
              Discover places around Karachi
            </span>

          </div>

        </div>


        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="map-search">

          <Search
            size={18}
            className="map-search-icon"
          />


          <input
            type="text"
            value={search}
            onChange={
              handleSearchChange
            }
            onFocus={() => {

              if (
                searchSuggestions.length > 0
              ) {

                setShowSuggestions(
                  true
                );

              }

            }}
            onKeyDown={
              handleSearchKeyDown
            }
            placeholder="Search area in Karachi..."
            autoComplete="off"
          />


          {/* =================================================
              AUTOCOMPLETE LOADER
          ================================================= */}

          {autocompleteLoading && (

            <Loader2
              size={16}
              className="autocomplete-loader"
            />

          )}


          {/* =================================================
              CLEAR SEARCH
          ================================================= */}

          {search &&
            !autocompleteLoading && (

            <button
              className="map-search-clear"
              onClick={() => {

                setSearch("");

                setSearchSuggestions([]);

                setShowSuggestions(false);

              }}
              type="button"
            >

              <X
                size={16}
              />

            </button>

          )}


          {/* =================================================
              SEARCH BUTTON
          ================================================= */}

          <button
            className="map-search-button"
            onClick={
              handleSearch
            }
            disabled={
              searchLoading
            }
            type="button"
          >

            {searchLoading ? (

              <>

                <Loader2
                  size={15}
                  className="search-spinner"
                />

                Searching

              </>

            ) : (

              "Search"

            )}

          </button>


          {/* =================================================
              AUTOCOMPLETE
          ================================================= */}

          {showSuggestions &&
            searchSuggestions.length > 0 && (

            <div className="map-autocomplete">


              <div className="autocomplete-header">

                <div className="autocomplete-heading">

                  <MapPinned
                    size={12}
                  />

                  <span>
                    Karachi Locations
                  </span>

                </div>


                <small>
                  {searchSuggestions.length}
                </small>

              </div>


              <div className="autocomplete-list">

                {searchSuggestions.map(
                  (
                    item,
                    index
                  ) => {

                    const shortName =
                      item.address?.suburb ||
                      item.address?.neighbourhood ||
                      item.address?.road ||
                      item.name ||
                      "Karachi Location";


                    const locationName =
                      item.name ||
                      shortName;


                    const locationDetails =
                      item.address?.suburb ||
                      item.address?.neighbourhood ||
                      item.address?.city_district ||
                      item.address?.city ||
                      "Karachi";


                    return (

                      <button
                        key={
                          item.place_id ||
                          `${item.lat}-${item.lon}-${index}`
                        }
                        type="button"
                        className="autocomplete-item"
                        onMouseDown={(
                          event
                        ) => {

                          event.preventDefault();

                        }}
                        onClick={() =>
                          handleSuggestionSelect(
                            item
                          )
                        }
                      >

                        <div className="autocomplete-icon">

                          <MapPin
                            size={16}
                          />

                        </div>


                        <div className="autocomplete-content">

                          <strong>
                            {locationName}
                          </strong>


                          <span>
                            {locationDetails}
                          </span>

                        </div>


                        <Navigation
                          size={14}
                          className="autocomplete-arrow"
                        />

                      </button>

                    );

                  }
                )}

              </div>

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          MAP
      ===================================================== */}

      <div className="premium-map">


        <MapContainer
          center={
            DEFAULT_CENTER
          }
          zoom={
            12
          }
          minZoom={
            10
          }
          maxZoom={
            18
          }
          maxBounds={
            KARACHI_BOUNDS
          }
          maxBoundsViscosity={
            1
          }
          zoomControl={
            false
          }
          scrollWheelZoom={
            true
          }
          doubleClickZoom={
            true
          }
          dragging={
            true
          }
          touchZoom={
            true
          }
          attributionControl={
            true
          }
          style={{
            width:
              "100%",

            height:
              "100%",
          }}
        >


          {/* =================================================
              OPEN STREET MAP
          ================================================= */}

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={
              19
            }
          />


          {/* =================================================
              MAP CONTROLLER
          ================================================= */}

          <MapController
            center={
              center
            }
            zoom={
              zoom
            }
            mapRef={
              mapRef
            }
          />


          {/* =================================================
              MAP CLICK
          ================================================= */}

          <MapClickHandler
            onLocationSelect={
              handleMapClick
            }
          />


          {/* =================================================
              SELECTED LOCATION MARKER
          ================================================= */}

          {selectedLocation && (

            <Marker
              position={
                selectedLocation
              }
              icon={
                markerIcon
              }
            >

              <Popup>

                <div className="map-info-window">

                  <div className="info-window-icon">

                    <MapPin
                      size={18}
                    />

                  </div>


                  <div>

                    <strong>
                      Selected Location
                    </strong>


                    <p>
                      {address}
                    </p>

                  </div>

                </div>

              </Popup>

            </Marker>

          )}


          {/* =================================================
              CURRENT LOCATION MARKER
          ================================================= */}

          {currentLocation && (

            <Marker
              position={
                currentLocation
              }
              icon={
                currentLocationIcon
              }
              zIndexOffset={
                3000
              }
            >

              <Popup>

                <div className="map-info-window">

                  <div className="info-window-icon current-info-icon">

                    <Crosshair
                      size={18}
                    />

                  </div>


                  <div>

                    <strong>
                      Your Current Location
                    </strong>


                    <p>
                      {currentAddress}
                    </p>

                  </div>

                </div>

              </Popup>

            </Marker>

          )}

        </MapContainer>


        {/* ===================================================
            TOP GRADIENT
        =================================================== */}

        <div className="map-top-gradient"></div>


        {/* ===================================================
            KARACHI BADGE
        =================================================== */}

        <div className="map-floating-badge">

          <Map
            size={14}
          />

          <span>
            Karachi Map
          </span>

        </div>


        {/* ===================================================
            ZOOM CONTROLS
        =================================================== */}

        <div className="map-controls">

          <button
            onClick={
              zoomIn
            }
            title="Zoom in"
            type="button"
          >

            <Plus
              size={18}
            />

          </button>


          <button
            onClick={
              zoomOut
            }
            title="Zoom out"
            type="button"
          >

            <Minus
              size={18}
            />

          </button>

        </div>


        {/* ===================================================
            CURRENT LOCATION BUTTON
        =================================================== */}

        <button
          className="map-location-button"
          onClick={
            getCurrentLocation
          }
          disabled={
            loadingLocation
          }
          title="Find my current location"
          type="button"
        >

          {loadingLocation ? (

            <Loader2
              size={19}
              className="location-spinning"
            />

          ) : (

            <LocateFixed
              size={19}
            />

          )}

        </button>


        {/* ===================================================
            RESET
        =================================================== */}

        <button
          className="map-reset-button"
          onClick={
            resetMap
          }
          title="Reset Karachi map"
          type="button"
        >

          <Compass
            size={18}
          />

        </button>


        {/* ===================================================
            FULLSCREEN
        =================================================== */}

        <button
          className="map-fullscreen-button"
          onClick={
            handleFullscreen
          }
          title="Fullscreen"
          type="button"
        >

          <Maximize2
            size={18}
          />

        </button>


        {/* ===================================================
            LOCATION CARD
        =================================================== */}

        <div className="map-location-card">


          <div
            className={
              locationType ===
              "current"

                ? "location-card-icon current-card-icon"

                : "location-card-icon"
            }
          >

            {locationType ===
            "current" ? (

              <Crosshair
                size={18}
              />

            ) : (

              <Navigation
                size={18}
              />

            )}

          </div>


          <div className="location-card-content">

            <span>

              {locationType ===
              "current"

                ? "YOUR CURRENT LOCATION"

                : "SELECTED LOCATION"}

            </span>


            <strong>
              {address}
            </strong>

          </div>


          {locationType ===
            "current" && (

            <div className="location-live-badge">

              <span></span>

              LIVE

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="premium-map-footer">


        <div className="map-status">

          <span className="status-dot"></span>

          <span>
            Karachi location services active
          </span>

        </div>


        <span className="map-coordinates">

          {center[0].toFixed(4)}

          {", "}

          {center[1].toFixed(4)}

        </span>

      </div>


    </div>
  );
}


export default GoogleMapPremium;