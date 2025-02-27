// 编译分为三步
// 1.  模板转为ast语法树
// 2.  转化codegennode 
// 3.  转化成字符串

import { NodeTypes } from "./ast"


function createParseContext(content) {
    return {
        originalSource: content,
        source: content,//字符串不停的截取
        line: 1,//第一行
        column: 1,//第一列
        offset: 0,//偏移量
    }
}
function isEnd(context) {
    const c = context.source
    if(c.startsWith('</')){
        return true
    }
    return !context.source
}

function advancePositionMutation(context, c, endIndex) {
    let linesCount = 0; // 第几行
    let linePos = -1; // 换行的位置信息
  
    for (let i = 0; i < endIndex; i++) {
      if (c.charCodeAt(i) == 10) {
        linesCount++;
        linePos = i;
      }
    }
    context.offset += endIndex;
    context.line += linesCount;
    context.column =
      linePos == -1 ? context.column + endIndex : endIndex - linePos;
  }
  
function advanceBy(context,endIndex){
    let c  = context.source
    advancePositionMutation(context, c, endIndex);
    context.source = c.slice(endIndex)
}
function parseTextData(context,endIndex){
    const rawText = context.source.slice(0,endIndex)
    advanceBy(context,endIndex)//截取字符串
    return rawText
}
function parseText(context){
    let tokens = ['<','{{']//当前离得最近的标记
    let endIndex = context.source.length;
    for(let i = 0;i<tokens.length;i++){
        const index = context.source.indexOf(tokens[i],1)
        if(index!==-1 && index<endIndex){
            endIndex = index
        }
    }
    let start = getCursor(context);
    //  0 - endIndex 为文本节点
   return {
    type: NodeTypes.TEXT,
    start,
    content: parseTextData(context,endIndex)
   }

}
function advanceSpaces(context){
    // 匹配空格
    const match = /^[ \t\r\n]+/.exec(context.source);
    if (match) {
      // 删除空格
      advanceBy(context, match[0].length);
    }
}

// hack 浏览器不识别getCursor好getSelection方法
function getCursor(context) {
    let { line, column, offset } = context;
    return { line, column, offset };
  }
  function getSelection(context, start, e?) {
    let end = e || getCursor(context);
    // eslint 可以根据 start，end找到要报错的位置
    return {
      start,
      end,
      source: context.originalSource.slice(start.offset, end.offset),
    };
  }
  function parseAttributeValue(context) {
    let quote = context.source[0];
  
    const isQuoted = quote === '"' || quote === "'";
  
    let content;
    if (isQuoted) {
      advanceBy(context, 1);
      const endIndex = context.source.indexOf(quote, 1);
      content = parseTextData(context, endIndex); // slice()
      advanceBy(context, 1);
    } else {
      content = context.source.match(/([^ \t\r\n/>])+/)[1]; // 取出内容，删除空格
      advanceBy(context, content.length);
      advanceSpaces(context);
    }
    return content;
  }
  function parseAttribute(context) {
    const start = getCursor(context);
    // a   = '1'
    let match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source);
    const name = match[0];
    let value;
    advanceBy(context, name.length);
    if (/^[\t\r\n\f ]*=/.test(context.source)) {
      advanceSpaces(context); //
      advanceBy(context, 1);
      advanceSpaces(context);
      value = parseAttributeValue(context);
    }
    let loc = getSelection(context, start);
    return {
      type: NodeTypes.ATTRIBUTE,
      name,
      value: {
        type: NodeTypes.TEXT,
        content: value,
        loc: loc,
      },
      loc: getSelection(context, start),
    };
  }
  const parseAtrributes = (context) => {
    const props = [];
    while (context.source.length > 0 && !context.source.startsWith(">")) {
        props.push(parseAttribute(context));
        advanceSpaces(context);
      }
    return props;
  }
function parseTag(context){
    const start = getCursor(context);
        const match = /^<\/?([a-z][^ \t\r\n/>]*)/.exec(context.source);
        const tag = match[1]; // <div   />

        advanceBy(context, match[0].length); // 删除匹配到的内容

        advanceSpaces(context); // 空格移除

        // <div a="1" B='1' >

        let props = parseAtrributes(context);
        const isSelfClosing = context.source.startsWith("/>");
        advanceBy(context, isSelfClosing ? 2 : 1);
        return {
            type: NodeTypes.ELEMENT,
            tag,
            isSelfClosing,
            loc: getSelection(context, start), // 开头标签解析后的信息
            props,
        };
}
function parseElement(context){
    const ele = parseTag(context);

    const children = parseChildren(context); // 递归解析儿子节点,但是解析的时候如果是结尾标签需要跳过
  
    if (context.source.startsWith("</")) {
      parseTag(context); //  闭合标签没有意义直接移除即可
    }
    (ele as any).children = children;
    (ele as any).loc = getSelection(context, ele.loc.start);
    return ele;
}
function parseInterpolation(context) {
    const start = getCursor(context);
    const closeIndex = context.source.indexOf("}}", 2);
    advanceBy(context, 2); // 去掉开头 {{
    const innerStart = getCursor(context);
    const innerEnd = getCursor(context);
    const preTrimContent = parseTextData(context, closeIndex - 2);
    const content = preTrimContent.trim(); // 表达式中的变量
    // 获取  {{   name   }}去空格
    const startOffset = preTrimContent.indexOf(content);
    if (startOffset > 0) {
      advancePositionMutation(innerStart, preTrimContent, startOffset);
    }
    const endOffset = startOffset + content.length;
    advancePositionMutation(innerEnd, preTrimContent, endOffset);
    advanceBy(context, 2);
    //    name   }}
    return {
      type: NodeTypes.INTERPOLATION,
      content: {
        type: NodeTypes.SIMPLE_EXPRESSION,
        isStatic: false,
        isConstant: false,
        content,
        loc: getSelection(context, innerStart, innerEnd),
      },
      loc: getSelection(context, start),
    };
  }
function parseChildren(context) {
    const nodes = [] as any;
    while (!isEnd(context)) {
        const c = context.source; // 现在解析的内容
        let node;
        if (c.startsWith("{{")) {
        // {{}}
        node = parseInterpolation(context);
        } else if (c[0] === "<") {
        // <div>
        node = parseElement(context);
        } else {
        // 文本  // abc  {{}} <div></div>
        node = parseText(context);
        }
        // 状态机
        nodes.push(node);
    }
    // 状态机
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        // 将空节点进行压缩
        if (node.type === NodeTypes.TEXT) {
        // 如果是空白字符 清空
        if (!/[^\t\r\n\f ]/.test(node.content)) {
            nodes[i] = null; // 空白字符清空
        } else {
            node.content = node.content.replace(/[\t\r\n\f ]+/g, " ");
        }
        }
    }

    return nodes.filter(Boolean);
}
function createRoot(children) {
    return {
        type: NodeTypes.ROOT,
        children
    }
}
function parse(template){
    // 根据template生成ast语法树 line column offset
    const context = createParseContext(template)
    //  <p><div></div><div></div></p>
    // { type:1,tag:'p',children:[{type:1,tag:'div',children:[]},{type:1,tag:'div',children:[]}] }
    return createRoot(parseChildren(context))
}
function compile(){
    
}
export  {
    parse,
    compile
}


