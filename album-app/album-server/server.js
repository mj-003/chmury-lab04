const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

let albums = [
  {
    id: 1,
    band: "Metallica",
    title: "Master of Puppets",
    year: 1986,
    genre: "Thrash Metal",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/b/b2/Metallica_-_Master_of_Puppets_cover.jpg",
  },
  {
    id: 2,
    band: "Metallica",
    title: "Ride the Lightning",
    year: 1984,
    genre: "Thrash Metal",
    cover: "https://upload.wikimedia.org/wikipedia/en/f/f4/Ridetl.png",
  },
  {
    id: 3,
    band: "AC/DC",
    title: "Back in Black",
    year: 1980,
    genre: "Hard Rock",
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/ACDC_Back_in_Black.png/500px-ACDC_Back_in_Black.png",
  },
  {
    id: 4,
    band: "AC/DC",
    title: "Highway to Hell",
    year: 1979,
    genre: "Hard Rock",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/a/ac/Acdc_Highway_to_Hell.JPG",
  },
  {
    id: 5,
    band: "Iron Maiden",
    title: "The Number of the Beast",
    year: 1982,
    genre: "Heavy Metal",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/3/32/Iron_Maiden_-_The_Number_of_the_Beast.jpg",
  },
  {
    id: 6,
    band: "Iron Maiden",
    title: "Powerslave",
    year: 1984,
    genre: "Heavy Metal",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/1/1c/Iron_Maiden_-_Powerslave.jpg",
  },
  {
    id: 7,
    band: "Led Zeppelin",
    title: "Led Zeppelin IV",
    year: 1971,
    genre: "Rock",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",
  },
  {
    id: 8,
    band: "Pink Floyd",
    title: "The Dark Side of the Moon",
    year: 1973,
    genre: "Progressive Rock",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
  },
];

// GET - Pobieranie wszystkich albumów
app.get("/albums", (req, res) => {
  res.json(albums);
});

// GET - Pobieranie albumów konkretnego zespołu
app.get("/albums/band/:band", (req, res) => {
  const band = req.params.band.toLowerCase();
  const filteredAlbums = albums.filter((album) =>
    album.band.toLowerCase().includes(band)
  );

  if (filteredAlbums.length > 0) {
    res.json(filteredAlbums);
  } else {
    res.status(404).json({
      message: "Nie ma albumów dla tego zespołu.",
      searchTerm: req.params.band,
    });
  }
});

// GET - Pobieranie albumów według gatunku
app.get("/albums/genre/:genre", (req, res) => {
  const genre = req.params.genre.toLowerCase();
  const filteredAlbums = albums.filter((album) =>
    album.genre.toLowerCase().includes(genre)
  );

  if (filteredAlbums.length > 0) {
    res.json(filteredAlbums);
  } else {
    res.status(404).json({
      message: "Nie znaleziono albumów dla tego gatunku.",
      searchTerm: req.params.genre,
    });
  }
});

// GET - Pobieranie konkretnego albumu po ID
app.get("/albums/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const album = albums.find((album) => album.id === id);

  if (album) {
    res.json(album);
  } else {
    res.status(404).json({ message: "Album nie znaleziony." });
  }
});

// POST - Dodawanie nowego albumu
app.post("/albums", (req, res) => {
  const { band, title, year, genre, cover } = req.body;

  // Walidacja
  if (!band || !title || !year) {
    return res.status(400).json({
      message: "Brak wymaganych danych. Wymagane: band, title, year",
    });
  }

  // Czy album już istnieje
  const existingAlbum = albums.find(
    (album) =>
      album.band.toLowerCase() === band.toLowerCase() &&
      album.title.toLowerCase() === title.toLowerCase()
  );

  if (existingAlbum) {
    return res.status(409).json({
      message: "Album już istnieje w bazie danych.",
    });
  }

  const newId = Math.max(...albums.map((a) => a.id)) + 1;
  const newAlbum = {
    id: newId,
    band: band.trim(),
    title: title.trim(),
    year: parseInt(year),
    genre: genre?.trim() || "Nieznany",
    cover:
      cover?.trim() ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1BhBgvAdx2cQwiyvb-89VbGVzgQbB983tfw&s",
  };

  albums.push(newAlbum);
  res.status(201).json(newAlbum);
});

// PUT - Aktualizacja albumu
app.put("/albums/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { band, title, year, genre, cover } = req.body;

  const albumIndex = albums.findIndex((album) => album.id === id);

  if (albumIndex === -1) {
    return res.status(404).json({ message: "Album nie znaleziony." });
  }

  // Tylko przekazane pola
  if (band !== undefined) albums[albumIndex].band = band.trim();
  if (title !== undefined) albums[albumIndex].title = title.trim();
  if (year !== undefined) albums[albumIndex].year = parseInt(year);
  if (genre !== undefined) albums[albumIndex].genre = genre.trim();
  if (cover !== undefined) albums[albumIndex].cover = cover.trim();

  res.json(albums[albumIndex]);
});

// DELETE - Usuwanie albumu
app.delete("/albums/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const albumIndex = albums.findIndex((album) => album.id === id);

  if (albumIndex === -1) {
    return res.status(404).json({ message: "Album nie znaleziony." });
  }

  const deletedAlbum = albums[albumIndex];
  albums.splice(albumIndex, 1);

  res.json({
    message: "Album usunięty pomyślnie.",
    deletedAlbum: deletedAlbum,
  });
});

// GET - Pobieranie statystyk
app.get("/stats", (req, res) => {
  const stats = {
    totalAlbums: albums.length,
    bandCount: [...new Set(albums.map((a) => a.band))].length,
    genreCount: [...new Set(albums.map((a) => a.genre))].length,
    albumsByDecade: albums.reduce((acc, album) => {
      const decade = Math.floor(album.year / 10) * 10;
      acc[`${decade}s`] = (acc[`${decade}s`] || 0) + 1;
      return acc;
    }, {}),
    albumsByGenre: albums.reduce((acc, album) => {
      acc[album.genre] = (acc[album.genre] || 0) + 1;
      return acc;
    }, {}),
  };

  res.json(stats);
});

// Obsługa błędów 404
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Endpoint nie znaleziony.",
    availableEndpoints: [
      "GET /albums",
      "GET /albums/band/:band",
      "GET /albums/genre/:genre",
      "GET /albums/:id",
      "POST /albums",
      "PUT /albums/:id",
      "DELETE /albums/:id",
      "GET /stats",
    ],
  });
});

// Obsługa błędów serwera
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({
    message: "Wewnętrzny błąd serwera.",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong!",
  });
});

// Uruchomienie serwera
app.listen(port, () => {
  console.log(
    `🎵 Serwer REST API dla albumów działa na http://localhost:${port}`
  );
  console.log(`📊 Dostępne endpointy:`);
  console.log(`   GET    /albums                 - Lista wszystkich albumów`);
  console.log(`   GET    /albums/band/:band      - Albumy konkretnego zespołu`);
  console.log(`   GET    /albums/genre/:genre    - Albumy konkretnego gatunku`);
  console.log(`   GET    /albums/:id             - Konkretny album`);
  console.log(`   POST   /albums                 - Dodaj nowy album`);
  console.log(`   PUT    /albums/:id             - Aktualizuj album`);
  console.log(`   DELETE /albums/:id             - Usuń album`);
  console.log(`   GET    /stats                  - Statystyki kolekcji`);
});

module.exports = app;
