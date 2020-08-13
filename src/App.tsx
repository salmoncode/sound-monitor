import React from 'react';
import './App.css';
import AudioInputDevice from './AudioInputDevice';

interface StateInterface {
  devices: InputDeviceInfo[];
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
          <p>Sound Monitor</p>
          <button onClick={() => {this._refreshDevices()}}>Refresh</button>
          {
            this.state.devices.map(device =>
              <AudioInputDevice key={device.deviceId} deviceInfo={device}/>
            )
          }
        </header>
      </div>
    );
  }

  componentDidMount() {
    this._refreshDevices();
  }

  private async _refreshDevices() {
    console.log('refresh');
    const devices: InputDeviceInfo[] = (await navigator.mediaDevices.enumerateDevices())
      .filter(device => device.kind === 'audioinput' && device.deviceId !== 'default') as InputDeviceInfo[];
    this.setState({ devices });
  }
}

export default App;
