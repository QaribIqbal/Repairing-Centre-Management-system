import express from 'express';
import mysql from 'mysql2';
const app = express();
app.use(express.json());

const port = 3000;
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'repairing_centre'
    }
)
connection.connect((err) => {
    if (err) {
        throw err;
        return;
    }
    console.log(`Connected to MySQL Server`);
});
if (connection.state === 'disconnected') {
    connection.connect();
}

if (connection) {
    console.log(connection);
}
// if(connection){
//     connection.query('SELECT * FROM Client', (err, results) => {
//         if (err) {
//           console.error('Error executing query:', err.message);
//           return;
//         }
//         console.log('Query results:', results);
//       });
//     }

app.get('/clients', (req, res) => {
    //const response =req.response;
    connection.query('SELECT * FROM Client', (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }
        else {

            console.log('Query results:', results);
            res.status(200).json(results);
        }
    })
});
app.post('/addCentre', (req, res) => {
    const { Cid } = req.body;
    if (!Cid) {
        console.log(Cid);
        res.status(404).send("Centre Id can't be empty");
    }
    else {
        try {
            connection.query(`insert into Centre (Cid) values (Cid);`);
            res.status(200).send(Cid);
        }
        catch (e) {
            console.log(e.message);
            res.status(500).send('Failed Query!');
        }
    }

})

app.post('/addStore', (req, res) => {
    const { Sid } = req.body;
    if (!Sid) {
        console.log(Sid);
        res.status(404).send("Store Id can't be empty");
    }
    else {
        try {
            connection.query('Insert into Store values (Sid);');
            res.status(200).send(Sid);
        }
        catch (e) {
            console.log(e.message);
        }
    }
})

//  app.get('/Appliances',(req,res)=>
// {
//     connect.query('select a.* from appliance as a join Centre as c on a.Cid==a.Cid')
// })
app.post('/addAppliance', (req, res) => {
    const { contact_No, name, address, serial_No, companyName, Type, dateOfArrival, Sid, Cid } = req.body;
    if (!contact_No || !name || !address || !serial_No || !companyName || !Type || !dateOfArrival || !Sid || !Cid) {
        console.log(contact_No);
        return res.status(404).send('Missing parameters');
    }
    else {
        const query = 'Call AddApplianceAndClient(?,?,?,?,?,?,?,?,?)';
        try {

            connection.query(query, [contact_No, name, address, serial_No, companyName, Type, dateOfArrival, Sid, Cid])
            console.log('client added', res);
            return res.status(200).send('client and appilance added successfully!');
        }
        catch (e) {
            console.log(err.message);
            return res.status(500).send('error callling stored procedure');
        }
    }

}
)

//    connection.close();