var mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Define a schema
var myBoardSchema = mongoose.Schema({
  empId: String,
  title: String,
  color: String,
  boards: [
    {
      title: String,
      cards: [
        {
          title: String,
          labels: [
            {
              text: String,
              color: String,
            },
          ],
          desc: String,
          date: String,
          tasks: [
            {
              task: String,
              completed: Boolean,
            },
          ],
        },
      ],
    },
  ],
  sharewith: [{ type: mongoose.Schema.Types.ObjectId, ref: "employee" }],
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "myProject" },
});

module.exports = mongoose.model("myBoard", myBoardSchema);
