const express = require('express')
const app = express()
const path = require('path')


// include and initialize the rollbar library with your access token
let Rollbar = require('rollbar')
let rollbar = new Rollbar({
  accessToken: 'c34c85ac3847457c9ca0f9c34368aaad',
  captureUncaught: true,
  captureUnhandledRejections: true,
})
/* five avaliable rollbar methods 
rollbar.debug();
rollbar.warning(); less than the other two not as bad as an error
rollbar.error(); not as bad as critical but needs fixing 
rollbar.critical(); cannot even use the app 
*/

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.use(express.json())

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    rollbar.info('someone got on my app');
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students);
})

app.post('/api/students', (req, res) => {
   let {name} = req.body;
   rollbar.warning('someone added a student');

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
           res.status(400).send('You must enter a name.')
       } else {
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log('my bobbios function did not work at all!') // logs to the terminal 
       rollbar.critical('my bobbios function did not work'); // logs to the rollbar browser 
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    rollbar.critical('someone deleted a name')
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
