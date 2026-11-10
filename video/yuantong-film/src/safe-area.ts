export type SafePreset = 'landscape' | 'vertical-conservative';
export const getSafeArea = (width: number, height: number, preset: SafePreset = 'landscape') => {
 const m = preset === 'vertical-conservative'
  ? {left:Math.ceil(width*120/1080),right:Math.ceil(width*200/1080),top:Math.ceil(height*300/1920),bottom:Math.ceil(height*680/1920)}
  : {left:Math.ceil(width*.1),right:Math.ceil(width*.1),top:Math.ceil(height*.1),bottom:Math.ceil(height*.1)};
 return {x:m.left,y:m.top,width:width-m.left-m.right,height:height-m.top-m.bottom,margins:m};
};
export const getActionArea = (w:number,h:number) => ({x:Math.ceil(w*.05),y:Math.ceil(h*.05),width:w-2*Math.ceil(w*.05),height:h-2*Math.ceil(h*.05)});
