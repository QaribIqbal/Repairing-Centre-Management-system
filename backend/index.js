import express from "express";
import mysql from "mysql2";
const app = express();
import cors from "cors";
app.use(cors());
app.use(express.json());
const port = 3000;
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "repairing_centre",
});
connection.connect((err) => {
  if (err) {
    throw err;
    return;
  }
  console.log(`Connected to MySQL Server`);
});
if (connection.state === "disconnected") {
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
app.get('/newCentreNum', (req, res) => {
  connection.query(`select Count(Cid) as num from Centre`, (err, result) => {
    if (err) {
      console.log(`Query failed : ${err.message}`);
      return res.status(500).send("Query failed!");
    }
    const count=result[0].num;
    return res.status(200).send({num:count});
  });
});
app.get ('/newStoreNum',(req,res)=>{
    connection.query(`select Count(Sid) as num from Store`,(err,result)=>{
        if(err){
            console.log(`Query failed : ${err.message}`);
            return res.status(500).send("Query failed!");
        }
        const count=result[0].num;
        return res.status(200).send({num:count});
    })
})
app.get('/newReceiptNum',(req,res)=>{
    connection.query(`select Count(R_No) as num from receipt`,(err,result)=>{
        if(err){
            console.log(`Query failed : ${err.message}`);
            return res.status(500).send("Query failed!");
        }
        const count=result[0].num;
        return res.status(200).send({num:count});
    })

})
app.get("/clients", (req, res) => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err.message);
      res.status(500).json({ error: "Database connection error" });
      return;
    }

    connection.query("SELECT * FROM client", (error, results) => {
      if (error) {
        console.error("Error executing query:", error.message);
        res.status(500).json({ error: "Error fetching data" });
        return;
      }
      res.status(200).send(results);
    });
  });
});
app.get("/appliances", (req, res) => {
  connection.query("select * from appliance;", (err, result) => {
    if (err) {
      console.log(`Query failed : ${err.message}`);
      return res.status(500).send("Query failed!");
    }

    return res.status(200).send(result);
  });
});
app.get("/getAppliance/:Cid", (req, res) => {
  const { Cid } = req.params;
  console.log(Cid);
  const query = `SELECT 
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
  connection.query(query, [Cid], (err, result) => {
    if (err) {
      console.log(`Query Failed : ${err.message}`);
      return res.status(500).send("Query Failed!");
    }
    return res.status(200).send(result);
  });
});
app.get("/storeAppliances/:Sid", (req, res) => {
  const { Sid } = req.params;
  if (!Sid) {
    return res.status(500).send("store Id can not be empty!");
  }
  try {
    const query = `Select s.Sid as Store_Number,a.serial_No,a.Type,a.companyName,DATE_FORMAT(a.dateOfArrival, '%d-%m-%Y') AS dateOfArrival,c.contact_No,c.Name,c.address
from store as s
join appliance as a on s.Sid=a.Sid
join client as c on c.contact_No=a.contact_No
having Sid=?;`;
    connection.query(query, [Sid], (err, result) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      return res.status(200).send(result);
    });
  } catch (e) {
    console.log(`unexpected error : ${e.message}`);
  }
});

app.get("/receipt/:contact_No", (req, res) => {
  try {
    const { contact_No } = req.params;
    if (!contact_No) {
      console.log("There must be a contact number to fetch receipt!");
      return res
        .status(404)
        .send("There must be a contact number to fetch receipt!");
    }
    const query = `select * from client as c
            join receipt as r on r.contact_No=c.contact_No
            where c.contact_No=?;`;
    connection.query(query, [contact_No], (err, result) => {
      if (err) {
        console.log(`Query failed : ${err.message}`);
        return res.status(500).send("query Failed!");
      }
      return res.status(200).send(result);
    });
  } catch (e) {
    console.log("unexpected error!");
    console.log(e.message);
  }
});

app.get("/feedbacks/:Cid", (req, res) => {
  const { Cid } = req.params;
  if (!Cid) {
    return res.status(500).send("Cid can't be empty!");
  }
  const query = "select * from feedback where Cid=?;";
  connection.query(query, [Cid], (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send("Failed query!");
    }
    return res.status(200).send(result);
  });
});
app.get("/Delivery/:contact_No", (req, res) => {
  const { contact_No } = req.params;
  if (!contact_No) {
    return res.status(500).send("Delivery Id can not be empty!");
  }
  const query = `call getDelivery(?);`;
  connection.query(query, [contact_No], (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send("FailedQuery!");
    }
    return res.status(200).send(result[0]);
  });
});

app.post("/assignDelivery/:Cid/:Did/:contact_No", (req, res) => {
  const { Cid, Did, contact_No } = req.params;
  if (!Cid || !Did || !contact_No) {
    return res.status(500).send("conatact number can not br empty!");
  }
  const query = "call assignDelivery(?,?,?);";
  connection.query(query, [Cid, Did, contact_No], (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send("Failed query!");
    }
    return res.status(200).send("Delivery assigned successfully!");
  });
});
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
app.post("/giveFeedback", (req, res) => {
  const { Fid, Cid, clientName, comment } = req.body;
  if (!Fid || !Cid || !clientName || !comment) {
    return res.status(500).send("Missing parameters");
  }
  const query =
    "insert into feedback (Fid,Cid,clientName,comment) values (?,?,?,?)";
  connection.query(query, [Fid, Cid, clientName, comment], (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send("Failed query!");
    }
    return res.status(200).send("Feedback added successfully!");
  });
});

app.post("/addCentre", (req, res) => {
  const { Cid } = req.body;
console.log(Cid);
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
        return res.status(500).send("Failed Query!");
      }
      console.log("Query Successful:", result);
      return res.status(200).json({message:'Centre ID ${Cid} added successfully!',success:true});
    });
  } catch (e) {
    console.error("Unexpected Error:", e.message);
    return res.status(500).send("An unexpected error occurred!");
  }
});

app.post("/addStore", (req, res) => {
  const { Sid } = req.body;
  if (!Sid) {
    console.log(Sid);
    return res.status(404).send("Store Id can't be empty");
  } else {
    try {
      const query = `Insert into Store(Sid) values (?);`;
      connection.query(query, [Sid], (err, result) => {
        if (err) {
          console.log(`Querry error : ${err.message}`);
          return res.status(500).send("Failed Query!");
        }

        console.log("Query successful", result);
        return res.status(200).send(`Sid ${Sid} added successfully!`);
      });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("unexpected error");
    }
  }
});

//  app.get('/Appliances',(req,res)=>
// {
//     connect.query('select a.* from appliance as a join Centre as c on a.Cid==a.Cid')
// })
app.post("/addAppliance", (req, res) => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err.message);
      res.status(500).json({ error: "Database connection error" });
      return;
    }

    const {
      contact_No,
      name,
      address,
      serial_No,
      companyName,
      Type,
      dateOfArrival,
      Sid,
      Cid,
    } = req.body;
    // if (
    //   !contact_No ||
    //   !name ||
    //   !address ||
    //   !serial_No ||
    //   !companyName ||
    //   !Type ||
    //   !dateOfArrival ||
    //   !Sid ||
    //   !Cid
    // ) {
    //   console.log(req.body);
    //   return res.status(404).send("Missing parameters");
    // } else {
      const query = "Call AddApplianceAndClient(?,?,?,?,?,?,?,?,?)";
      try {
        console.log("client added", contact_No);
        connection.query(
          query,
          [
            serial_No,
            companyName,
            Type,
            dateOfArrival,
            Cid,
            Sid,
            name,
            contact_No,
            address,
          ],
          (err, result) => {
            if (err) {
              console.log(err.message);
              return res.status(500).send("Cannot add appliance!");
            }
            return res
              .status(200)
              .json({message:'client and appilance added successfully!',success:true});
          }
        );
      } catch (e) {
        console.log(err.message);
        return res.status(500).send("Unexpected error");
      }
    }
  // }
);
});
app.post("/generateReceipt", (req, res) => {
  const { R_No, contact_No, amount } = req.body;
  if (!R_No || !contact_No || !amount) {
    console.log(R_No, contact_No, amount);
    return res.status(404).send("Missing parameters");
  }
  const query = "insert into receipt (R_No,contact_No,amount) values (?,?,?)";
  connection.query(query, [R_No, contact_No, amount], (err, result) => {
    if (err) {
      console.log(err.message);
      console.log("Failed to generate receipt");
      return res.status(500).send("Query Failed!");
    }
    return res.status(200).send("Receipt generated Successfully!");
  });
});

//    connection.close();
