const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get('/api/accounts', (req, res) =>{
    console.log(req.query);
    db('accounts')
    .orderBy((req.query.sortby ? req.query.sortby : "id"),
     (req.query.sortdir ? req.query.sortdir : "asc"))
    .limit( req.query.limit ? req.query.limit : 100)
    .then(response =>{
        res.json(response);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({message: 'Failed to get account'});
    })
});

server.get('/api/accounts/:id', (req, res) =>{
    const id = req.params.id;

    db('accounts').where({id: id})
    .then(account =>{
        if(account.length){
            res.json(account);
        } else {
            res.status(404).json({message: 'Couldnt find account with given id'});
        }
    })
    .catch(err =>{
        res.status(500).json({message: 'Failed to get account'})
    })
})

server.get('/api/accounts', (req, res) =>{
    const id = req.params.id;

    db('accounts').where({id: id})
    .then(account =>{
        if(account.length){
            res.json(account);
        } else {
            res.status(404).json({message: 'Couldnt find account with given id'});
        }
    })
    .catch(err =>{
        res.status(500).json({message: 'Failed to get account'})
    })
})

server.post('/api/accounts', (req, res) =>{
    const params = req.body;
    if(params.name === undefined || params.budget === undefined){
        res.status(400).json({message: 'Please provide valid body for adding an account'})
    }
    db('accounts').insert({ name: params.name, budget: params.budget})
    .then(response =>{
        res.json(response);
    })
    .catch(err =>{
        res.status(500).json({message: 'Failed to add account'})
    })
})

server.put('/api/accounts/:id', (req, res) =>{
    const params = req.body;
    const id = req.params.id;
    if(params.name === undefined || params.budget === undefined){
        res.status(400).json({message: 'Please provide valid body for adding an account'})
    }
    db('accounts').where({id: id}).update({name: params.name, budget: params.budget})
    .then(account =>{
        if(account === 1){
            res.json({name: params.name, budget: params.budget});
        } else {
            res.status(404).json({message: 'Couldnt find account with given id'});
        }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({message: 'Failed to update account'})
    })
})

server.use(express.json());

module.exports = server;
