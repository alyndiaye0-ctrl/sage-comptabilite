const mongoose = require('mongoose');

const ecritureSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  journal: { type: mongoose.Schema.Types.ObjectId, ref: 'Journal', required: true },
  dateEcriture: { type: Date, required: true },
  dateExecution: { type: Date, default: Date.now },
  libelle: { type: String, required: true },
  reference: String,
  lignes: [{
    compte: { type: mongoose.Schema.Types.ObjectId, ref: 'Compte', required: true },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    libelle: String
  }],
  etat: { type: String, enum: ['brouillon', 'validé', 'archivé'], default: 'brouillon' },
  montantTotal: { type: Number, required: true },
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entreprise: { type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise', required: true },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ecriture', ecritureSchema);
