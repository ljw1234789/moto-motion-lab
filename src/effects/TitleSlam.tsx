import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BaseProps, Demo, Fonts, envelope, frame30, map, out} from '../shared';

export type TitleProps = BaseProps & {headline: string; subtitle: string; eyebrow: string; background: string};
export const titleDefaults: TitleProps = {variant:'preview',color:'#e10600',intensity:1,duration:4,headline:'不服。',subtitle:'就向前。',eyebrow:'PASSION INTO MOTION',background:'assets/intake.jpg'};
export const TitleSlam: React.FC<TitleProps> = (p) => {
  const {f,total} = frame30();
  const a = out(map(f,8,24));
  const b = out(map(f,36,53));
  const leave = map(f,total-17,total-1);
  const kick = Math.exp(-Math.max(0,f-8)/7) * (f>=8?1:0) * p.intensity;
  const layer = <AbsoluteFill style={{opacity:map(f,5,9)*(1-leave),transform:`translateX(${-leave*350}px)`}}>
    <div style={{position:'absolute',left:104,top:154,color:'#f5f1e8',fontFamily:'MotoCondensed',fontSize:30,letterSpacing:5}}>{p.eyebrow}</div>
    <div style={{position:'absolute',left:104,top:211,fontFamily:'MotoSerif',fontWeight:900,fontSize:Math.min(258,1100/Math.max(1,p.headline.length)),lineHeight:1.25,whiteSpace:'nowrap',color:'#f5f1e8',transformOrigin:'left center',transform:`translateX(${(1-a)*300*p.intensity}px) scale(${1+(1-a)*1.15*p.intensity}) rotate(${-(1-a)*9*p.intensity}deg)`,filter:`blur(${(1-a)*9*p.intensity}px)`,textShadow:`${4+kick*17}px 0 0 ${p.color}`}}>{p.headline}</div>
    <div style={{position:'absolute',left:104,top:572,fontFamily:'MotoSerif',fontWeight:900,fontSize:Math.min(130,1160/Math.max(1,p.subtitle.length)),lineHeight:1.4,letterSpacing:7,color:'#f5f1e8',whiteSpace:'nowrap',opacity:map(f,34,39),transform:`translateX(${-(1-b)*1100*p.intensity}px) skewX(${-(1-b)*12}deg)`}}>{p.subtitle}</div>
    <div style={{position:'absolute',left:104,top:784,height:17,width:1170,background:p.color,transformOrigin:'left',transform:`scaleX(${out(map(f,49,66))})`}}/>
    <div style={{position:'absolute',right:83,top:217,writingMode:'vertical-rl',fontFamily:'MotoCondensed',fontSize:95,letterSpacing:7,color:'transparent',WebkitTextStroke:'1px #f5f1e8',opacity:map(f,54,70)*.75}}>NEVER YIELD</div>
  </AbsoluteFill>;
  return <Fonts>{p.variant==='overlay'?layer:<Demo src={p.background} name="TITLE SLAM" dark={.12} motion={{transform:`scale(${1.1+kick*.09}) translateX(${-f*.3}px)`}}><AbsoluteFill style={{background:'linear-gradient(90deg,rgba(0,0,0,.82),rgba(0,0,0,.15) 85%)'}}/>{layer}</Demo>}</Fonts>;
};
