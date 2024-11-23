const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.get("/:count/news/for/:category", async (req, res) => {
  const { count, category } = req.params;

  const allowedCategories = ["business", "economic", "finances", "politics"];
  if (!allowedCategories.includes(category)) {
    return res.status(400).send("Неправильная категория. Допустимые категории: business, economic, finances, politics.");
  }

  const rssUrl = `https://www.vedomosti.ru/rss/rubric/${category}`;
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

  try {
    
    const response = await axios.get(apiUrl);
    const newsItems = response.data.items.slice(0, parseInt(count, 10)); 

    
    res.render("news", { category, count, newsItems });
  } catch (error) {
    console.error("Ошибка при получении данных:", error.message);
    res.status(500).send("Не удалось получить новости. Пожалуйста, попробуйте позже.");
  }
});


app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
