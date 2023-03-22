function ClockOptionRadios() {
    return (
    <form onChange={handleClockOptionChange}>
    <p>
      <label>
        <input name="clock_type" type="radio" value="s" defaultChecked />
        <span>Longitute Time, align to Second</span>
      </label>
    </p>
    <p>
      <label>
        <input name="clock_type" type="radio" value="m" />
        <span>Longitute Time, align to Minute</span>
      </label>
    </p>
    <p>
      <label>
        <input name="clock_type" type="radio" value="z" />
        <span>Time Zone Time</span>
      </label>
    </p>
  </form>
    );
}

function handleClockOptionChange(event) {
    clockOption = event.target.value;
}

class Time extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateStr: this.getOffsetTime("s"),
        }
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if (clockOption === "s" || clockOption === "m") {
            this.setState({
                dateStr: this.getOffsetTime()
            });
            return;    
        }
        this.setState({
            dateStr: new Date().toLocaleTimeString(window.navigator.language, { timezone: this.props.timezone })
        });
    }

    render() {
        return (
            <span className="clock">{this.state.dateStr}</span>
        );
    }

    getOffsetTime() {
        let date = new Date();      
        let minuteOffset = this.props.longitude / 15 * 60;
        if (clockOption === "m") {
            minuteOffset = Math.floor(minuteOffset);
        }
        date = new Date(new Date().getTime() + minuteOffset * 60 * 1000);
        return date.toLocaleTimeString(window.navigator.language, { timezone: "UTC" });
    }
}

class CityClock extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onChange(this.props.name);
    }

    render() {
        return (
            <li className="collection-item avatar">
            <i className="material-icons circle green">access_time</i>
            <p>
            <Time longitude={this.props.longitude} timezone={this.props.timezone} /> | {this.props.name}<br />
                Longitute: {longitudeToString(this.props.longitude)} | Time Zone: {this.props.timezone}
            </p>
            <p className="secondary-content">
            <a className="waves-effect waves-light btn-small red" onClick={this.handleDelete}><i className="material-icons">delete</i></a>
            </p>
        </li>
        );
    }
}

class AddCityInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
        };
        this.handleAdd = this.handleAdd.bind(this);
    }

    componentDidMount() {
        var elems = document.querySelectorAll('.autocomplete');
        let emptyCities = {};
        for (let city in cities) {
            emptyCities[city] = null;
        }
        var instances = M.Autocomplete.init(elems, {
            data: emptyCities
        });
    }

    handleAdd() {
        let cityName = document.getElementById("add-city-input").value;
        if (cityName === "") {
            return;
        }
        if (cities[cityName] === undefined) {
            M.toast({ html: "City not found" });
            return;
        }
        this.props.onChange(cityName);
    }

    render() {
        return (
            <div className="col s12 m6">
                <div className="input-field col s8">
                    <i className="material-icons prefix">location_city</i>
                    <input type="text" id="add-city-input" className="autocomplete" />
                    <label htmlFor="add-city-input">Add a City</label>
                </div>
                <div className="input-field col s4">
                    <div className="btn" onClick={this.handleAdd}><i className="material-icons">add</i></div>
                </div>
            </div>
        );
    }
}

function Title() {
    return (
        <h1>World Clock</h1>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: ["北京", "喀什", "牡丹江", "New York", "Atlanta", "San Francisco"]
        };
        this.handleAddCity = this.handleAddCity.bind(this);
        this.handleDeleteCity = this.handleDeleteCity.bind(this);
    }

    handleAddCity(cityName) {
        if (this.state.cities.includes(cityName)) {
            M.toast({ html: "City already added" });
            return;
        }
        this.setState((state, props)=>({
            cities: state.cities.concat([cityName])
        }));
        M.toast({ html: "City added" });
    }

    handleDeleteCity(cityName) {
        this.setState((state, props)=>({
            cities: state.cities.filter((city) => city !== cityName)
        }));
        M.toast({ html: "City deleted" });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <Title />
                </div>
                <div className="row">
                    <div className="col s12 m6">
                        <ClockOptionRadios />
                    </div>
                    <AddCityInput onChange={this.handleAddCity} />
                </div>
                <div className="row">
                    <ClockList cities={this.state.cities} onChange={this.handleDeleteCity} />
                </div>
            </div>
        );
    }
}

class ClockList extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(cityName) {
        this.props.onChange(cityName);
    }

    render() {
        const shownCities = this.props.cities;
        const cityList = shownCities.map((city) =>
            <CityClock key={city} name={city} longitude={cities[city].longitude} timezone={cities[city].timezone} onChange={this.handleDelete} />
        );
        return (
            <ul className="collection">
                {cityList}
            </ul>
        );
    }
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