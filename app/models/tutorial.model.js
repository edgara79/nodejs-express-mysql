const sql = require("./db.js");

// constructor
const Message = function(message) {
  this.title = message.title;
  this.description = message.description;
  this.published = message.published;
};

Message.create = (newMessage, result) => {
  sql.query("INSERT INTO tutorials SET ?", newMessage, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created message: ", { id: res.insertId, ...newMessage });
    result(null, { id: res.insertId, ...newMessage });
  });
};

Message.findById = (id, result) => {
  sql.query(`SELECT * FROM tutorials WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found message: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Message with the id
    result({ kind: "not_found" }, null);
  });
};

Message.getAll = (title, result) => {
  let query = "SELECT * FROM tutorials";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("messages: ", res);
    result(null, res);
  });
};

Message.getAllPublished = result => {
  sql.query("SELECT * FROM tutorials WHERE published=true", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("messages: ", res);
    result(null, res);
  });
};

Message.updateById = (id, message, result) => {
  sql.query(
    "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
    [message.title, message.description, message.published, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Message with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated message: ", { id: id, ...message });
      result(null, { id: id, ...message });
    }
  );
};

Message.remove = (id, result) => {
  sql.query("DELETE FROM tutorials WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Message with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted message with id: ", id);
    result(null, res);
  });
};

Message.removeAll = result => {
  sql.query("DELETE FROM tutorials", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} messages`);
    result(null, res);
  });
};

module.exports = Message;
