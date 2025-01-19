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
     if (err)
         {
             throw err;
              return; }
      console.log(`Connected to MySQL Server`); 
    });
    if(connection)
    {
        console.log (connection);
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

    app.get('/clients',(req,res)=>{
    //const response =req.response;
    connection.query('SELECT * FROM Client',(err,results)=>{
        if(err)
        {
            console.error('Error executing query:', err.message);
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }
        else{
            
            console.log('Query results:', results);
            res.status(200).json(results);  
        }
    })
     });

     app.post('/addAppliance',(req,res)=>
    {
        const {contactNo, name, address,serial, companyName, Type, dateOfArrival }=req.body;
        if(!contactNo|| !name|| !address|| !serial || !companyName || !Type || !dateOfArrival)
        {
            console.log(contactNo);
            return res.status(404).send('Missing parameters');
        }
        else{
            const query = 'Call AddApplianceAndClient(?,?,?,?,?,?,?)';
            connection.query(query,[contactNo, name, address,serial, companyName, Type, dateOfArrival],(err,result)=>
            {
            if(err)
                {
                    console.log(err.message);
                    return res.status(500).send('error callling stored procedure');
                }    
                console.log('client added' ,res);
                return res.status(200).send('client and appilance added successfully!');
            }
        )
    }
    })
     // connection.close();