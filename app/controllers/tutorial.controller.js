const Message = require("../models/tutorial.model.js");

// Create and Save a new Message
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!"
    });
  }

  // Create a Message
  const message = new Message({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published || false
  });

  // Save Message in the database
  Message.create(message, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Message."
      });
    else res.send(data);
  });
};

// Retrieve all Messages from the database (with condition).
exports.findAll = (req, res) => {
  const title = req.query.title;

  Message.getAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving messages."
      });
    else res.send(data);
  });
};

// Find a single Message by Id
exports.findOne = (req, res) => {
  Message.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Message with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Message with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// find all published Messages
exports.findAllPublished = (req, res) => {
  Message.getAllPublished((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving messages."
      });
    else res.send(data);
  });
};

// Update a Message identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!"
    });
  }

  console.log(req.body);

  Message.updateById(
    req.params.id,
    new Message(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Message with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Message with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Message with the specified id in the request
exports.delete = (req, res) => {
  Message.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Message with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Message with id " + req.params.id
        });
      }
    } else res.send({ message: `Message was deleted successfully!` });
  });
};

// Delete all Messages from the database.
exports.deleteAll = (req, res) => {
  Message.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all messages."
      });
    else res.send({ message: `All Messages were deleted successfully!` });
  });
};
