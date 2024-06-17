import fs from "fs";
import weaviate from "weaviate-ts-client";
import { getPaletteImageBuffer64 } from "./palette-utils.js";

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

//Cleanup database
await client.batch
  .objectsBatchDeleter()
  .withClassName("Paper11")
  .withWhere({
    path: ["name"],
    operator: "Like",
    valueText: "paper*",
  })
  .do();

const imgFiles = fs.readdirSync("./img");
const promises = imgFiles.map(async (img) => {
  const src = `./img/${img}`;

  const image = fs.readFileSync(src, { encoding: "base64" });
  const palette = await getPaletteImageBuffer64(src);

  return await client.data
    .creator()
    .withClassName("Paper11")
    .withProperties({
      image,
      palette,
      name: img.split(".")[0],
    })
    .do();
});

const response = await Promise.all(promises);
console.log(response);
