## Zarban's Grotto
### An extension for [Lavendeux](https://rscarson.github.io/lavendeux/)

[Play the game in your browser here](https://rscarson.github.io/zarban/#)

[Download Extension](https://github.com/rscarson/zarbans-grotto/releases/latest/download/zarbans_grotto.js)

Extension can be compiled using ```npm run build```, and then imported into Lavendeux for use with the parser.

It exposes the zarban(<option number>) function and <number> @zarban decorator

Use it by typing `start @zarban` and following the prompts given.

It can also be run for the web, like so:
```html
    <div id="zarban_container"></div>
    <script type="module" src="../dist/zarbans_grotto.js"></script>
    <script type="module" type="text/javascript">
      const container = document.getElementById('zarban_container');
      new Zarban.WebPlayer(container);
    </script>
```

Or run locally with ```npm run play```

The actual game story, player status markers, and items are contained entirely in the data directory, and the engine can be used for entirely different stories easily.
