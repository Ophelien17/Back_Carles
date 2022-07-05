var express = require('express');
var router = express.Router();

const mongosse = require('mongoose')
const fs = require('fs');
const path = require('path')

const multer = require('multer')

const Articles = require('../models/ArticlesModel');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },

    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage});

/* GET home page. */
// router.get('/', function (req, res, next) {
//     res.render('index', {title: 'Express'});
// });

//tous les articles
router.get('/articles', async (req, res, next) => {
    await Articles.find()
        .then(articles => {
            res.status(200).json(articles)
        })
        .catch(err => {
            res.status(404)
            res.send({error: "Page doesn\'t exist"})
        })
})

//UN article (_id en param)
router.get('/article/:Id', async (req, res, next) => {
    await Articles.findOne({_id: mongosse.Types.ObjectId(req.params.Id)})
        .then(articles => {
            res.status(200).json(articles)
        })
        .catch(err => {
            res.status(404)
            res.send({error: "Page doesn\'t exist"})
        })
})

//Articles dans le carton
router.get('/articles/box', async (req, res, next) => {
    await Articles.find({carton: true})
        .then(articles => {
            res.status(200).json(articles)
        })
        .catch(err => {
            res.status(404)
            res.send({error: "Page doesn\'t exist"})
        })
})

//Articles dans le carton en fonction d'une catégorie
router.get('/articles/categoryXbox/:cat', async (req, res, next) => {
    await Articles.find({carton: true, cat: req.params.cat.toString()})
        .then(articles => {
            res.status(200).json(articles)
        })
        .catch(err => {
            res.status(404)
            res.send({error: "Page doesn\'t exist"})
        })
})

//Articles en fonction d'une catégorie
router.get('/articles/category/:cat', async (req, res, next) => {
    await Articles.find({cat: req.params.cat.toString()})
        .then(articles => {
            res.status(200).json(articles)
        })
        .catch(err => {
            res.status(404)
            res.send({error: "Page doesn\'t exist"})
        })
})

//Supprimer un article
router.delete('/article/delete/:Id', async (req, res, next) => {
    await Articles.deleteOne({_id: mongosse.Types.ObjectId(req.params.Id)})
        .then(() => {
            res.status(204).send()
        })
        .catch(err => {
            res.status(404)
            res.send({error: "Page doesn\'t exist"})
        })
})

//Ajouter un article
router.post('/article/add', async (req, res, next) => {
    const postArticle = new Articles({
        articleName: req.body.articleName,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        link: req.body.link,
        cat: req.body.cat,
        section: req.body.section,
        carton: req.body.carton,
        imgLink: req.body.imgLink,
    })
    await postArticle.save()
        .then(() => {
            res.status(201).send()
        })
        .catch(err => {
            res.status(404)
            res.send({error: "Sorry, impossible to add an article"})
        })
})

//Ajouter un article au carton
router.put('/article/addToBox/:Id', (req, res, next) => {
    Articles.updateOne({_id: mongosse.Types.ObjectId(req.params.Id)}, {$set: {carton: req.body.carton}})
        .then(() => {
            res.status(204).send()
        })
        .catch(err => {
            res.status(404)
            res.send({error: "Page doesn\'t exist"})
        })
})

//Changer quantité d'un article
router.put('/article/modifyQte/:Id', async (req, res, next) => {
    await Articles.updateOne({_id: mongosse.Types.ObjectId(req.params.Id)}, {$inc: {quantity: req.body.qte === '-' ? -1 : +1}})
        .then(() => {
            res.status(204).send()
        })
        .catch(err => {
            res.status(404)
            res.send({error: "Page doesn\'t exist"})
        })
})

//test upload img
router.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="/article/image" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="imgArticle"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
})

router.post('/article/image', upload.single('imgArticle'), (req, res) => {
    res.send("image uploaded")
})


module.exports = router;
