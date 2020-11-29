import React, { Component } from 'react';
import { render } from 'react-dom';
import { openDirectory } from './inline-scripts/native-fs-utils';
import './style.css';



interface AppProps { }
interface AppState {
  name: string;
}


function buttonClicked()
{
  alert("clicked");
  openDirectory();
}

class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      name: 'React x'
    };
  }

  render() {
    return (
      <div>
        <p>
          Start editing to see some magic happen :)
        </p>
      <button onClick={openDirectory}>Set Directory</button>


      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
