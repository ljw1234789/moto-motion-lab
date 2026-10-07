import React,{useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {BaseProps, Fonts, Media, clamp, frame30, map} from '../shared';

export type WhipProps = BaseProps & {before: string; after: string; beforeStart: number; afterStart: number; direction: 'left' | 'right'; transitionAt: number; transitionFrames: number};
export const whipDefaults: WhipProps = {variant:'preview',color:'#e10600',intensity:1,duration:3,before:'assets/intake.jpg',after:'assets/brand-racing.mp4',beforeStart:0,afterStart:90,direction:'left',transitionAt:1.5,transitionFrames:14};
export const WhipPan: React.FC<WhipProps> = (p) => {
  const {f} = frame30();
  const id=useId().replace(/[^a-zA-Z0-9]/g,'');
  const n=Math.max(6,p.transitionFrames),at=p.transitionAt*30;
  const progress=map(f,at-n/2,at+n/2);
  const smooth=progress*progress*(3-2*progress);
  const dir=p.direction==='left'?-1:1;
  const phase=Math.sin(progress*Math.PI);
  const active=progress>0&&progress<1;
  const cover=map(progress,.25,.75,1920+680,-680)*-dir;
  // The overlay is the transition's companion cover. The full template moves both shots.
  const mask=<AbsoluteFill style={{opacity:active?Math.pow(phase,.7):0}}><div style={{position:'absolute',top:-150,bottom:-150,left:cover,width:680,transform:`skewX(${-dir*23}deg)`,background:p.color,boxShadow:`${-dir*55}px 0 0 #090909, ${-dir*95}px 0 0 #f5f1e8`,filter:`blur(${phase*4*p.intensity}px)`}}/></AbsoluteFill>;
  return <Fonts><AbsoluteFill style={{background:p.variant==='overlay'?'transparent':'#090909',overflow:'hidden'}}>
    <svg style={{position:'absolute',width:0,height:0}}><defs><filter id={`blur${id}`} x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation={`${phase*17*p.intensity} 0`}/></filter></defs></svg>
    {p.variant==='preview'&&<>
      {progress<1&&<AbsoluteFill style={{transform:`translateX(${dir*smooth*1920}px) scale(${1+phase*.035*p.intensity})`,filter:`url(#blur${id})`}}><Media src={p.before} start={p.beforeStart}/></AbsoluteFill>}
      {progress>0&&<AbsoluteFill style={{transform:`translateX(${-dir*(1-smooth)*1920}px) scale(${1+phase*.035*p.intensity})`,filter:`url(#blur${id})`}}><Media src={p.after} start={p.afterStart}/></AbsoluteFill>}
    </>}
    {mask}
    {p.variant==='preview'&&<div style={{position:'absolute',left:58,bottom:42,fontFamily:'MotoCondensed',fontSize:29,letterSpacing:4,color:'#fff'}}>WHIP PAN / REPLACE BOTH SHOTS</div>}
  </AbsoluteFill></Fonts>;
};
