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
                    <Links />
                    <Description />
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

function Title() {
    return (
        <h1>World Clock</h1>
    );
}

class Links extends React.Component {
    constructor(props) {
        super(props);
        this.dynamicallyLoadScript = this.dynamicallyLoadScript.bind(this);
    }

    componentDidMount() {
        this.dynamicallyLoadScript("https://buttons.github.io/buttons.js");
    }

    dynamicallyLoadScript(url) {
        var script = document.createElement("script");  // create a script DOM node
        script.src = url;  // set its src to the provided URL
       
        document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
    }

    render() {
        return (
            <div>
                <a className="github-button" href="https://github.com/chenyuheng" aria-label="Follow @chenyuheng on GitHub">Follow @chenyuheng</a>
                &nbsp;
                <a className="github-button" href="https://github.com/chenyuheng/world-clock" data-icon="octicon-star" aria-label="Star chenyuheng/world-clock on GitHub">Star</a>
            </div>
        );
    }
}

class Description extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: ""
        };
    }

    componentDidMount() {
        fetch("README.md").then(response => response.text()).then(text => {
            this.setState({
                description: text
            });
        });
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={{__html: this.state.description}} />
        );
    }
}

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
            <CityClock key={city} name={city} longitude={cities[city].longitude} timeZone={cities[city].timeZone} onChange={this.handleDelete} />
        );
        return (
            <ul className="collection">
                {cityList}
            </ul>
        );
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
            <Time longitude={this.props.longitude} timeZone={this.props.timeZone} /> | {this.props.name}<br />
                Longitute: {longitudeToString(this.props.longitude)} | Time Zone: {this.props.timeZone}
            </p>
            <p className="secondary-content">
            <a className="waves-effect waves-light btn-small red" onClick={this.handleDelete}><i className="material-icons">delete</i></a>
            </p>
        </li>
        );
    }
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
            dateStr: new Date().toLocaleTimeString(window.navigator.language, { timeZone: this.props.timeZone })
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
        return date.toLocaleTimeString(window.navigator.language, { timeZone: "UTC" });
    }
}
