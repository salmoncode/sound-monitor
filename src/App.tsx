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
      <div className="container">
        <header className="App-header">
          <h1>Sound Monitor</h1>
        </header>
        <main>
          <section className='refresh-button'>
            <button onClick={() => {this._refreshDevices()}}>Refresh</button>
          </section>
          <section>
            {
              this.state.devices.map(device =>
                <AudioInputDevice key={device.deviceId} deviceInfo={device}/>
              )
            }
          </section>
        </main>
      </div>
    );
  }

  componentDidMount() {
    this._refreshDevices()
    setInterval(() => this._refreshDevices(), 1000);
  }

  private async _refreshDevices() {
    console.log('refresh');
    const devices: InputDeviceInfo[] = (await navigator.mediaDevices.enumerateDevices())
      .filter(device => device.kind === 'audioinput' && device.deviceId !== 'default') as InputDeviceInfo[];
    this.setState({ devices });
  }
}

export default App;
