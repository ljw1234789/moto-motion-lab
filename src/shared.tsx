import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type BaseProps = {
  variant: 'preview' | 'overlay';
  color: string;
  intensity: number;
  duration: number;
};
export const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const map = (v: number, a: number, b: number, c = 0, d = 1) => interpolate(v, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
export const out = (p: number) => 1 - Math.pow(1 - clamp(p), 4);
export const asset = (src: string) => /^(https?:|data:|blob:)/.test(src) ? src : staticFile(src.replace(/^\//, ''));
export const frame30 = () => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  return {f: f * 30 / fps, total: durationInFrames * 30 / fps};
};
export const envelope = (f: number, total: number, enter = 10, leave = 14) => map(f, 0, enter) * map(f, total - leave - 1, total - 1, 1, 0);

export const Fonts: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [handle] = useState(() => delayRender('Loading reusable effect fonts'));
  useEffect(() => {
    Promise.all([document.fonts.load('900 40px MotoSerif'), document.fonts.load('400 40px MotoCondensed')]).then(() => continueRender(handle));
  }, [handle]);
  return <><style>{`@font-face{font-family:MotoSerif;src:url('${staticFile('assets/fonts/NotoSerifSC.ttf')}')}@font-face{font-family:MotoCondensed;src:url('${staticFile('assets/fonts/BebasNeue.ttf')}')}*{box-sizing:border-box}`}</style>{children}</>;
};

export const Media: React.FC<{src: string; start?: number; style?: React.CSSProperties}> = ({src, start = 0, style}) => /\.(mp4|mov|webm)(\?|$)/i.test(src)
  ? <OffthreadVideo src={asset(src)} trimBefore={start} muted style={{width:'100%',height:'100%',objectFit:'cover',...style}} />
  : <Img src={asset(src)} style={{width:'100%',height:'100%',objectFit:'cover',...style}} />;

export const Demo: React.FC<{src: string; name: string; children: React.ReactNode; motion?: React.CSSProperties; dark?: number; start?: number}> = ({src,name,children,motion,dark=.25,start=0}) => <AbsoluteFill style={{background:'#090909'}}>
  <AbsoluteFill style={motion}><Media src={src} start={start}/></AbsoluteFill>
  <AbsoluteFill style={{background:`rgba(0,0,0,${dark})`}}/>
  {children}
  <div style={{position:'absolute',right:52,bottom:38,color:'#f5f1e8',fontFamily:'MotoCondensed',fontSize:22,letterSpacing:3,opacity:.8}}>ZX MOTO / {name}</div>
</AbsoluteFill>;
