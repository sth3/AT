## Autorun

### Qckwinsvc [GitHub](https://github.com/tallesl/qckwinsvc)

```cmd 
npm install -g qckwinsvc
```

### Create 2 services
1. Server
```cmd
>qckwinsvc
prompt: Service name: at-server
prompt: Service description: 
prompt: Node script path: C:\(full path to repository)\ATserver\server.js
prompt: Should the service get started immediately? (y/n): y 
```

2. Frontend
```cmd
>qckwinsvc
prompt: Service name: at-frontend
prompt: Service description: 
prompt: Node script path: C:\(full path to repository)\AT\AT\autorun.js
prompt: Should the service get started immediately? (y/n): y 
```

D:\Web-app\AT\server\server.js


qckwinsvc --name "at-server" --description "" --script "D:\Web-app\AT\server\server.js" --startImmediately
qckwinsvc --name "at-frontend" --description "" --script "D:\Web-app\AT\AT\autorun.js" --startImmediately
qckwinsvc --uninstall --name "at-server" --script "D:\Web-app\AT\server\server.js" 
qckwinsvc --uninstall --name "at-frontend" --script "D:\Web-app\AT\AT\autorun.js"

qckwinsvc2 install name="at-server" description="AT" path="D:\Web-app\AT\server\server.js" args="-a -c" now
qckwinsvc2 install name="at-server" description="AT" path="C:\Users\Lenovo\Desktop\AT\Projects\VisualStudioCode\AppAT\AT\server\server.js" args="-a -c" now
qckwinsvc2 install name="at-frontend" description="AT" path="D:\Web-app\AT\AT\autorun.js" args="-a -c" now
qckwinsvc2 uninstall name="at-server" 
qckwinsvc2 uninstall name="at-frontend"

C:\Users\Lenovo\Desktop\AT\Projects\VisualStudioCode\AppAT\AT\server\server.js