const mongoose = require("mongoose");
const _ = require("lodash");
const logger = require("../logs");

const { Schema } = mongoose;

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const EmailTemplate = mongoose.model("EmailTemplate", mongoSchema);

function insertTemplates() {
  const templates = [
    {
      name: "welcome",
      subject: "Welcome to my MERN-stack-tutorial",
      message: `<%= userName %>,
        <p>
          Thanks for signing up for my MERN-stack-tutorial!
        </p>
        <p>
          This website is a test to see if you can get welcome messages for joining my full stack app.
        </p>
        John Merritt
      `,
    },
  ];

  templates.forEach(async (template) => {
    if ((await EmailTemplate.find({ name: template.name }).count()) > 0) {
      return;
    }

    EmailTemplate.create(template).catch((error) => {
      logger.error("EmailTemplate insertion error:", error);
    });
  });
}

insertTemplates();

async function getEmailTemplate(name, params) {
  const source = await EmailTemplate.findOne({ name });
  if (!source) {
    throw new Error(
      "No EmailTemplates found. Please check that at least one is generated at server startup, restart your server and try again."
    );
  }

  return {
    message: _.template(source.message)(params),
    subject: _.template(source.subject)(params),
  };
}

exports.insertTemplates = insertTemplates;
exports.getEmailTemplate = getEmailTemplate;
