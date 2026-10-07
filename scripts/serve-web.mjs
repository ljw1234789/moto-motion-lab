import {createServer} from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import './build-web.mjs';
const root=path.resolve('docs');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.mp4':'video/mp4','.ttf':'font/ttf','.json':'application/json'};
createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    const target=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
    if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    const file=await fs.readFile(target),range=req.headers.range;
    res.setHeader('Content-Type',types[path.extname(target)]??'application/octet-stream');res.setHeader('Accept-Ranges','bytes');
    if(range){
      const m=/^bytes=(\d+)-(\d*)$/.exec(range);
      if(!m){res.writeHead(416);res.end();return;}
      const from=Number(m[1]),to=Math.min(m[2]?Number(m[2]):file.length-1,file.length-1);
      if(from>to){res.writeHead(416);res.end();return;}
      res.writeHead(206,{'Content-Range':`bytes ${from}-${to}/${file.length}`,'Content-Length':to-from+1});res.end(file.subarray(from,to+1));
    }else{res.writeHead(200,{'Content-Length':file.length});res.end(file);}
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Motion Lab: http://localhost:4173'));
