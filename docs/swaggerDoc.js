const swaggerUi = require("swagger-ui-express");
const swaggerJsoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "ELKINDY API",
      version: "1.0.0",
      description: "This swagger doc is for testing auto-generation ",
      contact: {
        email: "omaradouli79@gmail.com"
      }
    },
    servers: [
      { url: "http://localhost:3000" },
      { url: "http://PREPROD" },
      { url: "http://PROD" },
      { url: "http://localhost:3000/api/courses" }
    ],
    components: {
      schemas: {
        
      }
    },
    tags: [
 
    ]
  },
  apis: ["./routes/*/*.js"]
};

const specs = swaggerJsoc(options);
module.exports = app => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
};
