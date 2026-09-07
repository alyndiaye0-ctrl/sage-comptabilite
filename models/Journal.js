const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  libelle: { type: String, required: true },
  type: { type: String, enum: ['VE', 'AC', 'TR', 'OD', 'PR'], required: true },
  // VE: Ventes, AC: Achats, TR: Trésorerie, OD: Opérations Diverses, PR: Paie
  description: String,
  compte: { type: mongoose.Schema.Types.ObjectId, ref: 'Compte' },
  numeroPiece: { type: Number, default: 0 },
  actif: { type: Boolean, default: true },
  entreprise: { type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise', required: true },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journal', journalSchema);
