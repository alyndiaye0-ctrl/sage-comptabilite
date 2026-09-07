const Ecriture = require('../models/Ecriture');
const Compte = require('../models/Compte');
const Journal = require('../models/Journal');

exports.creerEcriture = async (req, res) => {
  try {
    const { journal, dateEcriture, libelle, lignes, utilisateur, entreprise } = req.body;
    
    // Vérifier l'équilibre
    const totalDebit = lignes.reduce((sum, l) => sum + (l.debit || 0), 0);
    const totalCredit = lignes.reduce((sum, l) => sum + (l.credit || 0), 0);
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return res.status(400).json({ message: 'L\'écriture n\'est pas équilibrée' });
    }
    
    // Générer le numéro d'écriture
    const journalObj = await Journal.findById(journal);
    journalObj.numeroPiece += 1;
    await journalObj.save();
    
    const numero = `${journalObj.code}${journalObj.numeroPiece.toString().padStart(6, '0')}`;
    
    const ecriture = new Ecriture({
      numero,
      journal,
      dateEcriture,
      libelle,
      lignes,
      montantTotal: totalDebit,
      utilisateur,
      entreprise
    });
    
    await ecriture.save();
    res.status(201).json(ecriture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listerEcritures = async (req, res) => {
  try {
    const { entreprise, journal, dateDebut, dateFin } = req.query;
    let query = { entreprise };
    
    if (journal) query.journal = journal;
    if (dateDebut || dateFin) {
      query.dateEcriture = {};
      if (dateDebut) query.dateEcriture.$gte = new Date(dateDebut);
      if (dateFin) query.dateEcriture.$lte = new Date(dateFin);
    }
    
    const ecritures = await Ecriture.find(query)
      .populate('journal')
      .populate('lignes.compte')
      .sort({ dateEcriture: -1 });
    
    res.json(ecritures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validerEcriture = async (req, res) => {
  try {
    const ecriture = await Ecriture.findById(req.params.id);
    if (!ecriture) return res.status(404).json({ message: 'Écriture non trouvée' });
    
    if (ecriture.etat !== 'brouillon') {
      return res.status(400).json({ message: 'Seules les écritures en brouillon peuvent être validées' });
    }
    
    ecriture.etat = 'validé';
    
    // Mettre à jour les soldes des comptes
    for (let ligne of ecriture.lignes) {
      const compte = await Compte.findById(ligne.compte);
      if (ligne.debit) compte.soldeDebit += ligne.debit;
      if (ligne.credit) compte.soldeCredit += ligne.credit;
      await compte.save();
    }
    
    await ecriture.save();
    res.json(ecriture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
