const PiecesJointes = require("../models/pieces_jointes.model");

exports.create = async (req, res) => {
  try {
    const piece = new PiecesJointes(req.body);
    const savedPiece = await piece.save();
    res.status(201).json(savedPiece);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const pieces = await PiecesJointes.find();
    res.json(pieces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const piece = await PiecesJointes.findById(req.params.id);
    if (!piece) return res.status(404).json({ message: "Pièce jointe non trouvée" });
    res.json(piece);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedPiece = await PiecesJointes.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPiece) return res.status(404).json({ message: "Pièce jointe non trouvée" });
    res.json(updatedPiece);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedPiece = await PiecesJointes.findByIdAndDelete(req.params.id);
    if (!deletedPiece) return res.status(404).json({ message: "Pièce jointe non trouvée" });
    res.json({ message: "Pièce jointe supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};