import React from 'react';
import {Composition} from 'remotion';
import {TitleSlam,titleDefaults} from './effects/TitleSlam';
import {MechanicalCallout,calloutDefaults} from './effects/MechanicalCallout';
import {WhipPan,whipDefaults} from './effects/WhipPan';
import {SpeedLines,speedDefaults} from './effects/SpeedLines';
import {LogoSweep,logoDefaults} from './effects/LogoSweep';

export const Root: React.FC = () => <>
  <Composition id="Moto-Title" component={TitleSlam} width={1920} height={1080} fps={30} durationInFrames={120} defaultProps={titleDefaults} calculateMetadata={({props})=>({durationInFrames:Math.max(75,Math.round(props.duration*30))})}/>
  <Composition id="Moto-Callout" component={MechanicalCallout} width={1920} height={1080} fps={30} durationInFrames={120} defaultProps={calloutDefaults} calculateMetadata={({props})=>({durationInFrames:Math.max(60,Math.round(props.duration*30))})}/>
  <Composition id="Moto-Whip" component={WhipPan} width={1920} height={1080} fps={30} durationInFrames={90} defaultProps={whipDefaults} calculateMetadata={({props})=>({durationInFrames:Math.max(30,Math.round(props.duration*30))})}/>
  <Composition id="Moto-Speed" component={SpeedLines} width={1920} height={1080} fps={30} durationInFrames={120} defaultProps={speedDefaults} calculateMetadata={({props})=>({durationInFrames:Math.max(30,Math.round(props.duration*30))})}/>
  <Composition id="Moto-Logo" component={LogoSweep} width={1920} height={1080} fps={30} durationInFrames={120} defaultProps={logoDefaults} calculateMetadata={({props})=>({durationInFrames:Math.max(90,Math.round(props.duration*30))})}/>
</>;
