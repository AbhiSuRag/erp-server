//imports
const express = require('express');


//app
const app = express();


//middlewares
app.use(express.json());


//routes
app.get('/', (_, res) => {
    res.send('Hello World!');
});

//start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});