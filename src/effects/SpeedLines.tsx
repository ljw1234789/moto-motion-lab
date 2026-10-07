import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BaseProps, Demo, Fonts, envelope, frame30} from '../shared';

export type SpeedProps = BaseProps & {background: string; backgroundStart: number; centerX: number; centerY: number; density: number; speed: number; opacity: number};
export const speedDefaults: SpeedProps = {variant:'preview',color:'#e10600',intensity:1,duration:4,background:'assets/brand-racing.mp4',backgroundStart:90,centerX:960,centerY:540,density:42,speed:78,opacity:.75};
export const SpeedLines: React.FC<SpeedProps> = (p) => {
  const {f,total} = frame30();
  const count=Math.max(8,Math.min(120,Math.round(p.density)));
  const layer=<AbsoluteFill style={{opacity:envelope(f,total,10,18)*p.opacity}}><svg width="1920" height="1080" style={{position:'absolute',inset:0}}>{Array.from({length:count},(_,i)=>{
    const a=i/count*Math.PI*2;
    const r=440+((i*83+f*p.speed)%800);
    const len=(140+i%5*55)*p.intensity;
    return <line key={i} x1={p.centerX+Math.cos(a)*r} y1={p.centerY+Math.sin(a)*r*.72} x2={p.centerX+Math.cos(a)*(r+len)} y2={p.centerY+Math.sin(a)*(r+len)*.72} stroke={i%6===0?p.color:'#f5f1e8'} strokeWidth={i%3===0?4:2} opacity={.28+i%4*.13}/>;
  })}</svg></AbsoluteFill>;
  return <Fonts>{p.variant==='overlay'?layer:<Demo src={p.background} name="SPEED LINES" start={p.backgroundStart} dark={.04}>{layer}</Demo>}</Fonts>;
};
