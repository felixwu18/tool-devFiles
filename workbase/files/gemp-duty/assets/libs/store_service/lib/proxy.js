if(!window.Proxy){
	(function(window){
		var seq=0;
		var dfGetter=function(target, property, receiver){
			return target[property];
		};
		var dfSetter=function(target, property, value,  receiver){
			target[property]=value;
		};
		var afterRevoke=function(){
			throw "illegal operation attempted on a revoked proxy";
		};
		if(Object.defineProperties){
			window.Proxy=function(target, handler){
				var me=this;
				if(!handler.get){
					handler.get=dfGetter;
				}
				if(!handler.set){
					handler.set=dfSetter;
				}
				Object.keys(target).forEach(function(key){
					Object.defineProperty(me,key,{
						enumerable:true,
						get:function(){
							return handler.get(target,key,me);
						},
						set:function(value){
							if(handler.set(target,key,value,me)===false){
								throw new TypeError("'set' on proxy: trap returned falsish for property '"+key+"'");
							}
						}
					});
				});
			};
		}else if(window.execScript){
			//从avalon学到的方式，通过VB
			window.VBProxySetter=function(target, property, value, receiver, handler){
				if(handler.set(target, property, value, receiver)===false){
					throw new TypeError("'set' on proxy: trap returned falsish for property '"+key+"'");
				}
			};
			window.VBProxyGetter=function(target,property, receiver, handler){
				return handler.get(target,property, receiver);
			};
			window.VBProxyPool=new Map();
			window.VBProxyFactory=function(target,handler){
				var className=VBProxyPool.get(target);
				if(!className){
					className="VBClass_"+(seq++);
					VBProxyPool.set(target,className);
					var buffer=["Class "+className];
					buffer.push('Public [__target__]');
					buffer.push('Public [__handler__]');
					Object.keys(target).forEach(function(key){
						if(key.match(/[a-zA-Z0-9_$]/)){
							buffer.push(
								'Public Property Let ['+key+'](var)',
								'	Call VBProxySetter([__target__],"'+key+'",var,Me,[__handler__])',
								'End Property',
								'Public Property Set ['+key+'](var)',
								'	Call VBProxySetter([__target__],"'+key+'",var,Me,[__handler__])',
								'End Property',
								'Public Property Get ['+key+']',
								'	On Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
								'	Set ['+key+']=VBProxyGetter([__target__],"'+key+'",Me,[__handler__])',
								'	If Err.Number <> 0 Then',
								'		['+key+']=VBProxyGetter([__target__],"'+key+'",Me,[__handler__])',
								'	End If',
								'	On Error Goto 0',
								'End Property');
						}
					});
					buffer.push('End Class');
					buffer.push(
						'Function '+className+'_Factory(target,handler)',
						'	Dim o',
						'	Set o = New '+className,
						'	Set o.[__target__]=target',
						'	Set o.[__handler__]=handler',
						'	Set '+className+'_Factory=o',
						'End Function'
					);
					try{
						window.execScript(buffer.join('\n'), 'VBScript');
					}catch(e){
						alert(buffer.join('\n'));
					}
				}
				return window[className+'_Factory'](target,handler); //得到其产品
            };
            debugger
			window.Proxy=function(target, handler){
				if(!handler.get){
					handler.get=dfGetter;
				}
				if(!handler.set){
					handler.set=dfSetter;
				}
				var me=VBProxyFactory(target,handler);
				return me;
			};
		}
		window.Proxy.revocable=function(target,handler){
			var r={};
			r.proxy=new Proxy(target,handler);
			r.revoke=function(){
				handler.get=handler.set=afterRevoke;
			};
			return r;
		};
	})(window);
}
