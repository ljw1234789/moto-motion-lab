import React from 'react';
import {AbsoluteFill,Img} from 'remotion';
import {BaseProps, Fonts, asset, envelope, frame30, map, out} from '../shared';

export type LogoProps = BaseProps & {logo: string; caption: string; logoWidth: number; logoHeight: number};
export const logoDefaults: LogoProps = {variant:'preview',color:'#e10600',intensity:1,duration:4,logo:'assets/logo-white.svg',caption:'让热爱，全速向前。',logoWidth:1000,logoHeight:140};
export const LogoSweep: React.FC<LogoProps> = (p) => {
  const {f,total}=frame30();
  const a=out(map(f,7,27)),leave=map(f,total-18,total-1);
  const position=map(f,31,72,240,-130);
  return <Fonts><AbsoluteFill style={{background:p.variant==='preview'?'#090909':'transparent',overflow:'hidden'}}>
    {p.variant==='preview'&&<><div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 45%,#272727 0%,#090909 67%)'}}/><div style={{position:'absolute',left:80,top:60,fontFamily:'MotoCondensed',fontSize:25,letterSpacing:5,color:'#f5f1e8',opacity:.45}}>LOGO / METALLIC LIGHT SWEEP</div></>}
    <AbsoluteFill style={{justifyContent:'center',alignItems:'center',opacity:a*(1-leave),perspective:1500}}>
      <div style={{width:p.logoWidth,height:p.logoHeight,position:'relative',transform:`translateY(${(1-a)*75*p.intensity}px) rotateX(${-(1-a)*35*p.intensity}deg) scale(${1+(1-a)*.65*p.intensity})`,transformOrigin:'center'}}>
        <Img src={asset(p.logo)} style={{width:'100%',height:'100%',objectFit:'contain',opacity:.6}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(110deg,transparent 30%,#b4b4b4 39%,#fff 46%,#fff 55%,#aaa 62%,transparent 72%)',backgroundSize:'230% 100%',backgroundPosition:`${position}% 50%`,maskImage:`url("${asset(p.logo)}")`,maskSize:'contain',maskPosition:'center',maskRepeat:'no-repeat',WebkitMaskImage:`url("${asset(p.logo)}")`,WebkitMaskSize:'contain',WebkitMaskPosition:'center',WebkitMaskRepeat:'no-repeat',opacity:map(f,29,35)*map(f,75,85,1,0)}}/>
      </div>
      <div style={{height:6,width:130,background:p.color,marginTop:51,transform:`scaleX(${out(map(f,27,44))})`}}/>
      <div style={{fontFamily:'MotoSerif',fontSize:38,letterSpacing:7,color:'#f5f1e8',marginTop:36,opacity:map(f,45,62),transform:`translateY(${map(f,45,62,24,0)}px)`}}>{p.caption}</div>
    </AbsoluteFill>
  </AbsoluteFill></Fonts>;
};
