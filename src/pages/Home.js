/* eslint-disable react/jsx-no-duplicate-props */
import axios from "axios";
import React, { useState } from "react";
import "../App.css";
import MultiSelect from "./MultiSelect";
const _ = require("lodash");

const Home = () => {
  const [loading, updateLoading] = useState(false);
  const [apiData, updateApiData] = useState([]);
  const [errorMsg, updateErrorMsg] = useState("");
  const [cachedObj, updateCachedObj] = useState({});

  const fetchData = (title) => {
    const currentCachedObj = JSON.parse(JSON.stringify(cachedObj));
    const url = title
      ? `https://api.publicapis.org/entries?title=${title}`
      : "https://api.publicapis.org/entries";
    axios
      .get(url)
      .then(function (response) {
        const data = response?.data?.entries;
        updateLoading(false);
        currentCachedObj[title] = JSON.stringify(data);
        updateCachedObj(currentCachedObj);
        updateApiData(data)
        return data;
      })
      .catch(function (error) {
        updateErrorMsg(error.message);
        updateLoading(false);
      });
  };


  //Function for handling cache
  const cacheHandler = (func) => {
    return (title) => {
      const currentCachedObj = JSON.parse(JSON.stringify(cachedObj));

      if (title in currentCachedObj) {
        return JSON.parse(currentCachedObj[title]);
      } else {
        updateLoading(true)
        func(title)
        return null
      }
    };
  };

  const dataFromChild = _.debounce((title) => {
    let cachedData = cacheHandler(fetchData)(title);
    console.log('cachedData: ---', cachedData);
    updateApiData(cachedData);
  }, 300);

  console.log("cachedObj: ", cachedObj);


  return (
    <>
      <div className="container">
        <h1>Please Select any Option</h1>
        <MultiSelect
          data={apiData}
          loading={loading}
          dataFromChild={dataFromChild}
          errorMsg={errorMsg}
        />
      </div>
    </>
  );
};

export default Home;
