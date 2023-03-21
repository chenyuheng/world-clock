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
    console.log(event.target.value);
}

class Time extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
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
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <span>{this.state.date.toLocaleTimeString()}</span>
        );
    }
}

class CityClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            timezone: props.timezone,
            longitude: props.longitude
        };
    }

    render() {
        return (
            <li className="collection-item avatar">
            <i className="material-icons circle green">insert_chart</i>
            <p>
            <span className="brand-logo">{this.state.name}<Time /> </span><br />
                Longitute: {this.state.longitude} | Time Zone: {this.state.timezone}
            </p>
            <p className="secondary-content">
            <a className="waves-effect waves-light btn-small red"><i className="material-icons">delete</i></a>
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
    }

    componentDidMount() {
        var elems = document.querySelectorAll('.autocomplete');
        var instances = M.Autocomplete.init(elems, {
            data: {
                "北京": null,
                "上海": null,
                "广州": null,
                "New York": null,
                "Atlanta": null,
                "San Francisco": null,
            }
        });
    }

    render() {
        return (
            <div className="col s12 m6">
                <div className="input-field col s8">
                    <i className="material-icons prefix">location_city</i>
                    <input type="text" id="autocomplete-input" className="autocomplete" />
                    <label htmlFor="autocomplete-input">Add a City</label>
                </div>
                <div className="input-field col s4">
                    <div className="btn"><i className="material-icons">add</i></div>
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

function App() {
    return (
        <div className="container">
            <div className="row">
                <Title />
            </div>
            <div className="row">
                <div className="col s12 m6">
                    <ClockOptionRadios />
                </div>
                <AddCityInput />
            </div>
            <div className="row">
                <ul className="collection">
                    <CityClock name="北京" timezone="UTC+8" longitude="116.407395" />
                </ul>
            </div>
        </div>
    );
}

function init() {
    const root = ReactDOM.createRoot(
        document.getElementById("root")
    );
    root.render(<App />);

}