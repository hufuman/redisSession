redisSession
============

implement session of website using redis.

Directory: 
	1. handlers, 处理HTTP的POST事件的JS文件。
		1.1 doSession.js，处理index.html中设置和获取的请求
	2. node_modules，保存nodejs的模块的目录
		2.1 formidable，用于处理用户提交表单，也可以自动保存用户提交的文件等
		2.2 hiredis，Redis用来加速redis访问的基础库
		2.3 redis，nodejs里处理redis的模块
	3. static，用于保存一些不变的文件
	4. xapp，自己实现的路由、Session处理、文件处理等方法
	5. index.js，后台的总入口