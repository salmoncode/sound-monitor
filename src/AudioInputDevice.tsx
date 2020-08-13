import React from 'react';

interface StateInterface {
  monitoring: boolean
  context?: AudioContext
  analyser?: AnalyserNode
  dataArray?: Uint8Array
  level: number
}

interface PropsInterface {
  deviceInfo: InputDeviceInfo
}

class AudioInputDevice extends React.Component<PropsInterface, StateInterface> {
  constructor(props: any) {
    super(props);
    this.state = {
      monitoring: false,
      level: 0
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
        <progress max="300" value={this.state.level}></progress>
      </div>
    );
  }

  tick() {
    if(!this.state.analyser || !this.state.dataArray) return;
    this.state.analyser.getByteTimeDomainData(this.state.dataArray)
    const level = this.state.dataArray.reduce((a,b)=>Math.max(a,b));
    this.setState({ level });
    requestAnimationFrame(this.tick.bind(this));
  }

  private async _start() {
      const context = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: this.props.deviceInfo.deviceId}});
      const microphone = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      microphone.connect(analyser);
      analyser.connect(context.destination);
      this.setState({monitoring: true, context, analyser, dataArray});
      this.tick();
  }

  private _stop() {
    this.state.context?.close();
    this.setState({monitoring: false});
  }
}

export default AudioInputDevice;
