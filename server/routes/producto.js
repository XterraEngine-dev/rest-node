const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

let Producto = require("../models/producto");
let app = express();

/****
 * Obtener todos los productos
 ****/

app.get("/productos", (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, producto) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        producto
      });
    });
});

/****
 * Obtener productos por ID
 ****/

app.get("/productos/:id", (req, res) => {
  let id = req.params.id;
  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!productoDB) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "El producto no existe"
          }
        });
      }

      res.json({
        ok: true,
        producto: productoDB
      });
    });
});

/****
 * Buscar productos
 ****/

app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino;

  let regex = new RegExp(termino, 'i');

  Producto.find({ nombre: regex })
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        productos
      });
    });
});

/****
 * Agregar productos
 ****/

app.post("/productos", verificaToken, (req, res) => {
  let body = req.body;

  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    res.status(201).json({
      ok: true,
      producto: productoDB
    });
  });
});

/****
 * Editar productos
 ****/

app.put("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.json({
        ok: false,
        err
      });
    }

    if (!productoDB) {
      return res.json({
        ok: false,
        err: {
          message: "El producto no existe"
        }
      });
    }

    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUni;
    productoDB.categoria = body.categoria;
    productoDB.disponible = body.disponible;
    productoDB.descripcion = body.nombre;

    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        producto: productoGuardado
      });
    });
  });
});

/****
 * Borrar productos
 ****/

app.delete("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (err) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "EL producto no existe"
        }
      });
    }

    productoDB.disponible = false;
    productoDB.save((err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        producto: productoBorrado,
        mensaje: "Producto borrado"
      });
    });
  });
});

module.exports = app;
