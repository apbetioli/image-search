import { writeFileSync } from "fs";
import weaviate from "weaviate-ts-client";
import { getPaletteImageBuffer64 } from "./palette-utils.js";

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const src = process.argv.slice(2)[0];
const palette = await getPaletteImageBuffer64(src);

const result = await client.graphql
  .get()
  .withClassName("Paper11")
  .withFields(["name", "image"])
  .withNearImage({
    image: palette,
    //certainty: 0.7,
    targetVectors: ["palette"],
  })
  .withLimit(3) // How many results
  .do();

if (result.data.Get.Paper11.length > 0) {
  result.data.Get.Paper11.forEach((paper, index) => {
    const resImage = paper.image;
    const filename = `./result-${index}.jpg`;
    writeFileSync(filename, resImage, "base64");
    console.log("Created", filename);
  });
} else {
  console.log("No results");
}
