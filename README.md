# Duck Pond-ering

*Game hosted at https://richteaman.github.io/duck-game/*

A pond with some hungry and slightly melancholy ducks. Built for [Untitled Game Jam](https://itch.io/jam/untitled-game-jam-37).

This game is pond simulator. Ducks swim about, looking for food and nesting opportunities. Calling this game is a bit of a stretch,
but more of a prototype of an isometric web game with a 3D asset development pipeline.


## Installing Pillow for render script

Navigate to installed Blender directory, then into the python/bin directory:

```bash
./python.exe ../lib/ensurepip
./python.exe ../lib/site-packages/pip install pillow --user
```
## Credits

### Tools

* Built using [Phaser 3](https://phaser.io/phaser3).
* Duck models created in [Blender](https://www.blender.org/).
* Map created in [Tiled](https://www.mapeditor.org/).
* Image editing in [Paint.net](https://www.getpaint.net/).
* Sound editing in [Audacity](https://www.audacityteam.org/).

### Sprites

* Tilesprites from Kenney, [Isometric Landscape](https://www.kenney.nl/assets/isometric-landscape) and the [Food Kit](https://www.kenney.nl/assets/food-kit).

### Audio

* Many thanks to my friends for offering their quacky voice talents.
* Duckling noises were extracted from this adorable video: https://www.youtube.com/watch?v=PC9Wyd2sBS0.
* Ambient nature noises courtesy of BurghRecords: https://www.youtube.com/watch?v=sexUXJPljH4.

## Running render script

```bash
blender -b duck.blend -P render.py
```

## React

*TODO: The following is from the React template. Something should be done with this.*

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
