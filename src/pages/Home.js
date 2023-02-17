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

  const fetchData = (title, enableCache) => {
    const currentCachedObj = JSON.parse(JSON.stringify(cachedObj));
    const url = title
      ? `https://api.publicapis.org/entries?title=${title}`
      : "https://api.publicapis.org/entries";
    axios
      .get(url)
      .then(function (response) {
        const data = response?.data?.entries;
        updateLoading(false);
        if (enableCache) {
          currentCachedObj[title] = JSON.stringify(data);
          updateCachedObj(currentCachedObj);
        }
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
    return (title, enableCache) => {
      const currentCachedObj = JSON.parse(JSON.stringify(cachedObj));

      if (title in currentCachedObj) {
        return JSON.parse(currentCachedObj[title]);
      } else {
        updateLoading(true)
        func(title, enableCache)
        return null
      }
    };
  };

  const dataFromChild = _.debounce((title, enableCache) => {
    if (enableCache) {
      let cachedData = cacheHandler(fetchData)(title, enableCache);
      updateApiData(cachedData);
    }
    else {
      fetchData(title, enableCache);
    }
  }, 300);

  return (
    <>
      <div className="container">
        <h1>Steps to search</h1>
        <h3>1. Please Search any thing as Cat, Dog..etc in the search box</h3>
        <h3>2. Then Select any Option</h3>
        <h3>3. Click the search button for searching results</h3>
        <MultiSelect
          data={apiData}
          loading={loading}
          dataFromChild={dataFromChild}
          errorMsg={errorMsg}
          enableCache={true}
        />
      </div>
    </>
  );
};

export default Home;
