// I declare that the lab work here submitted is original
// except for source material explicitly acknowledged,
// and that the same or closely related material has not been
// previously submitted for another course.
// I also acknowledge that I am aware of University policy and
// regulations on honesty in academic work, and of the disciplinary
// guidelines and procedures applicable to breaches of such
// policy and regulations, as contained in the website.
// University Guideline on Academic Honesty:
// https://www.cuhk.edu.hk/policy/academichonesty/
// Student Name : Chan Yau Ki
// Student ID : 1155157432
// Class/Section : CSCI2720
// Date : 10/11/2023

import ReactDOM from "react-dom/client";
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <ul>
            <li> <Link to="/">Home</Link> </li>
            <li> <Link to="/gallery">Images</Link> </li>
            <li> <Link to="/slideshow">Slideshow</Link> </li>
          </ul>
        </div>

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery name={this.props.name} />} />
          <Route path="/slideshow" element={<Slideshow />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

class Home extends React.Component {
  render() {
    return (
      <>
        <h2>Home</h2>
        <img src={"tree.png"} />
      </>
    );
  }
}

const data = [
  { filename: "cuhk-2013.jpg", year: 2013, remarks: "Sunset over CUHK" },
  { filename: "cuhk-2017.jpg", year: 2017, remarks: "Bird's-eye view of CUHK" },
  { filename: "sci-2013.jpg", year: 2013, remarks: "The CUHK Emblem" },
  { filename: "shb-2013.jpg", year: 2013, remarks: "The Engineering Buildings" },
  { filename: "stream-2009.jpg", year: 2009, remarks: "Nature hidden in the campus" },
];

class Gallery extends React.Component {
  render() {
    return (
      <>
        <Title name={this.props.name} />
        {/* <Gallery /> */}
        < main className="container" >
          {data.map((file, index) => <FileCard i={index} key={index} />)}
        </main >
      </>
    );
  }
}

class Title extends React.Component {
  render() {
    return (
      <header className="bg-warning">
        <h1 className="display-4 text-center">{this.props.name}</h1>
      </header>
    );
  }
}

class FileCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = { selected: -1 };
  }

  handleHover(index, e) {
    this.setState({ selected: index });
  }

  handleNotHover(e) {
    this.setState({ selected: -1 });
  }

  render() {
    let i = this.props.i;
    return (
      <div className="card d-inline-block m-2"
        style={{ width: this.state.selected == i ? 400 : 200 }}
        onMouseEnter={(e) => this.handleHover(i, e)}
        onMouseLeave={(e) => this.handleNotHover(e)}>

        <img src={"images/" + data[i].filename} className="w-100" />

        <div className="card-body">
          <h6 className="card-title">{data[i].filename}</h6>
          <p className="card-text">{data[i].year}</p>
        </div>

      </div>
    );
  }
}

let shuffle = [];
for (let i = 0; i < data.length; i++) {
  shuffle.push(i);
}

class Slideshow extends React.Component {

  constructor(props) {
    super(props);
    this.state = { currentImageID: 0, currentInterval: 1500, x: 0 };
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleSlower = this.handleSlower.bind(this);
    this.handleFaster = this.handleFaster.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
  }

  handleStart(e) {
    this.timer = setInterval(() => {
      this.setState({ x: (this.state.x + 1) % shuffle.length });
      this.setState({ currentImageID: shuffle[this.state.x] });
    }, this.state.currentInterval);
  }

  handleStop(e) { clearInterval(this.timer); }

  handleSlower(e) {
    this.handleStop(e);
    this.setState({ currentInterval: this.state.currentInterval + 200 });
    this.handleStart(e);
  }

  handleFaster(e) {
    this.handleStop(e);
    if (this.state.currentInterval - 200 >= 200)
      this.setState({ currentInterval: this.state.currentInterval - 200 });
    this.handleStart(e);
  }

  handleShuffle(e) {
    this.handleStop(e);
    for (let i = shuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
    }
    this.handleStart(e);
  }

  render() {
    return (
      <>
        <button onClick={(e) => this.handleStart(e)}>Start slideshow</button>
        <button onClick={(e) => this.handleStop(e)}>Stop slideshow</button>
        <button onClick={(e) => this.handleSlower(e)}>Slower</button>
        <button onClick={(e) => this.handleFaster(e)}>Faster</button>
        <button onClick={(e) => this.handleShuffle(e)}>Shuffle</button>
        <p>[{this.state.currentImageID}]: {data[this.state.currentImageID].filename} with currentInterval: {this.state.currentInterval}</p>
        <img src={"images/" + data[this.state.currentImageID].filename} />
      </>
    );
  }
}

function NoMatch() {
  let location = useLocation();
  return (
    <div>
      <h3> No Match for <code>{location.pathname}</code></h3>
    </div>
  );
}

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App name="CUHK pictures" />);
