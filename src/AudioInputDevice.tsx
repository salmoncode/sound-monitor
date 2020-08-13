import React from 'react';

interface StateInterface {
  init: boolean
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
      init: false,
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
    if(!this.state.init) {
      const context = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: this.props.deviceInfo.deviceId}});
      const microphone = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      microphone.connect(analyser);
      analyser.connect(context.destination);
      this.setState({init: true, context, analyser, dataArray});
      this.tick();
    } else {
      console.log('resume');
      this.state.context?.resume();
    }
    this.setState({monitoring: true});
  }

  private _stop() {
    console.log('suspend');
    this.state.context?.suspend();
    this.setState({monitoring: false});
  }
}

export default AudioInputDevice;
