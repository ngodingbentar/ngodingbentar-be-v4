const fs = require("fs");
const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const request = require("request");
const axios = require("axios");
const dotenv = require("dotenv");
const validUrl = require("valid-url");
const shortid = require("shortid");
const Url = require("../models/urlModel");
const Blog = require("../models/blogModel");
const Categories = require("../models/categoriesModel");
const cheerio = require("cheerio");
const ytdl = require("ytdl-core");
const midtransClient = require("midtrans-client");
const instagramGetUrl = require("instagram-url-direct");
const {
  notificationsData,
  onlineData,
  newsData,
  profileData,
} = require("../assets/dummy");

dotenv.config();

const apiRouter = express.Router();

const port = process.env.PORT;
const weatherbit_key = process.env.WEATHERBIT;
const mongo = process.env.MONGODB_URL;
const mongo2 = process.env.MONGODB_URI;
const raja_ongkir_key = process.env.RAJA_ONGKIR;
const binderbyte_Key = process.env.API_KEY_BINDERBYTE;
const film_key = process.env.OMDB_API;
const google_key = process.env.GOOGLE_SEARCH;

// Playground
apiRouter.get(
  "/ping",
  expressAsyncHandler(async (req, res) => {
    res.json({ message: "pong" });
  })
);
apiRouter.get(
  "/random/image/:square",
  expressAsyncHandler(async (req, res) => {
    const { square } = req.params;
    const picsumUrl = `https://picsum.photos/${square}/${square}`;

    try {
      // Ambil gambar dari https://picsum.photos
      const response = await axios.get(picsumUrl, {
        responseType: "arraybuffer",
      });

      // Atur header dan kirim gambar sebagai respons
      res.set("Content-Type", response.headers["content-type"]);
      res.send(response.data);
    } catch (error) {
      console.error(
        "Error fetching image from https://picsum.photos:",
        error.message
      );
      res.status(500).send("Internal Server Error");
    }
  })
);

apiRouter.get(
  "/random/image/:height/:width",
  expressAsyncHandler(async (req, res) => {
    const { width, height } = req.params;
    const picsumUrl = `https://picsum.photos/${width}/${height}`;

    try {
      // Ambil gambar dari https://picsum.photos
      const response = await axios.get(picsumUrl, {
        responseType: "arraybuffer",
      });

      // Atur header dan kirim gambar sebagai respons
      res.set("Content-Type", response.headers["content-type"]);
      res.send(response.data);
    } catch (error) {
      console.error(
        "Error fetching image from https://picsum.photos:",
        error.message
      );
      res.status(500).send("Internal Server Error");
    }
  })
);
//

// MIDTRANS
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SECRET,
  clientKey: process.env.MIDTRANS_CLIENT,
});

apiRouter.post(
  "/midtrans-token",
  expressAsyncHandler(async (req, res) => {
    let paramemter = {
      item_details: {
        name: req.body.productName,
        price: req.body.price,
        quantity: req.body.quantity,
      },
      transaction_details: {
        order_id: req.body.id + new Date().getTime(),
        gross_amount: req.body.price * req.body.quantity,
      },
    };
    try {
      const token = await snap.createTransactionToken(paramemter);
      return res.json({ token });
    } catch (err) {
      res.json({
        error: err?.ApiResponse?.error_messages[0] || "Something went wrong",
      });
    }
  })
);

// google

apiRouter.get(
  "/google-maps",
  expressAsyncHandler(async (req, res) => {
    const query = req.query;
    console.log("query", query);

    const options = {
      method: "POST",
      url: "https://google-api31.p.rapidapi.com/map",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": google_key,
        "X-RapidAPI-Host": "google-api31.p.rapidapi.com",
      },
      data: {
        text: query.q,
        place: "",
        street: "",
        city: "",
        country: "",
        state: "",
        postalcode: "",
        latitude: "",
        longitude: "",
        radius: "",
      },
    };

    try {
      const response = await axios.request(options);
      // console.log(response.data);
      res.send(response.data);
      // res.send('wadudu')
    } catch (error) {
      console.error(error);
    }
  })
);

apiRouter.get(
  "/google-videos",
  expressAsyncHandler(async (req, res) => {
    const query = req.query;
    console.log("query", query);

    const options = {
      method: "POST",
      url: "https://google-api31.p.rapidapi.com/videosearch",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": google_key,
        "X-RapidAPI-Host": "google-api31.p.rapidapi.com",
      },
      data: {
        text: query.q,
        safesearch: "off",
        timelimit: "",
        duration: "",
        resolution: "",
        region: "id",
        max_results: 50,
      },
    };

    try {
      const response = await axios.request(options);
      // console.log(response.data);
      res.send(response.data);
      // res.send('wadudu')
    } catch (error) {
      console.error(error);
    }
  })
);

