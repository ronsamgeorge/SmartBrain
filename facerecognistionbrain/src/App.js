import React from "react";
import Logo from "./Components/Logo/Logo";
import Navigation from "./Components/Navigation/Navigation";
import ImageLinkFor from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import "./App.css";
import "tachyons";
import Particles from "react-particles-js";
import Clarifai from "clarifai";

import SignIn from "./Components/SignIn/SignIn";
import Register from "./Components/Register/Register";

const app = new Clarifai.App({
  apiKey: "75db95205a824549a91120f33cba0c35",
});

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      imageURL: "",
      box: {},
      route: "signin",
      isSignedIn: false,

      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        join: "",
      },
    };
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        join: data.join,
      },
    });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  calcuateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImg");

    const width = Number(image.width);
    const height = Number(image.height);

    console.log(width, height);
    //calculating the boudning box , alot of math
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input });

    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        // THE JPG
        this.state.input
      )
      .then((response) => {
        if (response) {
          fetch("http://localhost:8000/image", {
            method: "put",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            });
        }
        this.displayFaceBox(this.calcuateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route == "signout") {
      this.setState({ isSignedIn: false });
    } else if (route == "home") {
      this.setState({ isSignedIn: true });
    }

    this.setState({ route: route });
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.route === "home" ? (
          <div>
            <Logo />

            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />

            <ImageLinkFor
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />

            <FaceRecognition
              imageURL={this.state.imageURL}
              box={this.state.box}
            />
          </div>
        ) : this.state.route === "register" ? (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        ) : (
          <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        )}
      </div>
    );
  }
}

export default App;
