let express = require('express')
let router = express.Router()
let Product = require('../models/product')
let Cart = require('../config/cart')

/* GET home page. */
router.get('/', (req, res, next) => {
  Product.find({}, function (err, docs) {
    if (err) { console.log(err) }
    let productChunks = []
    let chunkSize = 3
    for (let i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize))
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks })
  })
})
router.get('/add-to-cart/:id', (req, res, next) => {
  let productId = req.params.id
  let cart = new Cart(req.session.cart ? req.session.cart : {})
  Product.findById(productId, (err, product) => {
    if (err) {
      res.redirect('/')
    }
    cart.add(product, product.id)
    req.session.cart = cart
    console.log(req.session.cart)
    res.redirect('/')
  })
})
router.get('/shopping-cart', (req, res, next) => {
  if (!req.session.cart) {
    res.render('../views/shop/shopping-cart.hbs', { products: null })
  }
  let cart = new Cart(req.session.cart)
  res.render('../views/shop/shopping-cart.hbs', { products: cart.generateArray() })
})
module.exports = router