apiRouter.get(
  "/google-images",
  expressAsyncHandler(async (req, res) => {
    const query = req.query;
    console.log("query", query);

    const options = {
      method: "POST",
      url: "https://google-api31.p.rapidapi.com/imagesearch",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": google_key,
        "X-RapidAPI-Host": "google-api31.p.rapidapi.com",
      },
      data: {
        text: query.q,
        safesearch: "off",
        region: "ID",
        color: "",
        size: "",
        type_image: "",
        layout: "",
        max_results: 100,
      },
    };

    try {
      const response = await axios.request(options);
      // console.log(response.data);
      res.send(response.data);
      // res.send('wadudu')
    } catch (error) {
      console.error(error);
    }
  })
);

apiRouter.get(
  "/google-search",
  expressAsyncHandler(async (req, res) => {
    const query = req.query;
    console.log("query", query);

    const options = {
      method: "POST",
      url: "https://google-api31.p.rapidapi.com/websearch",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": google_key,
        "X-RapidAPI-Host": "google-api31.p.rapidapi.com",
      },
      data: {
        text: query.q,
        safesearch: "off",
        timelimit: "",
        region: "ID",
        max_results: 20,
      },
    };

    try {
      const response = await axios.request(options);
      // console.log(response.data);
      res.send(response.data);
      // res.send('wadudu')
    } catch (error) {
      console.error(error);
    }
  })
);

