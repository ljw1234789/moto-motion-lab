import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {Fonts, Media, asset} from '../src/shared';
import {TitleSlam, titleDefaults} from '../src/effects/TitleSlam';
import {MechanicalCallout, calloutDefaults} from '../src/effects/MechanicalCallout';
import {WhipPan, whipDefaults} from '../src/effects/WhipPan';
import {SpeedLines, speedDefaults} from '../src/effects/SpeedLines';
import {LogoSweep, logoDefaults} from '../src/effects/LogoSweep';

export const effects = [
  {key:'title',name:'标题冲入',en:'TITLE SLAM',description:'大字冲入，接上横向滑动和红色下划线。',tag:'开场',frames:120,beats:[14,70,110],defaults:titleDefaults},
  {key:'callout',name:'机械细节标注',en:'MECHANICAL CALLOUT',description:'瞄准部件，再画出引线与名称。',tag:'细节',frames:120,beats:[12,43,109],defaults:calloutDefaults},
  {key:'whip',name:'甩镜转场',en:'WHIP PAN',description:'镜头横向甩动，斜切遮罩接住下一个画面。',tag:'转场',frames:90,beats:[40,45,50],defaults:whipDefaults},
  {key:'speed',name:'速度线',en:'SPEED LINES',description:'向外飞出的线条，让赛道镜头更有冲刺感。',tag:'赛道',frames:120,beats:[14,52,108],defaults:speedDefaults},
  {key:'logo',name:'Logo 金属扫光',en:'METALLIC LOGO',description:'Logo 从透视角度落定，再掠过一束高光。',tag:'片尾',frames:120,beats:[16,54,109],defaults:logoDefaults},
] as const;
export type EffectKey = typeof effects[number]['key'];
export type Settings = Record<string,string | number>;
export const getDefaults = (key:EffectKey) => ({...effects.find(e=>e.key===key)!.defaults}) as Settings;
export type PreviewProps = {effect:EffectKey; settings:Settings; comparison:boolean; split:number};

const Animated:React.FC<{effect:EffectKey;settings:Settings}> = ({effect,settings}) => {
  // The lab renders the same exported components as the video templates.
  switch(effect){
    case 'title':return <TitleSlam {...titleDefaults} {...settings} variant="preview"/>;
    case 'callout':return <MechanicalCallout {...calloutDefaults} {...settings} variant="preview"/>;
    case 'whip':return <WhipPan {...whipDefaults} {...settings} variant="preview"/>;
    case 'speed':return <SpeedLines {...speedDefaults} {...settings} variant="preview"/>;
    case 'logo':return <LogoSweep {...logoDefaults} {...settings} variant="preview"/>;
  }
};

const Plain:React.FC<{effect:EffectKey;settings:Settings}> = ({effect,settings}) => {
  const f=useCurrentFrame();
  if(effect==='logo'){
    return <Fonts><AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 45%,#272727 0%,#090909 67%)',justifyContent:'center',alignItems:'center'}}>
      <Img src={asset(String(settings.logo))} style={{width:Number(settings.logoWidth),height:Number(settings.logoHeight),objectFit:'contain',opacity:.6}}/>
      <div style={{height:6,width:130,background:String(settings.color),marginTop:51}}/>
      <div style={{fontFamily:'MotoSerif',fontSize:38,letterSpacing:7,color:'#f5f1e8',marginTop:36}}>{settings.caption}</div>
    </AbsoluteFill></Fonts>;
  }
  let src=String(settings.background),start=effect==='speed'?Number(settings.backgroundStart):0;
  if(effect==='whip'){
    const after=f>=Number(settings.transitionAt)*30;
    src=String(after?settings.after:settings.before);
    start=Number(after?settings.afterStart:settings.beforeStart);
  }
  return <AbsoluteFill style={{background:'#090909'}}><Media src={src} start={start}/></AbsoluteFill>;
};

export const Preview:React.FC<PreviewProps> = ({effect,settings,comparison,split}) => <AbsoluteFill style={{background:'#090909',overflow:'hidden'}}>
  {comparison&&<Plain effect={effect} settings={settings}/>}
  <AbsoluteFill style={{clipPath:comparison?`inset(0 ${100-split}% 0 0)`:'none'}}><Animated effect={effect} settings={settings}/></AbsoluteFill>
  {comparison&&<>
    <div style={{position:'absolute',left:split+'%',top:0,bottom:0,width:3,background:'#fff',boxShadow:'0 0 20px #000'}}/>
    <div style={{position:'absolute',left:40,top:32,fontFamily:'sans-serif',fontSize:28,color:'#fff',background:'rgba(0,0,0,.7)',padding:'10px 20px',borderRadius:8}}>加入动效</div>
    <div style={{position:'absolute',right:40,top:32,fontFamily:'sans-serif',fontSize:28,color:'#fff',background:'rgba(0,0,0,.7)',padding:'10px 20px',borderRadius:8}}>{effect==='logo'?'静态 Logo':'原镜头'}</div>
  </>}
</AbsoluteFill>;
