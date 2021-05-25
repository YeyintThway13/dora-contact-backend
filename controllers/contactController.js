import expressAsyncHandler from "express-async-handler";
import Contact from "../models/contactModel.js";

export const postAContact = expressAsyncHandler(async (req, res) => {
  try {
    if ((req.body.name, req.body.phNo, req.body.address)) {
      if (req.body.phNo.length > 20) {
        res
          .status(401)
          .send({ message: "Ph no should be less than 20 character" });
        return;
      }
      const createdContact = new Contact({
        name: req.body.name,
        phNo: req.body.phNo,
        address: req.body.address,
        user: req.user._id,
      });
      await createdContact.save();
      res.send("Successfully created");
    } else {
      res.status(401).send({ message: "Please fill all fields" });
    }
  } catch (e) {
    res.status(401).send(e);
  }
});

export const getMineContacts = expressAsyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user: req.user._id });
  if (!contacts) {
    res.status(404).send({ message: "There is no contact created yet" });
  } else {
    res.send(contacts);
  }
});

export const deleteContact = expressAsyncHandler(async (req, res) => {
  const contactId = req.params.id;
  try {
    const contact = await Contact.findOne({
      _id: contactId,
      user: req.user._id,
    });
    if (contact) {
      await contact.remove();
      res.send("Contact is deleted");
    } else {
      res
        .status(404)
        .send({ message: "Contact not found in your contact list" });
    }
  } catch (e) {
    res.status(401).send({ message: e });
  }
});

export const updateContact = expressAsyncHandler(async (req, res) => {
  const contactId = req.params.id;
  const contact = await Contact.findOne({
    _id: contactId,
    user: req.user._id,
  });
  const updates = Object.keys(req.body);
  const allowUpdates = ["_id", "name", "phNo", "address"];
  const validUpdate = updates.every((update) => {
    return allowUpdates.includes(update);
  });

  if (!contact) {
    res.status(404).send("Can't find this contact in your contact list");
    return;
  }

  if (!validUpdate) {
    res.status(401).send("Invalid Operations");
    return;
  }

  if (!req.body.name || !req.body.phNo || !req.body.address) {
    res.status(401).send({ message: "Please fill all field" });
  }

  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  res.send({
    message: "Contact Updated successfully",
    contact: updatedContact,
  });
});
