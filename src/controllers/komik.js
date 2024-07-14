const cheerio = require("cheerio");
const { AxiosService } = require("../helper/axios_service");
const { responseApi } = require("../helper/response_api");
const { response } = require("express");
const baseUrl = "https://komikcast.cz";

const getTerbaru = async (req, res) => {
  try {
    const { page } = req.query;
    if (page === undefined) return responseApi(res, 500, "page is required");
    const response = await AxiosService(`${baseUrl}/project-list/page/${page}`);
    if (response.status === 200) {
      const komikList = [];
      const $ = cheerio.load(response.data);
      const element = $("#content  >.wrapper > .postbody > .bixbox");

      const current_page = element
        .find(".pagination > .page-numbers.current")
        .text()
        .trim();

      let length_page;
      if (
        element
          .find(".pagination > .page-numbers:nth-child(6)")
          .attr("class") === "next page-numbers"
      ) {
        length_page = element
          .find(".pagination > .page-numbers:nth-child(5)")
          .text()
          .trim();
      } else if (
        element
          .find(".pagination > .page-numbers:nth-child(8)")
          .attr("class") === "next page-numbers"
      ) {
        length_page = element
          .find(".pagination > .page-numbers:nth-child(7)")
          .text()
          .trim();
      } else if (
        element
          .find(".pagination > .page-numbers:nth-child(9)")
          .attr("class") === "next page-numbers"
      ) {
        length_page = element
          .find(".pagination > .page-numbers:nth-child(8)")
          .text()
          .trim();
      } else if (
        element
          .find(".pagination > .page-numbers:nth-child(10)")
          .attr("class") === "next page-numbers"
      ) {
        length_page = element
          .find(".pagination > .page-numbers:nth-child(9)")
          .text()
          .trim();
      } else if (
        element
          .find(".pagination > .page-numbers:nth-child(11)")
          .attr("class") === "next page-numbers"
      ) {
        length_page = element
          .find(".pagination > .page-numbers:nth-child(10)")
          .text()
          .trim();
      } else if (
        element
          .find(".pagination > .page-numbers:nth-child(6)")
          .attr("class") === "page-numbers current"
      ) {
        length_page = element
          .find(".pagination > .page-numbers:nth-child(6)")
          .text()
          .trim();
      }

      element
        .find(
          ".list-update_items > .list-update_items-wrapper > .list-update_item"
        )
        .each((i, data) => {
          const thumbnail =
            $(data).find("a > .list-update_item-image > img").attr("src") ||
            $(data).find("a > .list-update_item-image > img").attr("data-src");

          const href = $(data).find("a").attr("href");
          const type = $(data)
            .find("a > .list-update_item-image > .type")
            .text()
            .trim();
          const title = $(data)
            .find("a > .list-update_item-info > h3")
            .text()
            .trim();
          const chapter = $(data)
            .find("a > .list-update_item-info > .other > .chapter")
            .text()
            .trim();
          const rating = $(data)
            .find(
              "a > .list-update_item-info > .other > .rate > .rating  >.numscore"
            )
            .text()
            .trim();
          komikList.push({
            title,
            href: href?.replace(`${baseUrl}/komik`, "").trim(),
            thumbnail,
            type,
            chapter,
            rating,
          });
        });

      return res.status(200).json({
        status: "success",
        current_page: parseFloat(current_page),
        length_page: parseFloat(length_page),
        data: komikList,
      });
    }
    return responseApi(res, response.status, "failed");
  } catch (error) {
    console.log(error.mmessage);
    return responseApi(res, 500, error.message);
  }
};

const getGenreList = async (req, res) => {
  try {
    const response = await AxiosService(baseUrl);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $("#content > .wrapper");
      const komikList = [];
      element.find("#sidebar > .section > ul.genre > li").each((i, data) => {
        const title = $(data).find("a").text().trim();
        const href = $(data).find("a").attr("href");
        komikList.push({
          title,
          href: href?.replace(`${baseUrl}/genres`, "").trim(),
        });
      });
      return responseApi(res, 200, "success", komikList);
    }
    return responseApi(res, response.status, "failed");
  } catch (er) {
    console.log(er);
    return responseApi(res, 500, er.message);
  }
};

