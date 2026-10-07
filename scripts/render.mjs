import path from 'node:path';
import fs from 'node:fs/promises';
import {bundle} from '@remotion/bundler';
import {openBrowser,renderMedia,renderStill,selectComposition} from '@remotion/renderer';

const root=process.cwd();
const args=process.argv.slice(2);
const option=(name,fallback)=>{const at=args.indexOf(`--${name}`);return at<0?fallback:args[at+1];};
const presets=[
  ['title','Moto-Title','01-标题冲入',70],
  ['callout','Moto-Callout','02-机械细节标注',43],
  ['whip','Moto-Whip','03-甩镜转场',45],
  ['speed','Moto-Speed','04-速度线',52],
  ['logo','Moto-Logo','05-Logo金属扫光',54],
];
const effect=option('effect','all'),variant=option('variant','all');
const customPath=option('props',null),output=option('output',path.join(root,'exports'));
await fs.mkdir(output,{recursive:true});
await fs.mkdir(path.join(output,'stills'),{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});
const localChrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
let browserExecutable=process.env.CHROME_PATH;
if(!browserExecutable){try{await fs.access(localChrome);browserExecutable=localChrome;}catch{}}
const browser=await openBrowser('chrome',{browserExecutable,logLevel:'warn'});
try{
  for(const [key,id,label,frame] of presets.filter(([key])=>effect==='all'||effect===key)){
    const config=JSON.parse(await fs.readFile(customPath??path.join(root,'config',`${key}.json`),'utf8'));
    for(const type of variant==='all'?['preview','overlay']:[variant]){
      if(!['preview','overlay'].includes(type))throw new Error('variant must be preview, overlay, or all');
      const inputProps={...config,variant:type};
      const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser,inputProps});
      await renderStill({serveUrl,composition,puppeteerInstance:browser,inputProps,frame:Math.min(frame,composition.durationInFrames-1),imageFormat:'png',output:path.join(output,'stills',`${key}-${type}.png`),logLevel:'warn'});
      if(args.includes('--stills'))continue;
      const suffix=type==='preview'?'可复用预览.mp4':key==='whip'?'配套透明遮罩.mov':'透明叠加.mov';
      const opts=type==='preview'?{codec:'h264',crf:18,pixelFormat:'yuv420p',imageFormat:'jpeg',jpegQuality:95}:{codec:'prores',proResProfile:'4444',pixelFormat:'yuva444p10le',imageFormat:'png'};
      let last=-1;
      await renderMedia({serveUrl,composition,puppeteerInstance:browser,inputProps,...opts,muted:true,concurrency:4,outputLocation:path.join(output,`${label}-${suffix}`),logLevel:'warn',onProgress:({progress})=>{const step=Math.floor(progress*4);if(step!==last){last=step;console.log(`${key} ${type}: ${step*25}%`);}}});
      console.log(`Saved ${label} ${type}`);
    }
  }
}finally{await browser.close({silent:true});}
