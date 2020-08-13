import React from 'react';
import './App.css';

interface StateInterface {
  devices: MediaDeviceInfo[];
}

interface PropsInterface {
}

class App extends React.Component<PropsInterface, StateInterface> {
  constructor(props: any) {
    super(props);
    this.state = {
      devices: []
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Hello React</p>
          <button onClick={() => {this._refreshDevices()}}>Refresh</button>
          {
            this.state.devices.map(device =>
              <p key={device.deviceId}>{device.label}</p>
            )
          }
        </header>
      </div>
    );
  }

  private async _refreshDevices() {
    console.log('refresh');
    const devices = (await navigator.mediaDevices.enumerateDevices()).filter(device => device instanceof InputDeviceInfo);
    this.setState({ devices });
    console.log(this.state);
  }
}

export default App;
