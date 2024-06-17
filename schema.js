import weaviate from "weaviate-ts-client";

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const PaperSchema = {
  class: "Paper11",
  vectorizer: "multi2vec-clip",
  vectorIndexType: "hnsw",
  moduleConfig: {
    "multi2vec-clip": {
      imageFields: ["image", "palette"],
    },
  },
  properties: [
    {
      name: "image",
      dataType: ["blob"],
    },
    {
      name: "palette",
      dataType: ["blob"],
    },
    {
      name: "name",
      dataType: ["string"],
    },
  ],
};

console.log(await client.schema.classCreator().withClass(PaperSchema).do());
