# Counting Crows - INFOMCRWS
*Web hosted boid simulation of animated crows*

## How to set up

To setup the project, follow the next steps:

- Make sure ```npm``` is installed by running the following command:
```
npm --version
```

- Install ```local-web-server``` for testing purposes by running the following command:
```
npm install -g local-web-server
```

- Run the web-server by running the following command:
```
ws --spa index.html
```

- Web-server should be running locally.
    If the site gives an alert, your browser doesn't support WebGL. **CHANGE BROWSER!**

## Todo list

- [X] Get something rendered 
- [X] Read in an .obj file
- [X] Render a 3D model
- [ ] Find out how to animate a 3D model in WebGL
- [X] Read in .hlsl files, instead of coding them within the .js files
- [ ] Make boid position/velocity shader
- [ ] Implement boids structure with the shaders
- [ ] Find a way to create, update, and pass octree structure
- [ ] BURDS!