const getGenre = async (req, res) => {
  try {
    const { genre, page } = req.params;

    const response = await AxiosService(
      `${baseUrl}/genres/${genre}/page/${page}`
    );

    console.log(`${baseUrl}/genres/${genre}/page/${page}`);

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $("#content > .wrapper > .postbody > .bixbox");
      const komikList = [];

      // Get the current page from the pagination element
      const checkPagination = element
        .find(".listupd > .list-update_items > .pagination > .current")
        .text()
        .trim();

      // Determine the length of pagination
      const paginationItems = element.find(".pagination > .page-numbers");
      let length_page = paginationItems.eq(-2).text().trim(); // Second last item, assuming last item is "Next"

      element
        .find(
          ".listupd > .list-update_items > .list-update_items-wrapper > .list-update_item"
        )
        .each((i, data) => {
          const title = $(data)
            .find("a > .list-update_item-info > h3")
            .text()
            .trim();
          const chapter = $(data)
            .find("a > .list-update_item-info > .other > .chapter")
            .text()
            .trim();
          const type = $(data)
            .find("a > .list-update_item-image > .type")
            .text()
            .trim();
          const thumbnail =
            $(data).find("a > .list-update_item-image > img").attr("src") ||
            $(data).find("a > .list-update_item-image > img").attr("data-src");

          const rating = $(data)
            .find(
              "a > .list-update_item-info > .other > .rate > .rating > .numscore"
            )
            .text()
            .trim();
          const href = $(data).find("a").attr("href");

          komikList.push({
            title,
            chapter,
            type,
            href: href?.replace(`${baseUrl}/komik`, "").trim(),
            rating,
            thumbnail,
          });
        });

      return res.status(200).json({
        status: "success",
        current_page:
          checkPagination === "" ? 1 : parseInt(checkPagination, 10),
        length_page: length_page === "" ? 1 : parseInt(length_page, 10),
        data: komikList,
      });
    }

    return responseApi(
      res,
      response.status,
      response.err || "Unknown error occurred"
    );
  } catch (error) {
    return responseApi(res, 500, error.message);
  }
};

const readComic = async (req, res) => {
  try {
    const response = await AxiosService(`${baseUrl}/${req.params.url}`);
    const komikList = [];
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $("#content > .wrapper");
      let title;
      const panel = [];
      let prevChapter, nextChapter;
      prevChapter = element
        .find(
          ".chapter_nav-control > .right-control > .nextprev > a[rel='prev']"
        )
        .attr("href");

      nextChapter = element
        .find(
          ".chapter_nav-control > .right-control > .nextprev > a[rel='next']"
        )
        .attr("href");

      prevChapter = prevChapter
        ? prevChapter.replace(`${baseUrl}/chapter`, "")
        : null;
      nextChapter = nextChapter
        ? nextChapter.replace(`${baseUrl}/chapter`, "")
        : null;

      title = element.find(".chapter_headpost > h1").text().trim();
      element
        .find(".chapter_ > #chapter_body > .main-reading-area > img")
        .each((i, data) => {
          panel.push($(data).attr("src"));
        });

      komikList.push({ title, prev: prevChapter, next: nextChapter, panel });

      return responseApi(res, 200, "success", komikList);
    }
    return responseApi(res, response.status, "failed");
  } catch (er) {
    console.log(er);
    if (er === "Request failed with status code 404")
      return responseApi(res, 404, "comic not found");
    return responseApi(res, 500, er.message);
  }
};

const searchComic = async (req, res) => {
  try {
    const response = await AxiosService(`${baseUrl}/?s=${req.query.keyword}`);
    const komikList = [];
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $(
        "#content > .wrapper > .postbody > .dev > #main > .list-update"
      );
      let title, href, thumbnail, type, chapter, rating;

      element
        .find(
          ".list-update_items > .list-update_items-wrapper > .list-update_item"
        )
        .each((i, data) => {
          title = $(data).find("a > .list-update_item-info > h3").text().trim();
          href = $(data).find("a").attr("href");
          type = $(data)
            .find("a > .list-update_item-image > .type")
            .text()
            .trim();
          rating = $(data)
            .find(
              "a > .list-update_item-info > .other > .rate > .rating > .numscore"
            )
            .text()
            .trim();
          chapter = $(data)
            .find("a > .list-update_item-info > .other > .chapter")
            .text()
            .trim();
          thumbnail =
            $(data).find("a > .list-update_item-image > img").attr("src") ||
            $(data).find("a > .list-update_item-image > img").attr("data-src");
          komikList.push({
            title,
            type,
            chapter,
            rating,
            href: href?.replace(`${baseUrl}/komik`, "").trim(),
            thumbnail,
          });
        });

      return responseApi(res, response.status, "success", komikList);
    }
    return responseApi(res, response.status, "failed");
  } catch (er) {
    console.log("ini error", er.message);
    return responseApi(res, 500, er.message);
  }
};



