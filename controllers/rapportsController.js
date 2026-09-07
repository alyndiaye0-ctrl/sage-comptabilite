const Compte = require('../models/Compte');
const Ecriture = require('../models/Ecriture');

exports.bilanComptable = async (req, res) => {
  try {
    const { entreprise } = req.query;
    
    const comptes = await Compte.find({ entreprise, actif: true });
    
    const bilan = {
      actif: { total: 0, comptes: [] },
      passif: { total: 0, comptes: [] },
      dateGeneration: new Date()
    };
    
    for (let compte of comptes) {
      const solde = compte.soldeDebit - compte.soldeCredit;
      const item = { numero: compte.numero, libelle: compte.libelle, solde: Math.abs(solde) };
      
      if (compte.type === 'actif') {
        bilan.actif.comptes.push(item);
        bilan.actif.total += Math.abs(solde);
      } else if (compte.type === 'passif') {
        bilan.passif.comptes.push(item);
        bilan.passif.total += Math.abs(solde);
      }
    }
    
    res.json(bilan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.compteResultat = async (req, res) => {
  try {
    const { entreprise } = req.query;
    
    const comptes = await Compte.find({ 
      entreprise, 
      actif: true,
      type: { $in: ['charge', 'produit'] }
    });
    
    const compte = {
      charges: { total: 0, comptes: [] },
      produits: { total: 0, comptes: [] },
      resultat: 0,
      dateGeneration: new Date()
    };
    
    for (let comp of comptes) {
      const solde = comp.soldeCredit - comp.soldeDebit;
      const item = { numero: comp.numero, libelle: comp.libelle, montant: Math.abs(solde) };
      
      if (comp.type === 'charge') {
        compte.charges.comptes.push(item);
        compte.charges.total += Math.abs(solde);
      } else {
        compte.produits.comptes.push(item);
        compte.produits.total += Math.abs(solde);
      }
    }
    
    compte.resultat = compte.produits.total - compte.charges.total;
    
    res.json(compte);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.grandLivre = async (req, res) => {
  try {
    const { entreprise, compte } = req.query;
    
    const ecritures = await Ecriture.find({ entreprise, etat: 'validé' })
      .populate('lignes.compte')
      .sort({ dateEcriture: 1 });
    
    const livre = {};
    
    for (let ecriture of ecritures) {
      for (let ligne of ecriture.lignes) {
        const codeCompte = ligne.compte.numero;
        
        if (!compte || codeCompte === compte) {
          if (!livre[codeCompte]) {
            livre[codeCompte] = {
              numero: codeCompte,
              libelle: ligne.compte.libelle,
              mouvements: []
            };
          }
          
          livre[codeCompte].mouvements.push({
            date: ecriture.dateEcriture,
            libelle: ligne.libelle,
            debit: ligne.debit,
            credit: ligne.credit,
            numeroEcriture: ecriture.numero
          });
        }
      }
    }
    
    res.json(livre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
