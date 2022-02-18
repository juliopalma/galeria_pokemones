const express = require('express');
const yargs = require('yargs');
const Jimp = require('jimp');

const app = express();
const fs = require('fs');
const axios = require('axios');
app.use(express.static('static'));

app.get('/procesar', async(req, res) => {
    let archivo = req.query.foto;
    const imagen = await Jimp.read(archivo);
    await imagen.resize(400, Jimp.AUTO).rgba(false).quality(60).grayscale().writeAsync('img/newImg.jpg')

    fs.readFile('img/newImg.jpg', (err, imagen) => {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' })
        res.end(imagen)
    })

});

let puerto = 8007;

app.get('/pokemones', async(req, res) => {
    const pokeData = await axios.get("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=150");
    const pokemones = pokeData.data.results;

    Promise.all([

        axios.get(pokemones[0].url),
        axios.get(pokemones[1].url),
        axios.get(pokemones[2].url),
        axios.get(pokemones[3].url),
        axios.get(pokemones[4].url),
        axios.get(pokemones[5].url),
        axios.get(pokemones[6].url),
        axios.get(pokemones[7].url),
        axios.get(pokemones[8].url),
        axios.get(pokemones[9].url),
        axios.get(pokemones[10].url),
        axios.get(pokemones[11].url),
        axios.get(pokemones[12].url),
        axios.get(pokemones[13].url),
        axios.get(pokemones[14].url)

    ]).then(function(infoPokemones) {

        const listPokemones = []

        for (poke of infoPokemones) {

            listPokemones.push({
                //Estatura: poke.data.height,
                //Peso: poke.data.weight,
                //URL: poke.data.species.url,
                img: poke.data.sprites.front_default,
                nombre: poke.data.name
            })
        }

        res.send(listPokemones);
    }).catch((error) => {
        console.log('Error', error);
    })


});


yargs.command(
    'start',
    'comando para echar a correr el servidor', {
        key: {
            describe: 'clave secreta para iniciar el servidor',
            demand: true,
            alias: 'k'
        }
    },
    function(args) {

        if (args.key != '123') {
            console.log('clave incorrecta')
            return 1;
        };

        app.listen(puerto, () => {
            console.log(`servidor corriendo en el puerto ${puerto}`);
        });

    }
).help().argv;