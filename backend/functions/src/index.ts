import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://firestore-grafica-6dc68.firebaseio.com"
});

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.status(200).json({
      mensaje: 'Hello mundo desde funciones de firebase'
  });
});

export const getGoty = functions.https.onRequest( async (request, response) => {
    const goryRef = db.collection('goty');
    const docSnap = await goryRef.get();
    const juegos  = docSnap.docs.map(doc => doc.data());

    response.json(juegos);
});

//express
const app = express();
app.use(cors({origin:true}));

app.get('/goty', async (req, res) => {
    const goryRef = db.collection('goty');
    const docSnap = await goryRef.get();
    const juegos  = docSnap.docs.map(doc => doc.data());

    res.json(juegos);
});

app.post('/goty/:id', async (req,res) => {
    const id = req.params.id;
    const gameRef = db.collection('goty').doc(id);
    const gameSnap = await gameRef.get();

    if(!gameSnap.exists){
        res.status(404).json({
            Ok: false,
            mensaje: 'No exite un juego con el ID ' + id
        });
    }else{
        const antes = gameSnap.data() || { votos: 0 };
        // tslint:disable-next-line: no-floating-promises
        gameRef.update({
            votos: antes.votos + 1
        });

        res.json({
            ok: true,
            mensaje: `Gracias por tu voto a ${ antes.name }`
        });
    }
});

app.post('/addPeliculas', (req,res) => {
    const gameRef  = db.collection('goty');  
    const gameSnap = gameRef.add(req.body).then(()=> {
        res.json({
            Ok: true,
            mensaje: 'Se guardo el juego' + req.body.name
        })
    }).catch({
        res.status(404).json({
            Ok: false,
            mensaje: 'Error al crear el juego' + req.body.name
        })
    });
});



export const api = functions.https.onRequest(app);
