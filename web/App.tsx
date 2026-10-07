import React,{useEffect,useRef,useState} from 'react';
import {Player,PlayerRef} from '@remotion/player';
import {Preview,EffectKey,Settings,effects,getDefaults} from './Preview';

const repo='https://github.com/liu2026liu123-cyber/moto-motion-lab';
const icons=['↗','◎','⇢','≋','✦'];

const Range:React.FC<{label:string;value:number;min:number;max:number;step?:number;suffix?:string;onChange:(v:number)=>void}> = ({label,value,min,max,step=1,suffix='',onChange}) => <label className="field range-field"><span>{label}<b>{Number(value.toFixed(2))}{suffix}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}/></label>;

export const App:React.FC=()=>{
  const [selected,setSelected]=useState<EffectKey>('title');
  const [settings,setSettings]=useState<Settings>(getDefaults('title'));
  const [comparison,setComparison]=useState(false);
  const [split,setSplit]=useState(65);
  const [frame,setFrame]=useState(0);
  const [playing,setPlaying]=useState(true);
  const [rate,setRate]=useState(1);
  const [loop,setLoop]=useState(true);
  const [notice,setNotice]=useState('');
  const [fileName,setFileName]=useState('');
  const player=useRef<PlayerRef>(null),fileInput=useRef<HTMLInputElement>(null);
  const uploaded=useRef<string|null>(null);
  const current=effects.find(e=>e.key===selected)!;
  useEffect(()=>{
    const ref=player.current;if(!ref)return;
    const update=({detail}: {detail:{frame:number}})=>setFrame(detail.frame);
    const play=()=>setPlaying(true),pause=()=>setPlaying(false);
    ref.addEventListener('frameupdate',update);ref.addEventListener('play',play);ref.addEventListener('pause',pause);
    return ()=>{ref.removeEventListener('frameupdate',update);ref.removeEventListener('play',play);ref.removeEventListener('pause',pause);};
  },[selected]);
  useEffect(()=>()=>{if(uploaded.current)URL.revokeObjectURL(uploaded.current);},[]);
  const patch=(key:string,value:string|number)=>setSettings(old=>({...old,[key]:value}));
  const choose=(key:EffectKey)=>{setSelected(key);setSettings(getDefaults(key));setFrame(0);setPlaying(true);setNotice('');setFileName('');};
  const seek=(n:number)=>{player.current?.pause();player.current?.seekTo(Math.max(0,Math.min(current.frames-1,n)));};
  const text=(key:string,label:string,maxLength=40)=><label className="field"><span>{label}</span><input type="text" value={String(settings[key]??'')} maxLength={maxLength} onChange={e=>patch(key,e.target.value)}/></label>;
  const range=(key:string,label:string,min:number,max:number,step=1,suffix='')=><Range label={label} value={Number(settings[key])} min={min} max={max} step={step} suffix={suffix} onChange={v=>patch(key,v)}/>;
  const exportConfig=()=>{
    if(uploaded.current&&Object.values(settings).some(v=>typeof v==='string'&&v.startsWith('blob:'))){setNotice('本地图片只在当前预览中使用。要导出，请先把图片放进 public/assets，再修改配置路径。');return;}
    const config={...settings};delete config.variant;
    const url=URL.createObjectURL(new Blob([JSON.stringify(config,null,2)+'\n'],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download=selected+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('配置已下载，可以用它重新导出视频。');
  };
  const replaceImage=(file:File|undefined)=>{
    if(!file)return;
    if(!['image/png','image/jpeg','image/webp','image/svg+xml'].includes(file.type)){setNotice('请选择 PNG、JPG、WebP 或 SVG 图片。');return;}
    if(uploaded.current)URL.revokeObjectURL(uploaded.current);
    uploaded.current=URL.createObjectURL(file);patch(selected==='logo'?'logo':selected==='whip'?'before':'background',uploaded.current);setFileName(file.name);setNotice('图片已替换，仅保留在你的浏览器里。');
  };
  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="./"><span className="brand-mark">M<span>↗</span></span><div><strong>MOTO MOTION LAB</strong><small>机车动效实验室</small></div></a><div className="header-right"><span className="live-badge"><i/>交互预览</span><a className="source-link" href={repo} target="_blank" rel="noreferrer">GitHub 源码 <span>↗</span></a></div></header>
    <section className="intro"><div><p className="eyebrow">FIVE EFFECTS. ONE PLAYGROUND.</p><h1>动效怎么变，<em>直接看。</em></h1><p className="intro-copy">播放、暂停、逐帧对比。把参数调成你想要的样子。</p></div><div className="intro-number"><span>05</span><small>可复用镜头动效</small></div></section>
    <main className="workspace">
      <nav className="effect-list" aria-label="选择动效"><div className="section-label">动效库 <span>01 — 05</span></div>{effects.map((e,i)=><button key={e.key} className={`effect-card ${selected===e.key?'active':''}`} aria-pressed={selected===e.key} onClick={()=>choose(e.key)}><span className="effect-icon">{icons[i]}</span><span className="effect-title"><strong>{e.name}</strong><small>{e.en}</small></span><span className="effect-number">0{i+1}</span></button>)}<div className="library-note"><i/>五个模板使用同一套源代码实时预览。</div></nav>
      <section className="stage-panel"><div className="stage-heading"><div><span className="mini-tag">{current.tag}</span><h2>{current.name}</h2></div><div className="view-switch"><button aria-pressed={!comparison} className={!comparison?'selected':''} onClick={()=>setComparison(false)}>只看动效</button><button aria-pressed={comparison} className={comparison?'selected':''} onClick={()=>setComparison(true)}>前后对比</button></div></div>
        <div className="player-wrap"><Player key={selected} ref={player} component={Preview} inputProps={{effect:selected,settings,comparison,split}} durationInFrames={current.frames} compositionWidth={1920} compositionHeight={1080} fps={30} autoPlay loop={loop} playbackRate={rate} controls={false} clickToPlay={false} spaceKeyToPlayOrPause={false} initiallyMuted style={{width:'100%',aspectRatio:'16/9'}} errorFallback={({error})=><div className="player-error">素材暂时无法显示。请刷新重试。<small>{error.message}</small></div>}/><span className="stage-corner">{current.en}</span></div>
        {comparison&&<div className="comparison-bar"><span>加入动效</span><input aria-label="前后对比分界" type="range" min="5" max="95" value={split} onChange={e=>setSplit(Number(e.target.value))}/><span>{selected==='logo'?'静态 Logo':'原镜头'}</span></div>}
        <div className="transport"><button className="play-button" aria-label={playing?'暂停':'播放'} onClick={()=>player.current?.toggle()}>{playing?'Ⅱ':'▶'}</button><button className="step-button" aria-label="上一帧" onClick={()=>seek(frame-1)}>‹</button><button className="step-button" aria-label="下一帧" onClick={()=>seek(frame+1)}>›</button><input className="timeline" type="range" aria-label="播放进度" min="0" max={current.frames-1} value={frame} onChange={e=>seek(Number(e.target.value))}/><span className="timecode">{(frame/30).toFixed(2)}<small> / {(current.frames/30).toFixed(0)}s</small></span><select aria-label="播放速度" value={rate} onChange={e=>setRate(Number(e.target.value))}><option value={.25}>0.25×</option><option value={.5}>0.5×</option><option value={1}>1×</option><option value={1.5}>1.5×</option></select><button className={`loop-button ${loop?'on':''}`} aria-label="循环播放" aria-pressed={loop} onClick={()=>setLoop(!loop)}>↻</button></div>
        <div className="beat-row"><span>跳到关键变化</span>{current.beats.map((n,i)=><button key={n} onClick={()=>seek(n)}>{['入场','定格','收尾'][i]} <small>{(n/30).toFixed(2)}s</small></button>)}<span className="frame-counter">F{String(frame).padStart(3,'0')}</span></div>
        <p className="effect-description">{current.description}</p>
        {selected==='whip'&&<p className="whip-note">这里展示完整甩镜。素材包里的透明 MOV 是配套遮罩，镜头位移由源模板完成。</p>}
      </section>
      <aside className="settings-panel"><div className="settings-heading"><div><p className="section-label">实时调整</p><h3>你的动效，你来调。</h3></div><button className="reset-button" onClick={()=>{setSettings(getDefaults(selected));setFileName('');setNotice('');}} title="恢复默认参数">重置</button></div>
        <div className="settings-body">
          {selected==='title'&&<>{text('headline','主标题',7)}{text('subtitle','副标题',10)}{text('eyebrow','英文短句',40)}</>}
          {selected==='callout'&&<>{text('label','部件名称',12)}{text('caption','说明短句',40)}{range('anchorX','标注横坐标',150,1770)}{range('anchorY','标注纵坐标',120,950)}</>}
          {selected==='whip'&&<><label className="field"><span>甩镜方向</span><select value={String(settings.direction)} onChange={e=>patch('direction',e.target.value)}><option value="left">向左甩</option><option value="right">向右甩</option></select></label>{range('transitionFrames','转场长度',6,30,1,' 帧')}</>}
          {selected==='speed'&&<>{range('density','线条数量',12,80)}{range('speed','飞出速度',20,150)}{range('opacity','线条透明度',.2,1,.05)}{range('centerX','消失点横坐标',300,1620)}{range('centerY','消失点纵坐标',200,880)}</>}
          {selected==='logo'&&<>{text('caption','片尾标语',18)}{range('logoWidth','Logo 大小',500,1400,20)}</>}
          <label className="field"><span>强调色 <b className="color-value">{String(settings.color).toUpperCase()}</b></span><div className="color-row">{['#e10600','#ffc83d','#2ad4c6','#8c7bff','#f5f1e8'].map(color=><button key={color} className={`swatch ${settings.color===color?'chosen':''}`} style={{background:color}} aria-label={`强调色 ${color}`} aria-pressed={settings.color===color} onClick={()=>patch('color',color)}/>)}<input type="color" aria-label="自选强调色" value={String(settings.color)} onChange={e=>patch('color',e.target.value)}/></div></label>
          {range('intensity','动效强度',.5,1.5,.05,'×')}
          {selected!=='speed'&&<div className="replace-area"><input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden onChange={e=>replaceImage(e.target.files?.[0])}/><button onClick={()=>fileInput.current?.click()}>＋ {selected==='logo'?'换一张 Logo':selected==='whip'?'替换前一个镜头图片':'替换背景图片'}</button><small>{fileName||'本地图片仅在浏览器中预览'}</small></div>}
        </div>
        <div className="settings-footer"><button className="download-button" onClick={exportConfig}>下载当前配置 <span>↓</span></button><p>改文字、换素材后，可用配置重新导出视频。</p><div className="notice" role="status">{notice}</div></div>
      </aside>
    </main>
    <footer><span><i/>无声预览，方便保留赛车原声</span><span>1920 × 1080 · 30 FPS <b> / </b> MOTO MOTION LAB</span></footer>
  </div>;
};
