/*
Import Cherrio Library and initalize constant  and import  a node fetcher as a constant 
*/
const cherrio_scrapper = require("cherrio");
const fetcher = require("node-fetch");

//Function that maps each element selected to an element in the puppeteer 
function map(selection, mapper) {
    return selection.toArray().map((el, i) => mapper(cherrio_scrapper(el), i));
  }

 /*
Function that parses items in correct format, takes in the HTML code for each part of the items fields and converts it to text and trims it.
For vegan and gluten fee, returns true or false if it fits those parameters. 
*/
  function parse(item) {
    return {
      name: item.find(".site-panel__daypart-item-title").text().trim(),
      desc: item.find(".site-panel__daypart-item-description").text().trim(),
      vegan:
        item.find(".site-panel__daypart-item-cor-icons [alt*=vegan i]").length >
        0,
      gf:
        item.find(
          ".site-panel__daypart-item-cor-icons [alt*='gluten-containing ingredients' i]"
        ).length > 0,
    };
  }  
  // Initalize constant that states what is currently being served: Serving + whitespace 
  const mealRe = /^Serving (\w+)/;

  
  module.exports = async (req, res) => {
      /**
       * First let scrapper fetch website information and then convert it to text 
       */
    const $ = await fetcher("https://dining.brown.edu/cafe/sharpe-refectory")
      .then((res) => res.text())
      .then(cherrio_scrapper.load);

    /*
    Create an Array on javascript that contains the current meal of the day, convert it to text, trim and return the meal currently being served, or an empty array 
    */  
    const [, currentMeal] = $(".site-panel__cafeinfo-currently")
      .text()
      .trim()
      .match(mealRe) || [, null];
      
    const meal = currentMeal || "Breakfast";
    /**
     * If process succeeds, display current meal of the day (provided there is a current meal being served) and display menu which parses every item in menu to desired display 
     */
    res.status(200).json({
      meal: `Ratty ${currentMeal}`,
      open: currentMeal != null,
      menu: map($(`#${meal.toLowerCase()} .site-panel__daypart-item`), parse),
    });
  };