const getComicDetail = async (req, res) => {
  try {
    const response = await AxiosService(`${baseUrl}/komik/${req.params.url}`);
    if (!response.status) {
      return responseApi(res, 500, "Failed to get data from external source");
    }
    const komikList = [];
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $("#content > .wrapper > .komik_info");
      let title,
        altTitle,
        thumbnail,
        description,
        status,
        type,
        released,
        author,
        updatedOn,
        rating;
      const chapter = [];
      const genre = [];

      rating = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-rating > .komik_info-content-rating-bungkus > .data-rating > strong"
        )
        .text()
        .trim();
      title = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > h1"
        )
        .text()
        .trim();

      altTitle = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > .komik_info-content-native"
        )
        .text()
        .trim();

      released = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > .komik_info-content-meta > span:nth-child(1)"
        )
        .text()
        .trim();
      author = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > .komik_info-content-meta > span:nth-child(2)"
        )
        .text()
        .trim();
      status = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > .komik_info-content-meta > span:nth-child(3)"
        )
        .text()
        .trim();
      type = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > .komik_info-content-meta > span:nth-child(4)"
        )
        .text()
        .trim();

      description = element
        .find(".komik_info-description > .komik_info-description-sinopsis > p")
        .text()
        .trim();
      thumbnail =
        element
          .find(".komik_info-cover-box > .komik_info-cover-image > img")
          .attr("src") ||
        element
          .find(".komik_info-cover-box > .komik_info-cover-image > img")
          .attr("data-src");

      updatedOn = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > .komik_info-content-meta > .komik_info-content-update"
        )
        .text()
        .trim();

      element
        .find(".komik_info-body > .komik_info-chapters > ul > li")
        .each((i, data) => {
          const title = $(data).find("a").text().trim();
          const href = $(data).find("a").attr("href");
          const href2 = $(data).find("a:nth-child(2)").attr("href");
          const date = $(data).find(".chapter-link-time").text().trim();
          chapter.push({
            title: `Chapter ${title?.replace("Chapter", "").trim()}`,
            href: href
              ? href?.replace(`${baseUrl}/chapter`, "")
              : href2.replace(`${baseUrl}/chapter`, ""),
            date,
          });
        });

      element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > .komik_info-content-genre > a"
        )
        .each((i, data) => {
          genre.push({
            title: $(data).text().trim(),
            href: $(data).attr("href")?.replace(`${baseUrl}/genres`, "").trim(),
          });
        });

      komikList.push({
        title,
        altTitle,
        updatedOn: updatedOn.replace("Updated on:", "").trim(),
        rating: rating.replace("Rating ", ""),
        status: status.replace("Status:", "").trim(),
        type: type?.replace("Type:", "").trim(),
        released: released?.replace("Released:", "").trim(),
        author: author?.replace("Author:", "").trim(),
        genre,
        description,
        thumbnail,
        chapter,
      });
      return responseApi(res, 200, "success", komikList[0]);
    }
    return responseApi(res, response.status, "failed");
  } catch (er) {
    console.log(er);
    if (er === "Request failed with status code 404")
      return responseApi(res, 404, " not found or caused " + er.message);
    return responseApi(res, 500, er.message);
  }
};

const getPopular = async (req, res) => {
  try {
    const response = await AxiosService(baseUrl);
    const komikList = [];
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $("#content > .wrapper > #sidebar");
      element
        .find(".section > .widget-post > .serieslist.pop > ul > li")
        .each((i, data) => {
          const title = $(data).find(".leftseries > h2 > a").text().trim();

          const year = $(data)
            .find(".leftseries > span:nth-child(3)")
            .text()
            .trim();

          const genre = $(data)
            .find(".leftseries > span:nth-child(2)")
            .text()
            .trim();
          const thumbnail =
            $(data).find(".imgseries > a > img").attr("src") ||
            $(data).find(".imgseries > a > img").attr("data-src");

          const href = $(data).find(".imgseries > a").attr("href");
          komikList.push({
            title,
            href: href?.replace(`${baseUrl}/komik`, "").trim(),
            genre: genre.replace("Genres:", "").trim(),
            year,
            thumbnail,
          });
        });

      return responseApi(res, 200, "success", komikList);
    }
    console.log(response.message, " ", response.status);
    return responseApi(res, response.status, "failed");
  } catch (er) {
    console.log(er);
    return responseApi(res, response.status, er);
  }
};

