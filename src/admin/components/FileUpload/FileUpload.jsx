import React, { useState } from 'react'

export default function FileUpload({ onFileChange, fileData, fileDataEdit, setFileDataEdit }) {

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileDataEdit(null);
      onFileChange(e);
    }
  };

  const handleCancel = () => {
    onFileChange(null)
  };

  return (
    <div className=" h-[360px] w-full">
      <div className="container mx-auto max-w-screen-lg h-full">
        <article
          aria-label="File Upload Modal"
          className="relative h-full flex flex-col rounded-md"
        >
          <div id="gallery" className="flex flex-1 flex-wrap -m-1">
            <div className="flex items-center justify-center p-1 w-full h-auto">
              {fileDataEdit ? (
                <article
                  tabIndex="0"
                  className="group w-56 h-72 rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative shadow-sm"
                >
                  <img
                    alt="upload preview"
                    className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed"
                    src={`https://storeimageohd.blob.core.windows.net/images/${fileDataEdit}`}
                  />
                </article>
              ) : (
                fileData ? (
                  <article
                    tabIndex="0"
                    className="group w-56 h-72 rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative shadow-sm"
                  >
                    <img
                      alt="upload preview"
                      className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed"
                      src={URL.createObjectURL(fileData)}
                    />

                    <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                      <h1 className="flex-1 group-hover:text-blue-800">
                        {fileData.name}
                      </h1>
                      <div className="flex">
                        <span className="p-1 text-blue-800">
                          <i>
                            <svg
                              className="fill-current w-4 h-4 ml-auto pt-1"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                            </svg>
                          </i>
                        </span>
                        <p className="p-1 size text-xs">
                          {fileData.size > 1024
                            ? fileData.size > 1048576
                              ? Math.round(fileData.size / 1048576) + 'mb'
                              : Math.round(fileData.size / 1024) + 'kb'
                            : fileData.size + 'b'}
                        </p>
                        <button
                          className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800"
                          onClick={handleCancel}
                        >
                          <svg
                            className="pointer-events-none fill-current w-4 h-4 ml-auto"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              className="pointer-events-none"
                              d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
                            />
                          </svg>
                        </button>
                      </div>
                    </section>
                  </article>
                ) : (
                  <div className="flex w-56 h-72 bg-gray-300 overflow-hidden relative rounded items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                )
              )}
            </div>
          </div>
          {/* scroll area */}
          <section className="h-full overflow-auto p-3 w-full flex flex-col">
            <header className="border-gray-400 flex flex-col justify-center items-center">
              <input
                id="hidden-input"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                id="button"
                className="mt-2 rounded-sm px-4 py-2 border border-gray-300 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                onClick={() => document.getElementById('hidden-input').click()}
              >
                Upload a file
              </button>
            </header>
          </section>
        </article>
      </div>
    </div>
  )
}
