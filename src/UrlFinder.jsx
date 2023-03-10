"use client";
import React, { useState } from "react";
import axios from "axios";

const UrlFinder = () => {
  const [data, setData] = useState("");

  const [find, setFind] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const encodedParams = new URLSearchParams();
    encodedParams.set("url", data);

    const options = {
      method: "POST",
      url: "https://www.virustotal.com/api/v3/urls",
      headers: {
        accept: "application/json",
        "x-apikey":
          "637f51edba5276f9335ff950f68ee2a85f337123de040603316646105f248442",
        "content-type": "application/x-www-form-urlencoded",
      },
      data: encodedParams,
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data.data.id);
        const id = response.data.data.id;
        const newId = id.substring(id.indexOf("-") + 1, id.lastIndexOf("-"));
        const options = {
          method: "GET",
          url: `https://www.virustotal.com/api/v3/urls/${newId}`,
          headers: {
            accept: "application/json",
            "x-apikey":
              "637f51edba5276f9335ff950f68ee2a85f337123de040603316646105f248442",
          },
        };

        axios
          .request(options)
          .then(function (response) {
            setFind(response.data.data.attributes.last_analysis_stats);
            setLoading(false);
          })
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error(error);
      });
    }, 3000);
  };

  return (
    <div
      className={
        find?.malicious > 0
          ? "bg-red-600 w-screen h-screen flex flex-col justify-center items-center"
          : find?.malicious === 0 && find?.suspicious === 0
          ? "bg-green-600 w-screen h-screen flex flex-col justify-center items-center"
          : "bg-global-bg w-screen h-screen bg-no-repeat bg-center bg-cover "
      }
    >
      <div className="backdrop-blur-sm bg-white/10 h-full w-full flex flex-col justify-center items-center">
        <div className="w-full text-center mb-12 text-6xl font-semibold uppercase tracking-[10px] text-white">
          {find?.malicious > 0
            ? "This URL may be malicious!!!"
            : find?.malicious === 0 && find?.suspicious === 0
            ? "This URL seems Safe"
            : "Malicious Website Detector"}
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="px-4 py-2 border w-96 rounded"
            placeholder="Enter Website URL"
          />
          <br />
          <div className="flex flex-row justify-around items-center w-1/4">
          <button
            className="px-4 py-1 bg-blue-600 rounded mt-4 text-white"
            disabled={loading ? true : false}
            onClick={handleSubmit}
          >
            {loading === false ? (
              "Submit"
            ) : (
              <div role="status">
                <svg
                  aria-hidden="true"
                  class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-black"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            )}
          </button>
          <button className="px-4 py-1 bg-red-800 text-white mt-4 rounded" onClick={() => {setFind(null); setData('')}}>Reset</button>
          </div>
        </div>
        {find && (
          <div className="mt-4 border-t border-t-black pt-2 w-full text-white">
            <h1 className="text-5xl mt-4 w-full text-center">Results</h1>
            <div className="flex flex-row justify-between px-12 w-full  mt-16">
              <div className="flex flex-col justify-center items-start text-xl">
                Harmless: <p>{find.harmless}</p>
              </div>
              <div className="flex flex-col justify-center items-start text-xl">
                Suspicious: <p>{find.suspicious}</p>
              </div>
              <div className="flex flex-col justify-center items-start text-xl">
                Malicious: <p>{find.malicious}</p>
              </div>
              <div className="flex flex-col justify-center items-start text-xl">
                Undetected: <p>{find.undetected}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlFinder;
