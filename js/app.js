function handleClockOptionChange(event) {
    clockOption = event.target.value;
}

let clockOption = "s";
let cities = {};

function longitudeToString(longitude) {
    let str = "";
    if (longitude > 0) {
        str += "E";
    } else {
        str += "W";
    }
    let absLongitude = Math.abs(longitude);
    let degree = Math.floor(absLongitude);
    let minute = Math.floor((absLongitude - degree) * 60);
    str += degree + "°" + minute + "'";
    return str;
}

function init() {
    fetch("data/cities.json")
        .then(response => response.json())
        .then(data => {
            for (let city of data) {
                cities[city.name] = city;
            }
        }).then(() => {
            const root = ReactDOM.createRoot(
                document.getElementById("root")
            );
            root.render(<App />);
        });
}

init();