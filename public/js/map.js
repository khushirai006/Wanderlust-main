
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        // accessToken: 'pk.eyJ1Ijoia2h1c2hpcmFpMDA2IiwiYSI6ImNtdmI0eXY1MjAwbHgyd3BteXhkMXZ1ajQifQ.7CY5yWmbADpwoJB5Tm8rDA',
        container: 'map', // container ID
        style: "mapbox://styles/mapbox/streets-v12",
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 6,
     }); // starting zoom

     const marker = new mapboxgl.Marker({color: "red"})
        .setLngLat(listing.geometry.coordinates) // Listing.geometry.coordinates
        .addTo(map);