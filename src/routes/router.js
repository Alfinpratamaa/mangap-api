const express = require("express");
const router = express.Router();
const komik = require("../controllers/komik");
const { responseApi } = require("../helper/response_api");

router.get("/terbaru", komik.getTerbaru);
router.get("/genre", komik.getGenreList);
router.get("/genres/:genre/:page", komik.getGenre);
router.get("/read/:url", komik.readComic);
router.get("/search", komik.searchComic);
router.get("/detail/:url", komik.getComicDetail);
router.get("/popular", komik.getPopular);
router.get("/recommended", komik.getRecommendedComics);
router.get("/daftar-komik/:page", komik.getDaftarKomik);

router.all("*", (req, res) => responseApi(res, 404, "route not found"));

module.exports = { router };
