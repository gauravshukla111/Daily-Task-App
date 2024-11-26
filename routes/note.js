import express from "express";
import Note from "../models/Note.js";
import middleware from "../middleware/middleware.js";

const router = express.Router();

// Add a new note
router.post("/add", middleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and Description are required.",
      });
    }

    const newNote = new Note({
      title,
      description,
      userId: req.user.id,
    });

    await newNote.save();

    return res
      .status(200)
      .json({ success: true, message: "Note Created Successfully", newNote });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error in Adding Note" });
  }
});

// Get all notes
router.get("/", middleware, async (req, res) => {
  try {
    const notes = await Note.find({userId: req.user.id});
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Cannot retrieve notes" });
  }
});

// Update a note
router.put("/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    const updatedNote = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res
      .status(200)
      .json({ success: true, message: "Note Updated Successfully", updatedNote });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error in Updating Note" });
  }
});

// Delete a note
router.delete("/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    await Note.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Note Deleted Successfully" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error in Deleting Note" });
  }
});

export default router;
