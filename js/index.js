
//这种写法是立即调用函数
//(function(){}) ();


 ;(function () {
 	'use strict';

 	var Event = new Vue();

 	function copy(obj){
 		return Object.assign({} , obj) ;
 	}

 	Vue.component('task' , {
 		template: '#task-tpl',
 		props:['todo'],
 		methods: {
 			action: function (name , params) {
 				Event.$emit(name , params);
 			}
 		},

 	})

	 new Vue({
		el: '#main',
		data: {
			list: [],
			current: {},
		},

		//生命周期
		mounted: function(){
			var me = this;
			this.list = ms.get('list') || this.list;
			//监听子组件删除
			Event.$on('remove' , function(id) {
				if(id) {
					me.remove(id);
				}
			});

			Event.$on('set_current' , function(id) {
				if(id) {
					me.set_current(id);
				}
			});

			Event.$on('toggle_complete' , function(id) {
				if(id) {
					me.toggle_complete(id);
				}
			});
		},

		methods:{
			//增加和更新
			merge: function(){
				var is_update , id;
				//判断current是否有id存在，否则添加this.current进入this.list
				 is_update = id =  this.current.id;
				 //如果current对象存在id
				if(is_update) {
					//返回满足条件的元素
					var index = this.find_index(id);
					//Vue能检测到的数组修改方式
					Vue.set(this.list , index ,copy(this.current));
					//this.list[index] = copy(this.current);这种list修改方式Vue是检测不到
					console.log('this.list:' , this.list);
				} else {
					//否则创建列表对象加入列表
					//声明title判断输入的current.title是否为空，空就退出函数
					var title = this.current.title;
					if (!title && title !== 0) return;
					//Object.assign();
					//拷贝this.current
					var todo = copy(this.current);
					//每添加一条todo就添加id进去
					todo.id = this.next_id();
					//将拷贝了current对象的todo放入list里面
					this.list.push(todo);
					
					}
				//放进localstorage
				//每次输入结束清空输入框
				this.reset_current();
				},
				//删除按钮触发事件
	      		remove: function (id) {
	       		 	var index = this.find_index(id);
	        		this.list.splice(index, 1);
	     		 },
				//返回id值
				next_id: function(){
					return this.list.length + 1 ;
				},
				//输入更新，下面list不会同样变化,列表list对象等于现在current对象
				set_current : function(todo){
					this.current = copy(todo);
				},
				//清空输入框
				reset_current: function(){
					this.set_current({});
				},
				find_index: function(id){
					return this.list.findIndex(function(item){
						//让列表id等于传入的id
						var items = item;
						//这里item是list的对象
						console.log('item' , items);
						return item.id == id ;
					})
				},
				toggle_complete: function(id){
					var i = this.find_index(id);
					//加入lsit的todo对象completed值来判断是否’完成completed为true‘和’未完成completed为false‘
					Vue.set(this.list[i] , 'completed' , !this.list[i].completed);
					ms.set('list' , this.list);
				}
		},
		//监听vue数据
			watch: {
			      list: {
			        deep: true,
			        handler: function (n, o) {
			          if (n) {
			            ms.set('list', n);
			          } else {
			            ms.set('list', []);
			          }
			        }
			      }
			    }
	});

}) ();