apiRouter.get(
  "/google1",
  expressAsyncHandler(async (req, res) => {
    console.log("req", req.query);
    const query = req.query;
    res.send("wadudu");
    try {
      // const search = req.query.s || 'naruto';
      var url = `https://google-search74.p.rapidapi.com/?query=${query.q}&limit=${query.l}`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

// OMDB
apiRouter.get(
  "/film",
  expressAsyncHandler(async (req, res) => {
    try {
      const search = req.query.s || "naruto";
      var url = `http://www.omdbapi.com/?apikey=${film_key}&s=${search}`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/film/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      var url = `http://www.omdbapi.com/?apikey=${film_key}&i=${req.params.id}`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

// YT-downloader
let thisName = "";

apiRouter.get(
  "/videoInfo",
  expressAsyncHandler(async (req, res) => {
    const videoURL = req.query.videoURL;
    const info = await ytdl.getInfo(videoURL);
    res.status(200).json(info);
  })
);

apiRouter.post(
  "/setname",
  expressAsyncHandler(async (req, res) => {
    thisName = req.body.videoName;
    res.send("setname");
  })
);

// ig downloader
const getVideo = async (url) => {
  const html = await axios.get(url);
  const $ = cheerio.load(html.data);
  const videoString = $("meta[property='og:video']").attr("content");
  return videoString;
};

apiRouter.get(
  "/ig",
  expressAsyncHandler(async (req, res) => {
    res.send("it works");
  })
);

apiRouter.post(
  "/ig",
  expressAsyncHandler(async (req, res) => {
    try {
      const videoLink = await getVideo(req.body.url);
      if (videoLink !== undefined) {
        res.json({ downloadLink: videoLink });
      } else {
        res.json({ error: "The link you have entered is invalid. " });
      }
    } catch (err) {
      res.json({
        error: "There is a problem with the link you have provided.",
      });
    }
  })
);

apiRouter.get(
  "/ig2",
  expressAsyncHandler(async (req, res) => {
    const v =
      "https://www.instagram.com/tv/COXYd0Dgk59/?utm_source=ig_web_copy_link";
    const videoURL = req.query.videoURL;

    try {
      const videoLink = await getVideo(videoURL);
      if (videoLink !== undefined) {
        res.json({ downloadLink: videoLink });
      } else {
        res.json({ error: "The link you have entered is invalid. " });
      }
    } catch (err) {
      res.json({
        error: "There is a problem with the link you have provided.",
      });
    }
  })
);

apiRouter.get(
  "/ig3",
  expressAsyncHandler(async (req, res) => {
    const videoURL = req.query.videoURL || "";
    try {
      const videoLink = await instagramGetUrl(videoURL);
      if (videoLink !== undefined) {
        res.json({ downloadLink: videoLink.url_list[0] });
      } else {
        res.json({ error: "The link you have entered is invalid. " });
      }
    } catch (err) {
      res.json({
        error: "There is a problem with the link you have provided.",
      });
    }
  })
);

//

apiRouter.get(
  "/download",
  expressAsyncHandler(async (req, res) => {
    const videoURL = req.query.videoURL;
    const itag = req.query.itag;
    const myname = `${thisName}.mp4`;
    res.header("Content-Disposition", `attachment;\ filename=${myname}`);
    ytdl(videoURL, {
      filter: (format) => format.itag == itag,
    }).pipe(res);
  })
);

apiRouter.get(
  "/surah/:id",
  expressAsyncHandler(async (req, res) => {
    const dataSurah = JSON.parse(
      fs.readFileSync(`assets/surah/${req.params.id}.json`)
    );
    res.send(dataSurah);
  })
);

apiRouter.get(
  "/check-env",
  expressAsyncHandler(async (req, res) => {
    res.send({ weatherbit_key, mongo, raja_ongkir_key, mongo2 });
  })
);

apiRouter.get(
  "/check-ip",
  expressAsyncHandler(async (req, res) => {
    const myip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

    const ip =
      (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
      req.socket.remoteAddress;
    // console.log('myip', myip)

    const data = {
      ip1: myip,
      ip2: ip,
    };

    console.log(data);

    res.send(data);
  })
);

apiRouter.get(
  "/music/video",
  expressAsyncHandler(async (req, res) => {
    try {
      const urlVideo = req.query.q || "";
      const url = `https://www.shazam.com/video/v3/-/-/web/385334817/youtube/video?q=${urlVideo}`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/video/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = req.params.id;
      console.log("url", url);
      const result = await axios.get(url);
      res.send(result);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/search",
  expressAsyncHandler(async (req, res) => {
    try {
      const title = req.query.q || "";
      const url = `https://www.shazam.com/services/search/v3/en-US/ID/web/search?query=${title}&numResults=3&offset=0&types=artists,songs`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/track/similarities/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://www.shazam.com/shazam/v3/en-US/ID/web/-/tracks/track-similarities-id-${req.params.id}?startFrom=0&pageSize=20&connected=`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/album-featured-in/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://www.shazam.com/services/amapi/custom/en/ID/albumfeaturedin/${req.params.id}`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/count/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://www.shazam.com/services/count/v2/web/track/${req.params.id}`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/artist-top-tracks/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://cdn.shazam.com/shazam/v3/en-US/ID/web/-/tracks/artisttoptracks_${req.params.id}?startFrom=0&pageSize=20&connected=`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/artist/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://www.shazam.com/discovery/v3/en-US/ID/web/artist/${req.params.id}?shazamapiversion=v3&video=v3`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/artist/bio/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://www.shazam.com/services/amapi/v1/catalog/ID/artists/${req.params.id}?extend=artistBio%2CbornOrFormed%2CeditorialArtwork%2Corigin&views=featured-release%2Cfull-albums%2Cappears-on-albums%2Cfeatured-albums%2Cfeatured-on-albums%2Csingles%2Ccompilation-albums%2Clive-albums%2Clatest-release%2Ctop-music-videos%2Csimilar-artists%2Ctop-songs%2Cplaylists%2Cessential-albums`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/discovery/ID",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://www.shazam.com/shazam/v3/en-US/ID/web/-/tracks/risers-country-chart-ID?pageSize=20&startFrom=0`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/top20/global",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://www.shazam.com/shazam/v3/en-US/ID/web/-/tracks/world-chart-world?pageSize=20&startFrom=0`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/top200/global",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://www.shazam.com/shazam/v3/en-US/ID/web/-/tracks/world-chart-world?pageSize=200&startFrom=0`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/top20/ID",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://www.shazam.com/shazam/v3/en-US/ID/web/-/tracks/ip-country-chart-ID?pageSize=20&startFrom=0`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/top200/ID",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://www.shazam.com/shazam/v3/en-US/ID/web/-/tracks/ip-country-chart-ID?pageSize=200&startFrom=0`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/music/track/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://www.shazam.com/discovery/v5/en-US/ID/web/-/track/${req.params.id}?shazamapiversion=v3&video=v3`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/category",
  expressAsyncHandler(async (req, res) => {
    const category = await Categories.find({});
    res.send(category);
  })
);

apiRouter.post(
  "/category",
  expressAsyncHandler(async (req, res) => {
    const category = new Categories({
      name: req.body.name,
    });
    const createdCategories = await category.save();
    res.send({
      _id: createdCategories._id,
      name: createdCategories.name,
    });
  })
);

apiRouter.get(
  "/chat",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `https://fdciabdul.tech/api/ayla/?pesan=hai`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.post(
  "/blog",
  expressAsyncHandler(async (req, res) => {
    try {
      const blog = new Blog({
        title: req.body.title,
        body: req.body.body,
        category: req.body.category,
        banner: req.body.banner,
        view: 1,
      });
      const createdBlog = await blog.save();
      res.status(201).send({ message: "New Blog Created", blog: createdBlog });
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/blog",
  expressAsyncHandler(async (req, res) => {
    try {
      const pageSize = 10;
      const page = Number(req.query.pageNumber) || 1;
      const category = req.query.category || "";
      const title = req.query.q || "";
      const categoryFilter = category ? { category } : {};
      const nameFilter = title
        ? { title: { $regex: title, $options: "i" } }
        : {};

      const count = await Blog.count({
        ...nameFilter,
        ...categoryFilter,
      });

      const blogs = await Blog.find({
        ...categoryFilter,
        ...nameFilter,
      })
        .skip(pageSize * (page - 1))
        .limit(pageSize);
      res.send({ blogs, page, pages: Math.ceil(count / pageSize) });
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/blog/:id",
  expressAsyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.send(blog);
    } else {
      res.status(404).send({ message: "blog Not Found" });
    }
  })
);

apiRouter.put(
  "/blog/view/:id",
  expressAsyncHandler(async (req, res) => {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    const initView = blog.view ? blog.view : 0;
    if (blog) {
      blog.view = initView + 1;
      const updateViewBlog = await blog.save();
      res.send({ message: "Blog View Updated", blog: updateViewBlog });
    } else {
      res.status(404).send({ message: "Blog Not Found" });
    }
  })
);

apiRouter.get(
  "/check-resi",
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: "GET",
      url: `https://api.binderbyte.com/v1/track?api_key=${binderbyte_Key}&courier=${req.query.kurir}&awb=${req.query.resi}`,
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body));
    });
  })
);

apiRouter.get(
  "/province",
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/province",
      headers: { key: raja_ongkir_key },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body));
    });
  })
);

apiRouter.get(
  "/ongkir/city",
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/city",
      headers: { key: raja_ongkir_key },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body));
    });
  })
);

apiRouter.get(
  "/ongkir/city/:id",
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/city",
      qs: { province: req.params.id },
      headers: { key: raja_ongkir_key },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body));
    });
  })
);

