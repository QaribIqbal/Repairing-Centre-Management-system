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

// if(connection){
//     connection.query('SELECT * FROM Client', (err, results) => {
//         if (err) {
//           console.error('Error executing query:', err.message);
//           return;
//         }
//         console.log('Query results:', results);
//       });
//     }

// app.get('/clients', (req, res) => {
//     try {
//         connection.query('SELECT * FROM client', (error, results) => {
//             if (error) {
//                 console.error('Error executing query:', error.message);
//                 res.status(500).json({ error: 'Error fetching data' });
//                 return;
//             }
//             res.status(200).send(results);
//         });
//     } catch (e) {
//         console.error('Unexpected error:', e.message);
//         res.status(500).json({ error: 'Unexpected error fetching data' });
//     }
// });
app.get('/clients', (req, res) => {
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
            res.status(500).json({ error: 'Database connection error' });
            return;
        }

        connection.query('SELECT * FROM client', (error, results) => {
            if (error) {
                console.error('Error executing query:', error.message);
                res.status(500).json({ error: 'Error fetching data' });
                return;
            }
            res.status(200).send(results);
        });
    });
});
app.get('/appliances',(req,res)=>{
   
        connection.query('select * from appliance;',(err,result)=>{
            if(err)
            {
                console.log(`Query failed : ${err.message}`);
                return res.status(500).send('Query failed!');
            }

            return res.status(200).send(result);
        });  
})
app.get('/getAppliance/:Cid',(req,res)=>{
        const{Cid}=req.params;
    const query=`SELECT 
    serial_No,
    Type,
    companyName,
    DATE_FORMAT(dateOfArrival, '%d-%m-%Y') AS dateOfArrival,
    Sid,
    Cid,
    contact_No
FROM 
    appliance
 where Cid=(?)`;
    connection.query(query,[Cid],(err,result)=>{
        if(err)
        {
            console.log(`Query Failed : ${err.message}`);
            return res.status(500).send('Query Failed!');
        }
        return res.status(200).send(result);
    })
}
)
app.get('/storeAppliances/:Sid',(req,res)=>{
const {Sid}=req.params;
if(!Sid)
{
    return res.status(500).send('store Id can not be empty!');
}
try{
    const query=`Select s.Sid as Store_Number,a.serial_No,a.Type,a.companyName,DATE_FORMAT(a.dateOfArrival, '%d-%m-%Y') AS dateOfArrival,c.contact_No,c.Name,c.address
from store as s
join appliance as a on s.Sid=a.Sid
join client as c on c.contact_No=a.contact_No
having Sid=?;`;
connection.query(query,[Sid],(err,result)=>{
    if(err)
    {
        return res.status(500).send(err.message);
    }
    return res.status(200).send(result);
})
}
catch(e)
{
    console.log(`unexpected error : ${e.message}`);
}
})
// app.post('/addCentre', (req, res) => {
//     const { Cid } = req.body;
//     if (!Cid) {
//         console.log(Cid);
//         res.status(404).send("Centre Id can't be empty");
//     }
//     else {
//         try {
//             connection.query(`insert into Centre (Cid) values (Cid);`);
//             res.status(200).send(Cid);
//         }
//         catch (e) {
//             console.log(e.message);
//             res.status(500).send('Failed Query!');
//         }
//     }

// })

app.post('/addCentre', (req, res) => {
    const { Cid } = req.body;

    // Check if Cid is provided
    if (!Cid) {
        console.log("Centre ID is empty:", Cid);
        return res.status(404).send("Centre ID can't be empty");
    }

    // Attempt to insert the Cid into the Centre table
    try {
        const query = `INSERT INTO Centre (Cid) VALUES (?);`;
        connection.query(query, [Cid], (err, result) => {
            if (err) {
                console.error("Query Error:", err.message);
                return res.status(500).send('Failed Query!');
            }
            console.log("Query Successful:", result);
            return res.status(200).send(`Centre ID ${Cid} added successfully!`);
        });
    } catch (e) {
        console.error("Unexpected Error:", e.message);
        return res.status(500).send('An unexpected error occurred!');
    }
});


app.post('/addStore', (req, res) => {
    const { Sid } = req.body; 
    if (!Sid) {
        console.log(Sid);
        return res.status(404).send("Store Id can't be empty");
    }
    else {
        try {
            const query = `Insert into Store(Sid) values (?);`;
            connection.query(query, [Sid], (err, result) => {
                if (err) {
                    console.log(`Querry error : ${err.message}`);
                    return res.status(500).send('Failed Query!');
                }

                console.log('Query successful', result);
                return res.status(200).send(`Sid ${Sid} added successfully!`);

            });
        }
        catch (e) {
            console.log(e.message);
            return res.status(500).send("unexpected error");
        }
    }
})

//  app.get('/Appliances',(req,res)=>
// {
//     connect.query('select a.* from appliance as a join Centre as c on a.Cid==a.Cid')
// })
app.post('/addAppliance', (req, res) => {
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
            res.status(500).json({ error: 'Database connection error' });
            return;
        }

        const { contact_No, name, address, serial_No, companyName, Type, dateOfArrival, Sid, Cid } = req.body;
        if (!contact_No || !name || !address || !serial_No || !companyName || !Type || !dateOfArrival || !Sid || !Cid) {
            console.log(contact_No);
            return res.status(404).send('Missing parameters');
        }
        else {
            const query = 'Call AddApplianceAndClient(?,?,?,?,?,?,?,?,?)';
            try {
                console.log('client added', contact_No);
                connection.query(query, [serial_No, Type, companyName, dateOfArrival, Cid, Sid, name, contact_No, address],(err,result)=>{
                    if(err)
                    {
                        console.log(err.message);
                        return res.status(500).send("Cannot add appliance!");
                    }
                    return res.status(200).send('client and appilance added successfully!');
                })
            }
            catch (e) {
                console.log(err.message);
                return res.status(500).send('Unexpected error');
            }
        }
    })

}
)

//    connection.close();