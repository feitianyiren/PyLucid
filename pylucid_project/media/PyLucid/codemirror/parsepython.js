/* content from:
 * http://marijn.haverbeke.nl/codemirror/contrib/python/js/parsepython.js
 * closure compiled 2010-07-08 */
var PythonParser=Editor.Parser=function(){function q(g){return RegExp("^(?:"+g.join("|")+")$")}function C(g){if(!g.hasOwnProperty("pythonVersion"))g.pythonVersion=2;if(!g.hasOwnProperty("strictErrors"))g.strictErrors=true;if(g.pythonVersion!=2&&g.pythonVersion!=3){alert('CodeMirror: Unknown Python Version "'+g.pythonVersion+'", defaulting to Python 2.x.');g.pythonVersion=2}if(g.pythonVersion==3){r=N;w=/[\'\"rbRB]/;x=/[rb]/;s.push("\\-\\>")}else{r=O;w=/[\'\"RUru]/;x=/[ru]/}y=g;z=q(P.concat(r.keywords));
D=q(Q.concat(r.types));s=q(s)}var A="py-delimiter",t="py-literal",m="py-error",B="py-operator",E="py-identifier",F="py-string",G="py-bytes",H="py-unicode",I="py-raw",o="normal",u="string",J="+-*/%&|^~<>",R=q(["==","!=","\\<=","\\>=","\\<\\>","\\<\\<","\\>\\>","\\/\\/","\\*\\*"]),K="()[]{}@,:`=;",s=["\\+=","\\-=","\\*=","/=","%=","&=","\\|=","\\^="],S=q(["//=","\\>\\>=","\\<\\<=","\\*\\*="]),T=J+K+"=!",U="=<>*/",L=/[_A-Za-z]/,V=q(["and","or","not","is","in"]),P=["as","assert","break","class","continue",
"def","del","elif","else","except","finally","for","from","global","if","import","lambda","pass","raise","return","try","while","with","yield"],Q=["bool","classmethod","complex","dict","enumerate","float","frozenset","int","list","object","property","reversed","set","slice","staticmethod","str","super","tuple","type"],O={types:["basestring","buffer","file","long","unicode","xrange"],keywords:["exec","print"],version:2},N={types:["bytearray","bytes","filter","map","memoryview","open","range","zip"],
keywords:["nonlocal"],version:3},r,z,D,w,x,y,M=function(){function g(a,i){function h(j,d){if(!k.style&&!k.content)return j;else if(typeof j==u)j={content:a.get(),style:j};if(k.style||d)j.style=d?d:k.style;if(k.content)j.content=k.content+j.content;k={};return j}var b,e,k={};b=a.next();if(b=="#"){for(;!a.endOfLine();)a.next();return"py-comment"}if(b=="\\"){if(!a.endOfLine()){for(e=true;!a.endOfLine();)/[\s\u00a0]/.test(a.next())||(e=false);if(!e)return m}return"py-special"}if(T.indexOf(b)!=-1||b==
"."&&!a.matches(/\d/)){if(U.indexOf(a.peek())!=-1){e=b+a.peek();if(R.test(e)){a.next();if((b=a.peek())&&S.test(e+b)){a.next();return A}else return B}else if(s.test(e)){a.next();return A}}if(J.indexOf(b)!=-1||b==".")return B;else if(K.indexOf(b)!=-1)if(b=="@"&&a.matches(/\w/)){a.nextWhileMatches(/[\w\d_]/);return{style:"py-decorator",content:a.get()}}else return A;else return m}if(/\d/.test(b)||b=="."&&a.matches(/\d/)){if(b==="0"&&!a.endOfLine())switch(a.peek()){case "o":case "O":a.next();a.nextWhileMatches(/[0-7]/);
return h(t,m);case "x":case "X":a.next();a.nextWhileMatches(/[0-9A-Fa-f]/);return h(t,m);case "b":case "B":a.next();a.nextWhileMatches(/[01]/);return h(t,m)}a.nextWhileMatches(/\d/);if(b!="."&&a.peek()=="."){a.next();a.nextWhileMatches(/\d/)}if(a.matches(/e/i)){a.next();if(a.peek()=="+"||a.peek()=="-")a.next();if(a.matches(/\d/))a.nextWhileMatches(/\d/);else return h(m)}a.matches(/j/i)&&a.next();return h(t)}if(w.test(b)){var c=a.peek();e=F;if(x.test(b)&&(c=='"'||c=="'")){switch(b.toLowerCase()){case "b":e=
G;break;case "r":e=I;break;case "u":e=H;break}b=b=a.next();if(a.peek()!=b){i(l(e,b));return null}else{a.next();if(a.peek()==b){a.next();b=b+b+b;i(l(e,b));return null}else return e}}else if(b=="'"||b=='"'){b=b;if(a.peek()!=b){i(l(e,b));return null}else{a.next();if(a.peek()==b){a.next();b=b+b+b;i(l(e,b));return null}else return e}}}if(L.test(b)){a.nextWhileMatches(/[\w\d_]/);b=a.get();if(V.test(b))e=B;else if(z.test(b))e="py-keyword";else if(D.test(b))e="py-type";else{for(e=E;a.peek()==".";){a.next();
if(a.matches(L))a.nextWhileMatches(/[\w\d]/);else{e=m;break}}b+=a.get()}return h({style:e,content:b})}if(/\$\?/.test(b))return h(m);return h(m)}function l(a,i){return function(h,b){for(var e=[],k=false;!k&&!h.endOfLine();){var c=h.next(),j=[];if(c=="\\"){if(h.peek()=="\n")break;h.next();c=h.next()}c==i.charAt(0)&&e.push(i);for(var d=0;d<e.length;d++){var f=e[d];if(f.charAt(0)==c)if(f.length==1){b(g);k=true;break}else j.push(f.slice(1))}e=j}return a}}return function(a,i){return tokenizer(a,i||g)}}();
return{make:function(g,l){function a(d,f){f=f?f:o;c={prev:c,endOfScope:false,startNewScope:false,level:d,next:null,type:f}}function i(d){d=d?d:false;if(c.prev)if(d){c=c.prev;c.next=null}else{c.prev.next=c;c=c.prev}}function h(d){var f;return function(n,p,v){if(v===null||v===undefined){if(n)for(;d.next;)d=d.next;return d.level}else if(v===true)if(p==d.level)return d.next?d.next.level:d.level;else{for(f=d;f.prev&&f.prev.level>p;)f=f.prev;return f.level}else if(v===false)if(p>d.level)return d.level;
else if(d.prev){for(f=d;f.prev&&f.prev.level>=p;)f=f.prev;return f.prev?f.prev.level:f.level}return d.level}}z||C({});l=l||0;var b=M(g),e=null,k=l,c={prev:null,endOfScope:false,startNewScope:false,level:l,next:null,type:o},j={next:function(){var d=b.next(),f=d.style,n=d.content;if(e){if(e.content=="def"&&f==E)d.style="py-func";if(e.content=="\n"){var p=c;if(f=="whitespace"&&c.type==o){if(d.value.length<c.level){for(;d.value.length<c.level;)i();if(d.value.length!=c.level){c=p;if(y.strictErrors)d.style=
m}else c.next=null}}else if(c.level!==l&&c.type==o){for(;l!==c.level;)i();if(c.level!==l){c=p;if(y.strictErrors)d.style=m}}}}switch(f){case F:case G:case I:case H:c.type!==u&&a(c.level+1,u);break;default:c.type===u&&i(true);break}switch(n){case ".":case "@":if(n!==d.value)d.style=m;break;case ":":if(c.type===o)c.startNewScope=c.level+indentUnit;break;case "(":case "[":case "{":a(k+n.length,"sequence");break;case ")":case "]":case "}":i(true);break;case "pass":case "return":if(c.type===o)c.endOfScope=
true;break;case "\n":k=l;if(c.endOfScope){c.endOfScope=false;i()}else if(c.startNewScope!==false){f=c.startNewScope;c.startNewScope=false;a(f,o)}d.indentation=h(c);break}if(n!="\n")k+=d.value.length;return e=d},copy:function(){var d=c,f=b.state;return function(n){b=M(n,f);c=d;return j}}};return j},electricChars:"",configure:C}}();