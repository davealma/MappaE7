import express from 'express';
const app = express()
const PORT = 5001;

const systems = {
  navigation: "NAV-01",
  communications: "COM-02",
  life_support: "LIFE-03",
  engines: "ENG-04",
  deflector_shield: "SHLD-05"
};

let systemToRepair;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/phase-change-diagram', (req, res) => {
    const pressure = req.query.pressure;
    console.log('presure: ', pressure);

    const liquidSlope = (10 - 0.05) / (.0035 - 0.00105);
    console.log('liquidSlope: ', liquidSlope)
    const specific_volume_liquid = ((pressure - 10) / liquidSlope) + 0.0035;

    const vaporSlop = (0.05 - 10) / (30 - 0.0035);
    console.log('vaporSlop: ', vaporSlop)
    const specific_volume_vapor = ((pressure - 10) / vaporSlop) + 0.0035;
    console.log('---------------------------')
    res.json({
        specific_volume_liquid,
        specific_volume_vapor
    });
})

app.get('/status', (req, res) => {
    const idx = Math.floor(Math.random() * 5);
    console.log('idx', idx)
    systemToRepair = Object.keys(systems)[idx];
    console.log(systemToRepair)
    res.json({
        "damaged_system": systemToRepair
    });
});

app.get('/repair-bay', (req, res) => {
    console.log('repair-bay', systemToRepair);
    if (!systemToRepair) {
        return res.redirect('/status')
    }
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(`
        <!DOCTYPE html>
            <html>
            <head>
                <title>Repair</title>
            </head>
            <body>
            <div class="anchor-point">${systems[systemToRepair]}</div>
            </body>
            </html>    
    `));
});

app.post('/teapot', (req, res) => {
    res.status(418).send('I \'m a teapot');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})


/*


const server = createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Repair</title>
        </head>
        <body>
        <div class="anchor-point">ENG-04</div>
        </body>
        </html>    
    `);
});


server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
*/