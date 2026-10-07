import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BaseProps, Demo, Fonts, envelope, frame30, map, out} from '../shared';

export type CalloutProps = BaseProps & {label: string; caption: string; background: string; anchorX: number; anchorY: number; labelX: number; labelY: number};
export const calloutDefaults: CalloutProps = {variant:'preview',color:'#e10600',intensity:1,duration:4,label:'制动卡钳',caption:'ENGINEERED FOR MOTION',background:'assets/brake.jpg',anchorX:900,anchorY:470,labelX:1700,labelY:560};
export const MechanicalCallout: React.FC<CalloutProps> = (p) => {
  const {f,total} = frame30();
  const trace = out(map(f,6,27));
  const fade = envelope(f,total,7,16);
  const x=p.anchorX,y=p.anchorY;
  const layer = <AbsoluteFill style={{opacity:fade}}>
    <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
      <circle cx={x} cy={y} r={30+40*(1-trace)*p.intensity} fill="none" stroke="#f5f1e8" strokeWidth="3" opacity=".8"/>
      <circle cx={x} cy={y} r={6} fill={p.color}/>
      <circle cx={x} cy={y} r={11} fill="none" stroke={p.color} strokeWidth="1"/>
      <path d={`M ${x} ${y} L ${p.labelX-150} ${p.labelY} H ${p.labelX}`} fill="none" stroke={p.color} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-trace}/>
    </svg>
    <div style={{position:'absolute',right:1920-p.labelX,top:p.labelY-153,opacity:map(f,24,33),transform:`translateX(${(1-out(map(f,24,40)))*85*p.intensity}px)`,background:'rgba(9,9,9,.84)',borderRight:`6px solid ${p.color}`,padding:'20px 28px',textAlign:'right',color:'#f5f1e8'}}>
      <div style={{fontFamily:'MotoSerif',fontSize:46,fontWeight:700,whiteSpace:'nowrap'}}>{p.label}</div>
      <div style={{fontFamily:'MotoCondensed',fontSize:22,letterSpacing:3,marginTop:9}}>{p.caption}</div>
    </div>
  </AbsoluteFill>;
  return <Fonts>{p.variant==='overlay'?layer:<Demo src={p.background} name="MECHANICAL CALLOUT" dark={.1}>{layer}</Demo>}</Fonts>;
};
