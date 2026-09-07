const mongoose = require('mongoose');

const tiersSchema = new mongoose.Schema({
  type: { type: String, enum: ['client', 'fournisseur', 'autre'], required: true },
  nom: { type: String, required: true },
  prenom: String,
  email: String,
  telephone: String,
  adresse: String,
  codePostal: String,
  ville: String,
  pays: String,
  numeroPiece: String,
  numeroIFU: String,
  compteClient: { type: mongoose.Schema.Types.ObjectId, ref: 'Compte' },
  compteFournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'Compte' },
  solde: { type: Number, default: 0 },
  limiteCredit: { type: Number, default: 0 },
  actif: { type: Boolean, default: true },
  entreprise: { type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise', required: true },
  dateCreation: { type: Date, default: Date.now },
  dateModification: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tiers', tiersSchema);
