export const genControlCode = (n:number = 4)=>{
  //生成n位随机数
  let code = '';
  for(let i = 0; i < n; i++){
    code += Math.floor(Math.random() * 10);
  }
  return code;
}