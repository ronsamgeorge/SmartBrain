import React from 'react';
import Logo from './Components/Logo/Logo'
import Navigation from './Components/Navigation/Navigation'
import ImageLinkFor from './Components/ImageLinkForm/ImageLinkForm'
import Rank from './Components/Rank/Rank'
import './App.css';
import 'tachyons';

import Particles from 'react-particles-js';


const particlesOptions = {
  particles : {
    number : {
      value : 30,
      density :{
        enable : true ,
        value_area : 800
      }
    }
  }
}
class App extends React.Component{

  render(){
    return (
      <div className="App">
        <Particles className = "particles" params = {particlesOptions}/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkFor />
        {/*<FaceRecognition />*/}     
      </div>
    );
  }
}

export default App;
