# Image search

This is a proof-of-concept using a vector database (Weaviate) running in a docker container for performing an image search based on the image's color palette.

## Install

```
npm install
```

## Start weaviate

We'll use docker to run Weaviate locally. The `docker-compose.yml` file contains the configurations and images used.

```
docker compose up
```

## Steps

1. Create a `img` folder and put some jpeg files in it.
2. Create the schema: `node schema.js`
3. Run `node vectorize.js` which will store all images from the `img` folder into the vector database, along with its color palette (also stored as image). Any previous data will be deleted.
3. Run `node search.js test.jpg` where `test.jpg` is the image used as search source. The X most similar images based on the color palette will be created as `result-X.jpg`.

If needed, repeat steps 3 and 4.
