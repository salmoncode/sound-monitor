import React from 'react';

interface StateInterface {
  init: boolean
  monitoring: boolean
  stream?: MediaStream
}

interface PropsInterface {
  deviceInfo: InputDeviceInfo
}

class AudioInputDevice extends React.Component<PropsInterface, StateInterface> {
  constructor(props: any) {
    super(props);
    this.state = {
      init: false,
      monitoring: false
    }
  }

  render() {
    return (
      <div className="input-device">
        <p>{this.props.deviceInfo.label}</p>
        {this.state.monitoring ?
          <button onClick={() => {this._stop()}}>stop</button>:
          <button onClick={() => {this._start()}}>monitoring</button>
        }
        <audio controls ref={ audio => {
          if(!audio || !this.state.stream) return;
          audio.srcObject = this.state.stream
          }}>
        </audio>
      </div>
    );
  }

  private async _start() {
    if(!this.state.init) {
      const stream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: this.props.deviceInfo.deviceId}});
      this.setState({init: true, stream});
    }

    this.setState({monitoring: true});
  }

  private _stop() {
    this.setState({monitoring: false});
  }
}

export default AudioInputDevice;
