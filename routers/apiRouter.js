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
  rolesData,
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
const kbbi_url = process.env.KBBI_URL;
const music_api = process.env.MUSIC_API;


// Playground
/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Returns a pong message
 *     responses:
 *       200:
 *         description: A pong message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: pong
 */
apiRouter.get(
  "/ping",
  expressAsyncHandler(async (req, res) => {
    res.json({ message: "pong" });
  })
);
/**
 * @swagger
 * /random/image/{square}:
 *   get:
 *     summary: Get a random square image
 *     parameters:
 *       - in: path
 *         name: square
 *         schema:
 *           type: integer
 *         required: true
 *         description: Size of the square image
 *     responses:
 *       200:
 *         description: An image
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 */
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

/**
 * @swagger
 * /midtrans-token:
 *   post:
 *     summary: Create Midtrans transaction token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               price:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction token created
 */
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

/**
 * @swagger
 * /google-maps:
 *   get:
 *     summary: Search on Google Maps
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Query string
 *     responses:
 *       200:
 *         description: Map data
 */
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

/**
 * @swagger
 * /google-videos:
 *   get:
 *     summary: Search Google Videos
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Query string
 *     responses:
 *       200:
 *         description: Video search results
 */
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

/**
 * @swagger
 * /google-images:
 *   get:
 *     summary: Search Google Images
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Query string
 *     responses:
 *       200:
 *         description: Image search results
 */
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

/**
 * @swagger
 * /google-search:
 *   get:
 *     summary: Google Web Search
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Query string
 *     responses:
 *       200:
 *         description: Web search results
 */
