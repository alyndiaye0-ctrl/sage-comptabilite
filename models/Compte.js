const mongoose = require('mongoose');

const compteSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  libelle: { type: String, required: true },
  classe: { type: String, enum: ['1', '2', '3', '4', '5', '6', '7', '8'], required: true },
  type: { type: String, enum: ['actif', 'passif', 'charge', 'produit'], required: true },
  soldeDebit: { type: Number, default: 0 },
  soldeCredit: { type: Number, default: 0 },
  devise: { type: String, default: 'XOF' },
  actif: { type: Boolean, default: true },
  entreprise: { type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise', required: true },
  dateCreation: { type: Date, default: Date.now },
  dateModification: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Compte', compteSchema);
