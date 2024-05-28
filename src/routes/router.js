const express = require("express");
const router = express.Router();
const komik = require("../controllers/komik");
const { responseApi } = require("../helper/response_api");
const { AxiosService } = require("../helper/axios_service");
const baseUrl = "https://komikcast.lol";
const cheerio = require("cheerio");

router.get("/terbaru", komik.getTerbaru);
router.get("/genre", komik.getGenreList);
router.get("/genres/:genre/:page", komik.getGenre);
router.get("/read/:url", komik.readComic);
router.get("/search", komik.searchComic);
router.get("/detail/:url", komik.getComicDetail);
router.get("/popular", komik.getPopular);
router.get("/recommended", komik.getRecommendedComics);
router.get("/daftar-komik/:page", komik.getDaftarKomik);
// router.get("/daftar-komik/:page", async (req, res) => {
//   try {
//     let response;
//     if (req.params.page === "1") {
//       response = await AxiosService(`${baseUrl}/daftar-komik/`);
//     } else {
//       response = await AxiosService(
//         `${baseUrl}/daftar-komik/page/${req.params.page}`
//       );
//     }
//     const komikList = [];
//     if (response.status === 200) {
//       const $ = cheerio.load(response.data);

//       const element = $(
//         "#content > .wrapper > .komiklist > .komiklist_filter > .list-update > .list-update_items > .list-update_items-wrapper > .list-update_item "
//       );

//       element.each((i, data) => {
//         const title = $(data)
//           .find("a > .list-update_item-info > h3")
//           .text()
//           .trim();
//         const chapter = $(data)
//           .find("a > .list-update_item-info > .other > .chapter")
//           .text()
//           .trim();
//         const type = $(data)
//           .find("a > .list-update_item-image > .type")
//           .text()
//           .trim();
//         const thumbnail = $(data)
//           .find("a > .list-update_item-image > img")
//           .attr("src");
//         const rating = $(data)
//           .find(
//             "a > .list-update_item-info > .other > .rate > .rating > .numscore"
//           )
//           .text()
//           .trim();
//         const href = $(data).find("a").attr("href");
//         komikList.push({
//           title,
//           totalData: element.length,
//           chapter,
//           type,
//           thumbnail,
//           rating,
//           href: href?.replace(`${baseUrl}/komik`, "").trim(),
//         });
//       });
//       return responseApi(
//         res,
//         200,
//         "success",
//         komikList.filter((v) => v?.href !== undefined)
//       );
//     }
//     return responseApi(res, response.status, "failed");
//   } catch (error) {
//     return responseApi(res, 402, "failed");
//   }
// });

router.all("*", (req, res) => responseApi(res, 404, "route not found"));

module.exports = { router };
