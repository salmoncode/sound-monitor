import React from 'react';

interface StateInterface {
  init: boolean
  monitoring: boolean
  context?: AudioContext
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
        <p></p>
      </div>
    );
  }

  private async _start() {
    if(!this.state.init) {
      const context = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: this.props.deviceInfo.deviceId}});
      const microphone = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();

      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(context.destination);
      this.setState({init: true, context});
    } else {
      this.state.context?.resume();
    }
    this.setState({monitoring: true});
  }

  private _stop() {
    this.state.context?.suspend();
    this.setState({monitoring: false});
  }
}

export default AudioInputDevice;
