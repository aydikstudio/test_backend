
const authRouter = require('./authRouter');
const PORT = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors')
const app = express();
app.use(cors())
app.use(express.json());
app.use("/api", authRouter);


const start = () => {
    try {
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch(e) {
        console.log(e);
    }
}

start();