apiRouter.get(
  "/ongkir/province",
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/province",
      headers: { key: raja_ongkir_key },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body));
    });
  })
);

apiRouter.get(
  "/ongkir/:id/:weight",
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: "POST",
      url: "https://api.rajaongkir.com/starter/cost",
      headers: {
        key: raja_ongkir_key,
        "content-type": "application/x-www-form-urlencoded",
      },
      form: {
        origin: "419",
        destination: req.params.id,
        weight: req.params.weight,
        courier: "jne",
      },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body));
    });
  })
);

apiRouter.post(
  "/ongkir/costs",
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: "POST",
      url: "https://api.rajaongkir.com/starter/cost",
      headers: {
        key: raja_ongkir_key,
        "content-type": "application/x-www-form-urlencoded",
      },
      form: {
        origin: req.body.origin,
        destination: req.body.destination,
        weight: req.body.weight,
        courier: req.body.courier,
      },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      res.send(JSON.parse(body));
    });
  })
);

apiRouter.post(
  "/shorten",
  expressAsyncHandler(async (req, res) => {
    const { longUrl } = req.body;
    const urlCode = shortid.generate();
    if (validUrl.isUri(longUrl)) {
      try {
        let url = await Url.findOne({ longUrl });
        if (url) {
          res.json(url);
        } else {
          const shortUrl = "http://www.nuxt.my.id/s/" + urlCode;

          url = new Url({
            longUrl,
            shortUrl,
            urlCode,
            date: new Date(),
          });

          await url.save();

          res.json(url);
        }
      } catch (err) {
        console.log(err);
        res.status(500).json("server error");
      }
    } else {
      res.status(401).json("Invalid long url");
    }
  })
);

apiRouter.get(
  "/cuaca",
  expressAsyncHandler(async (req, res) => {
    console.log("req cuaca", req.query, "weatherbit_key", weatherbit_key);
    const key = weatherbit_key || `input_key`;
    const lang = req.query.lang || `en`;
    const lat = req.query.lat || `-7.663640`;
    const long = req.query.long || `111.324669`;
    const city = req.query.city || "Sleman";
    const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${long}&key=${key}&lang=${lang}`;
    const result = await axios.get(url);
    res.send(result.data);
  })
);

apiRouter.get(
  "/091125/profile",
  expressAsyncHandler(async (req, res) => {
    try {
      res.send({
        data: profileData,
        error: "",
        status: 200,
      });
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/091125/news",
  expressAsyncHandler(async (req, res) => {
    try {
      res.send({
        data: newsData,
        error: "",
        status: 200,
      });
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/091125/online",
  expressAsyncHandler(async (req, res) => {
    try {
      res.send({
        data: onlineData,
        error: "",
        status: 200,
      });
    } catch (err) {
      res.send(err);
    }
  })
);

apiRouter.get(
  "/091125/notifications",
  expressAsyncHandler(async (req, res) => {
    try {
      res.send({
        data: notificationsData,
        error: "",
        status: 200,
      });
    } catch (err) {
      res.send(err);
    }
  })
);

// export default apiRouter;
module.exports = apiRouter;