const getRecommendedComics = async (req, res) => {
  try {
    const response = await AxiosService(baseUrl);
    let komikList = [];
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $(
        "#content > .wrapper > .bixbox > .listupd > .swiper > .swiper-wrapper > .swiper-slide"
      );

      element.each((i, data) => {
        const title = $(data)
          .find("a > .splide__slide-info > .title")
          .text()
          .trim();
        const rating = $(data)
          .find(
            "a > .splide__slide-info > .other > .rate > .rating > .numscore"
          )
          .text()
          .trim();
        const chapter = $(data)
          .find("a > .splide__slide-info > .other > .chapter")
          .text()
          .trim();
        const type = $(data)
          .find("a > .splide__slide-image  > .type")
          .text()
          .trim();
        const href = $(data).find("a").attr("href");
        const thumbnail =
          $(data).find("a > .splide__slide-image > img").attr("src") ||
          $(data).find("a > .splide__slide-image > img").attr("data-src");

        komikList.push({
          title,
          href: href?.replace(`${baseUrl}/komik`, ""),
          rating,
          thumbnail,
          chapter,
          type,
        });
      });
      return responseApi(
        res,
        200,
        "success",
        komikList.filter((v) => v?.href !== undefined)
      );
    }
    return responseApi(res, response.status, "failed");
  } catch (er) {
    console.log(er);
    return responseApi(res, 500, er.message);
  }
};

const getDaftarKomik = async (req, res) => {
  try {
    const currentPage =
      req.params.page === "1" ? 1 : parseInt(req.params.page, 10);
    const response = await AxiosService(
      currentPage === 1
        ? `${baseUrl}/daftar-komik/`
        : `${baseUrl}/daftar-komik/page/${currentPage}`
    );

    let FIXED_LAST_PAGE = 0;

    const responseForIdentifyLastPage = await AxiosService(
      `${baseUrl}/daftar-komik/1`
    );

    if (responseForIdentifyLastPage.status === 200) {
      const $ = cheerio.load(responseForIdentifyLastPage.data);
      const pagination = $(
        "#content > .wrapper > .komiklist > .komiklist_filter > .list-update > .list-update_items > .pagination"
      );
      FIXED_LAST_PAGE = pagination.find(".page-numbers").eq(-2).text().trim();
    }

    const komikList = [];
    let paginationInfo = {
      currentPage: {
        page: currentPage,
        hrefPagination: `/daftar-komik/${currentPage}`,
      },
      nextPage: null,
      previousPage: null,
      lastPage: null,
    };

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $(
        "#content > .wrapper > .komiklist > .komiklist_filter > .list-update > .list-update_items > .list-update_items-wrapper > .list-update_item"
      );

      element.each((i, data) => {
        const title = $(data)
          .find("a > .list-update_item-info > h3")
          .text()
          .trim();
        const chapter = $(data)
          .find("a > .list-update_item-info > .other > .chapter")
          .text()
          .trim();
        const type = $(data)
          .find("a > .list-update_item-image > .type")
          .text()
          .trim();
        const thumbnail =
          $(data).find("a > .list-update_item-image > img").attr("src") ||
          $(data).find("a > .list-update_item-image > img").attr("data-src");
        const rating = $(data)
          .find(
            "a > .list-update_item-info > .other > .rate > .rating > .numscore"
          )
          .text()
          .trim();
        const href = $(data).find("a").attr("href");

        komikList.push({
          title,
          chapter,
          type,
          thumbnail,
          rating,
          href: href?.replace(`${baseUrl}/komik`, "").trim(),
        });
      });

      const pagination = $(
        "#content > .wrapper > .komiklist > .komiklist_filter > .list-update > .list-update_items > .pagination"
      );

      pagination.find(".page-numbers").each((i, data) => {
        const pageText = $(data).text().trim();
        const pageHref = $(data).attr("href");

        if (pageText === "Next »") {
          paginationInfo.nextPage = {
            page: currentPage + 1,
            hrefPagination: `/daftar-komik/${currentPage + 1}`,
          };
        } else if (pageText === "« Previous") {
          paginationInfo.previousPage = {
            page: currentPage - 1,
            hrefPagination: `/daftar-komik/${currentPage - 1}`,
          };
        } else if (!isNaN(pageText) && parseInt(pageText, 10) > currentPage) {
          paginationInfo.lastPage = {
            page: pageText,
            hrefPagination: `/daftar-komik/${pageText}`,
          };
        }
      });

      // Ensure the lastPage is set correctly
      paginationInfo.lastPage = FIXED_LAST_PAGE;

      return responseApi(res, 200, "success", {
        komikList: komikList.filter((v) => v?.href !== undefined),
        pagination: paginationInfo,
      });
    }
    return responseApi(res, response.status, response.statusText);
  } catch (error) {
    return responseApi(res, 402, error.message);
  }
};

module.exports = {
  getTerbaru,
  getGenreList,
  getGenre,
  readComic,
  searchComic,
  getComicDetail,
  getPopular,
  getRecommendedComics,
  getDaftarKomik,
};
