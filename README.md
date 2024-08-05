# Image search by color palette

This is a proof-of-concept using a vector database (Weaviate) running in a docker container for performing an image search based on the image's color palette.

## Install

```
npm install
```

## Run Weaviate

We'll use docker to run Weaviate locally. The `docker-compose.yml` file contains the configurations and images used.

```
docker compose up
```

## Steps

1. Create an `img` folder with some jpeg images. E.g.:
![image](https://github.com/user-attachments/assets/d9e53623-3cd3-4b97-a606-712386e4fb1e)

2. Create the schema
```
node schema.js
```
3. Store all images from the `img` folder in the vector database and its color palette (also stored as an image). Any previous data will be deleted.
```
node vectorize.js
```
4. Run the following, replacing `<INPUT>` with the image used as the search source. The most similar images based on the input's color palette will be output as `result-X.jpg`.
```
node search.js <INPUT>
```
Example:

![image](https://github.com/user-attachments/assets/f037b2f8-fd1f-4e54-a39e-de30ef0bd823)
![image](https://github.com/user-attachments/assets/db562455-dc51-4434-a6b0-ea5d6588cad9)




If needed, repeat steps 3 and 4.
