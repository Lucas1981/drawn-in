# drawn-in

Hosted version: http://zzp-online-marketing.nl/drawn-in/#/

This is a hackathon-level attempt to get at a proof of concept for a product where UX/UI designers can both draw a design quickly and add prototype controls, navigating from one state to the next. It is built with Vue and Bootstrap Vue for the controls, relying on the npm package `canvas-free-drawing` to take care of the drawing part.

So what does it do? You can add canvas frames on which you can draw, with measurements suited to a device (generic Apple products for now). On these canvases you can draw freely and also draw some buttons or other things that should have actions. But, drawings themselves cannot do anything. That is why there is another layer added, where you can manage areas that a user can click on to go from one frame to another. If you'd have three frames for example, with a "YES / NO" drawing on the first one, you can create two actionable areas for the first frame, one jumping to the state where the input was "YES", let's say frame 2 where it reads "You said yes!" and the other jumping to the state where the input was "NO", let's say frame 3, where it reads "You said no!". It's a very easy goto system that adds interactivity to a quickly drawn set of states. You will of course have to press "Play" in the end to serve this interactively to a user - for instance a frontend developer or product manager. It's very much meant for two people sitting on a table with an iPad who quickly want to get an idea about where their product might go, enabling them to quickly scribble up a prototype that they can then talk about.

How does it work? Right now it is really one big view that takes care of everything, the `Home.vue` app. There is an about, but nothing is really in there yet. The routing works, but it might turn out that at this stage that was a bit redundant. Here you can add a new frame or remove an existing one, or even start all over again by clearing all the frames. It's managed in the Vue screen as an array on `this.canvases`. The entries all have a unique `id` property so that when removing one the Vue functionality won't just pop the last one off the stack but actually will target the proper one based on its `id` to remove it. All the entries also have a `actionables` property that tracks all the clickable areas in the playback mode that a user can click on. You can add an actionable to a frame by toggling the `Drawing mode`. This will bring up an `svg` element with a transparent clickable rectangle (it just swaps the z-index of the canvas and the svg), and by clicking on it you can create a new actionable. When you click on the actionable, you can specify which frame it should go to, which will be stored in the `goto` property of the actionable. Each actionable can also be removed. I considered using the `d3` library to manage the actionable areas, but it seemed a bit overkill. Might work if the actionable areas need to be adjustible in x/y/width/height, in which case they can be changed for a custom component in stead of using the `rect` elements.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
# drawn-in
