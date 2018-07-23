//==============
// PUERTO
// =============
process.env.PORT = process.env.PORT || 3000;

//=========
// Entorno
//==========

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//================
// Base de datos
//=================

let urlDB;
if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//================
// Vencimiento del Token
//=================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = "48h";

//================
// SEED  de autenticacion
//=================

process.env.SEED = process.env.SEED || "desarrollo";

//================
// Google Client ID
//=================

process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "817303317760-0oideiqrsp0jdhbs983mgj91dhhrq8u3.apps.googleusercontent.com";
