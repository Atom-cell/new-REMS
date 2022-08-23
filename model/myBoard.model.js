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
        },
      ],
    },
  ],
});

module.exports = mongoose.model("myBoard", myBoardSchema);