apiRouter.get(
  "/google-search",
  expressAsyncHandler(async (req, res) => {
    const query = req.query;

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
/**
 * @swagger
 * /film:
 *   get:
 *     summary: Search for films
 *     parameters:
 *       - in: query
 *         name: s
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of films
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
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

/**
 * @swagger
 * /videoInfo:
 *   get:
 *     summary: Get YouTube video info
 *     parameters:
 *       - in: query
 *         name: videoURL
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Video info
 */
apiRouter.get(
  "/videoInfo",
  expressAsyncHandler(async (req, res) => {
    const videoURL = req.query.videoURL;
    const info = await ytdl.getInfo(videoURL);
    res.status(200).json(info);
  })
);

/**
 * @swagger
 * /setname:
 *   post:
 *     summary: Set video name
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Name set
 */
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

/**
 * @swagger
 * /ig:
 *   get:
 *     summary: Check IG service status
 *     responses:
 *       200:
 *         description: Service working
 */
apiRouter.get(
  "/ig",
  expressAsyncHandler(async (req, res) => {
    res.send("it works");
  })
);

/**
 * @swagger
 * /ig:
 *   post:
 *     summary: Download Instagram video (Method 1)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Download link
 */
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

/**
 * @swagger
 * /ig2:
 *   get:
 *     summary: Download Instagram video (Method 2)
 *     parameters:
 *       - in: query
 *         name: videoURL
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Download link
 */
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

/**
 * @swagger
 * /ig3:
 *   get:
 *     summary: Download Instagram video (Method 3)
 *     parameters:
 *       - in: query
 *         name: videoURL
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Download link
 */
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

/**
 * @swagger
 * /download:
 *   get:
 *     summary: Download YouTube video
 *     parameters:
 *       - in: query
 *         name: videoURL
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: itag
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Video file download
 */
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

/**
 * @swagger
 * /surah/{id}:
 *   get:
 *     summary: Get Surah by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Surah data
 */
apiRouter.get(
  "/surah/:id",
  expressAsyncHandler(async (req, res) => {
    const dataSurah = JSON.parse(
      fs.readFileSync(`assets/surah/${req.params.id}.json`)
    );
    res.send(dataSurah);
  })
);

/**
 * @swagger
 * /check-env:
 *   get:
 *     summary: Check environment variables
 *     responses:
 *       200:
 *         description: Environment info
 */
apiRouter.get(
  "/check-env",
  expressAsyncHandler(async (req, res) => {
    res.send({ weatherbit_key, mongo, raja_ongkir_key, mongo2 });
  })
);

/**
 * @swagger
 * /check-ip:
 *   get:
 *     summary: Check IP address
 *     responses:
 *       200:
 *         description: IP info
 */
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

/**
 * @swagger
 * /music/video:
 *   get:
 *     summary: Search music video
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Query string
 *     responses:
 *       200:
 *         description: Music video search results
 */
apiRouter.get(
  "/music/video",
  expressAsyncHandler(async (req, res) => {
    try {
      const urlVideo = req.query.q || "";
      const url = `${music_api}/search?q=${urlVideo}&limit=1`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/video/{id}:
 *   get:
 *     summary: Get music video by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Music video info
 */
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

/**
 * @swagger
 * /music/search:
 *   get:
 *     summary: Search music tracks
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Query string
 *     responses:
 *       200:
 *         description: Music search results
 */
apiRouter.get(
  "/music/search",
  expressAsyncHandler(async (req, res) => {
    try {
      const title = req.query.q || "";
      const url = `${music_api}/search?q=${title}&limit=3`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/track/similarities/{id}:
 *   get:
 *     summary: Get similar tracks
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Similar tracks
 */
apiRouter.get(
  "/music/track/similarities/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `${music_api}/track/${req.params.id}`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/album-featured-in/{id}:
 *   get:
 *     summary: Get albums featuring track
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Album list
 */
apiRouter.get(
  "/music/album-featured-in/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `${music_api}/album/${req.params.id}`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/count/{id}:
 *   get:
 *     summary: Get track play count
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Count info
 */
apiRouter.get(
  "/music/count/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `${music_api}/track/${req.params.id}`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/artist-top-tracks/{id}:
 *   get:
 *     summary: Get artist top tracks
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Top tracks
 */
apiRouter.get(
  "/music/artist-top-tracks/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `${music_api}/artist/${req.params.id}/top?limit=20`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/artist/{id}:
 *   get:
 *     summary: Get artist info
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Artist info
 */
apiRouter.get(
  "/music/artist/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `${music_api}/artist/${req.params.id}`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/artist/bio/{id}:
 *   get:
 *     summary: Get artist biography
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Artist bio
 */
apiRouter.get(
  "/music/artist/bio/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `${music_api}/artist/${req.params.id}`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/discovery/ID:
 *   get:
 *     summary: Get music discovery for Indonesia
 *     responses:
 *       200:
 *         description: Discovery list
 */
apiRouter.get(
  "/music/discovery/ID",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `${music_api}/chart/0/tracks?limit=20`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/top20/global:
 *   get:
 *     summary: Get Top 20 Global tracks
 *     responses:
 *       200:
 *         description: Top 20 Global tracks
 */
apiRouter.get(
  "/music/top20/global",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `${music_api}/chart/0/tracks?limit=20`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/top200/global:
 *   get:
 *     summary: Get Top 200 Global tracks
 *     responses:
 *       200:
 *         description: Top 200 Global tracks
 */
apiRouter.get(
  "/music/top200/global",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `${music_api}/chart/0/tracks?limit=200`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/top20/ID:
 *   get:
 *     summary: Get Top 20 Indonesia tracks
 *     responses:
 *       200:
 *         description: Top 20 Indonesia tracks
 */
apiRouter.get(
  "/music/top20/ID",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `${music_api}/playlist/1116188761/tracks?limit=20`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/top200/ID:
 *   get:
 *     summary: Get Top 200 Indonesia tracks
 *     responses:
 *       200:
 *         description: Top 200 Indonesia tracks
 */
apiRouter.get(
  "/music/top200/ID",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `${music_api}/playlist/1116188761/tracks?limit=200`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /music/track/{id}:
 *   get:
 *     summary: Get track info by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Track info
 */
apiRouter.get(
  "/music/track/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const url = `${music_api}/track/${req.params.id}`;
      const result = await axios.get(url);
      res.send(result.data);
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 */
apiRouter.get(
  "/category",
  expressAsyncHandler(async (req, res) => {
    const category = await Categories.find({});
    res.send(category);
  })
);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a category
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category created
 */
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

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Chat API (Ayla)
 *     responses:
 *       200:
 *         description: Chat response
 */
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

/**
 * @swagger
 * /blog:
 *   post:
 *     summary: Create a blog post
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               category:
 *                 type: string
 *               banner:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog created
 */
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

/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Get blogs with pagination and search
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of blogs
 */
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

/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Get blog by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Blog detail
 */
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

/**
 * @swagger
 * /blog/view/{id}:
 *   put:
 *     summary: Increment blog view count
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: View updated
 */
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

/**
 * @swagger
 * /check-resi:
 *   get:
 *     summary: Check shipment receipt (resi)
 *     parameters:
 *       - in: query
 *         name: kurir
 *         schema:
 *           type: string
 *       - in: query
 *         name: resi
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resi info
 */
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

/**
 * @swagger
 * /province:
 *   get:
 *     summary: Get provinces (RajaOngkir)
 *     responses:
 *       200:
 *         description: Province list
 */
apiRouter.get(
  "/province",
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: "GET",
      url: "https://rajaongkir.komerce.id/api/v1/destination/province",
      headers: { key: raja_ongkir_key },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body));
    });
  })
);

/**
 * @swagger
 * /ongkir/city:
 *   get:
 *     summary: Get cities (RajaOngkir)
 *     responses:
 *       200:
 *         description: City list
 */
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

/**
 * @swagger
 * /ongkir/city/{id}:
 *   get:
 *     summary: Get city by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: City info
 */
apiRouter.get(
  "/ongkir/city/:id",
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: "GET",
      url: `https://rajaongkir.komerce.id/api/v1/destination/city/${req.params.id}`,
      // qs: { province: req.params.id },
      headers: { key: raja_ongkir_key },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body));
    });
  })
);

/**
 * @swagger
 * /ongkir/province:
 *   get:
 *     summary: Get provinces (Alt)
 *     responses:
 *       200:
 *         description: Province list
 */
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

/**
 * @swagger
 * /ongkir/{id}/{weight}:
 *   get:
 *     summary: Calculate shipping cost (GET)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *       - in: path
 *         name: weight
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cost info
 */
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

/**
 * @swagger
 * /ongkir/costs:
 *   post:
 *     summary: Calculate shipping cost (POST)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               weight:
 *                 type: integer
 *               courier:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cost info
 */
apiRouter.post(
  "/ongkir/costs",
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: "POST",
      url: "https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost",
      headers: {
        key: raja_ongkir_key,
        accept: "application/json",
        "content-type": "application/json",
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

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Shorten a URL
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Short URL
 */
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
          const shortUrl = "https://ngodingbentar-be-v4.vercel.app/s/" + urlCode;

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

/**
 * @swagger
 * /cuaca:
 *   get:
 *     summary: Get current weather
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Weather data
 */
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

/**
 * @swagger
 * /kbbi/{id}:
 *   get:
 *     summary: Get KBBI definition
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Definition
 */
apiRouter.get(
  "/kbbi/:id",
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: "GET",
      url: `${kbbi_url}/${req.params.id}`,
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body));
    });
  })
);

/**
 * @swagger
 * /091125/profile:
 *   get:
 *     summary: Get dummy profile data
 *     responses:
 *       200:
 *         description: Profile data
 */
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

/**
 * @swagger
 * /091125/news:
 *   get:
 *     summary: Get dummy news data
 *     responses:
 *       200:
 *         description: News data
 */
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

/**
 * @swagger
 * /091125/online:
 *   get:
 *     summary: Get dummy online data
 *     responses:
 *       200:
 *         description: Online data
 */
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

/**
 * @swagger
 * /091125/notifications:
 *   get:
 *     summary: Get dummy notifications
 *     responses:
 *       200:
 *         description: Notifications
 */
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

/**
 * @swagger
 * /091125/roles:
 *   get:
 *     summary: Get dummy roles
 *     responses:
 *       200:
 *         description: Roles
 */
apiRouter.get(
  "/091125/roles",
  expressAsyncHandler(async (req, res) => {
    try {
      res.send({
        code: 200,
        msg: "oke",
        data: rolesData,
      });
    } catch (err) {
      res.send(err);
    }
  })
);

/**
 * @swagger
 * /091125/activity:
 *   get:
 *     summary: Get dummy activity
 *     responses:
 *       200:
 *         description: Activity
 */
apiRouter.get(
  "/091125/activity",
  expressAsyncHandler(async (req, res) => {
    try {
      res.send({
        error: "",
        status: 200,
        data: {
          check_in: "2025-11-11T09:33:00+07:00",
          check_out: null,
          status: "CHECKED_IN",
        },
      });
    } catch (err) {
      res.send(err);
    }
  })
);

// export default apiRouter;
module.exports = apiRouter;
