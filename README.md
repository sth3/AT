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