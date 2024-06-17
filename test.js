import fs, { writeFileSync } from "fs";
import weaviate from "weaviate-ts-client";

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const test = Buffer.from(fs.readFileSync("./test.jpg")).toString("base64");

const resImage = await client.graphql
  .get()
  .withClassName("Paper11")
  .withFields(["image"])
  .withNearImage({ image: test })
  .withLimit(1)
  .do();

console.log(resImage);

const result = resImage.data.Get.Paper3[0].image;
writeFileSync("./result.jpg", result, "base64");
