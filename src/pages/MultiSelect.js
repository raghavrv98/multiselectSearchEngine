import React, { useEffect, useState } from "react";
import "../App.css";

const MultiSelect = (props) => {
  const { data, loading, dataFromChild, errorMsg } = props;

  const [selectedValues, updateSelectedValues] = useState([]);
  const [typedValue, updateTypedValue] = useState("");
  const [displayOptions, updateDisplayOptions] = useState(false);
  const [filteredData, updateFilteredData] = useState([]);
  const [submitResult, updateSubmitResult] = useState("");

  //To make copy for original Data
  useEffect(() => {
    const currentFilteredData = data ? [...data] : [];
    updateFilteredData(currentFilteredData);
  }, [data, loading]);

  //Function to handle for dynamic search
  const onSearchHandler = (e) => {
    const value = e.target.value;
    let currentFilteredData = data ? [...data] : [];
    let currentFilteredArray = currentFilteredData?.filter((val) =>
      val.API.toLowerCase().includes(value.toLowerCase())
    );
    if (value.length > 0) {
      dataFromChild(value);
    }

    updateFilteredData(currentFilteredArray);
    updateTypedValue(value);
    updateDisplayOptions(true);
  };

  // Function to handle onclick on given options
  const onClickOptionHandler = (index) => {
    const currentFilteredData = JSON.parse(JSON.stringify(filteredData));
    let currentSelectedValues = [...selectedValues];

    const filteredDataObj = currentFilteredData[index];
    const isCheckedFlag = currentFilteredData[index].checked || false;
    const removeIndexFromSelectedValues = currentSelectedValues.findIndex(
      (val) => val?.API === filteredDataObj?.API
    );

    if (isCheckedFlag) {
      filteredDataObj.checked = false;
      currentSelectedValues.splice(removeIndexFromSelectedValues, 1);
    } else {
      filteredDataObj.checked = true;
      currentSelectedValues.push(filteredDataObj);
    }

    updateSelectedValues(currentSelectedValues);
    updateFilteredData(currentFilteredData);
    updateSubmitResult("");
  };

  // Function to handle on remove chips from input field
  const onRemoveHandler = (index) => {
    const currentFilteredData = [...filteredData];
    const currentSelectedValues = [...selectedValues];

    const isCheckedObj = currentFilteredData.find(
      (val) => val?.API === currentSelectedValues[index]?.API
    );

    if (isCheckedObj) {
      isCheckedObj.checked = false;
    }
    currentSelectedValues.splice(index, 1);

    updateSelectedValues(currentSelectedValues);
    updateFilteredData(currentFilteredData);
  };

  // Function to handle clear every filter
  const onCloseOptionMenuHandler = () => {
    const filteredData = data ? [...data] : [];

    updateFilteredData(filteredData);
    updateDisplayOptions(false);
    updateSelectedValues([]);
    updateTypedValue("");
  };

  // Function to handle checkbox data
  const checkedHandler = (index) => {
    const currentFilteredData = [...filteredData];
    let currentSelectedValues = [...selectedValues];

    if (currentFilteredData.length > 0) {
      currentSelectedValues.map(val => {
        const changedIndex = currentFilteredData.findIndex(value => value.API === val.API)
        if (changedIndex >= 0) {
          currentFilteredData[changedIndex].checked = val.checked
        }
      })
    }

    return currentFilteredData[index]?.checked || false;
  };

  // Function to handle submission
  const submitHandler = () => {
    if (selectedValues.length === 0 && typedValue.length === 0) return null;
    selectedValues.map((val) => delete val.checked);
    updateSubmitResult(selectedValues);
    updateDisplayOptions(false);
  };

  return (
    <>
      <div className="searchBox">
        <div className="inputChipContainer">
          {selectedValues.length > 0 && (
            <ul className="chipUl">
              {selectedValues.map((val, index) => (
                <li key={index} className="chip">
                  <button
                    onClick={() => onRemoveHandler(index)}
                    className="removeChip"
                  >
                    X
                  </button>
                  {val.API}
                </li>
              ))}
            </ul>
          )}
          <input
            className="multiSelectInputField"
            onChange={onSearchHandler}
            value={typedValue}
            style={{
              width: `calc(100% - ${(document.getElementsByClassName("chip").length + 1) * 11
                }%)`,
            }}
          />
          {(displayOptions || selectedValues.length > 0) && !loading && !errorMsg && (
            <span onClick={onCloseOptionMenuHandler} className="closeOptionMenu">
              X
            </span>
          )}
        </div>
        <button
          onClick={submitHandler}
          className={selectedValues.length > 0 ? "searchButton" : "searchDisable"}
        >
          Search
        </button>
      </div>
      {loading && !errorMsg ? (
        <p className="loadingText">Please Wait... Data is Fetching..</p>
      ) : errorMsg ? (
        <p className="error">{`Error : ${errorMsg}... Please refresh Page`}</p>
      ) : (
        displayOptions && (
          <div className="multiSelectBoxContainer">
            {filteredData.length > 0 ? (
              <ul>
                {filteredData.map((val, index) => {
                  return (
                    <li
                      className="dropdownLi"
                      key={index}
                    >
                      <span>
                        <input
                          checked={checkedHandler(index)}
                          onChange={() => onClickOptionHandler(index)}
                          className="checkbox"
                          type="checkbox"
                        />
                        {val.API}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="noRecords">No Records Found</div>
            )}
          </div>
        )
      )}
      {submitResult.length > 0 && !loading && !errorMsg && (
        <div className="payloadContainer">
          <p>Search Results:</p>
          <p className="payload">{JSON.stringify(submitResult)}</p>
        </div>
      )}
    </>
  );
};

export default MultiSelect;
